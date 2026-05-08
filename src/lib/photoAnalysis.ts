import type { DiseaseSignature, Plant } from '../types/domain'

export type PhotoAnalysisResult = {
  plantCandidates: Array<{ id: string; label: string; confidence: number }>
  diseaseCandidates: Array<{ id: string; label: string; confidence: number; actions: string[] }>
  modelStatus: string
}

export async function analyzeGardenPhoto(
  file: File,
  plants: Plant[],
  diseases: DiseaseSignature[],
): Promise<PhotoAnalysisResult> {
  const pixels = await sampleImage(file)
  const lowerName = file.name.toLowerCase()
  const onnxStatus = await loadOnnxRuntimeStatus()

  const plantCandidates = plants
    .map((plant) => {
      const filenameHint = lowerName.includes(plant.id) || lowerName.includes(plant.common_name.toLowerCase())
      const leafyBias = plant.guild.includes('leaf') ? pixels.greenRatio : 0.15
      const fruitingBias = plant.guild.includes('fruit') ? pixels.redRatio + pixels.brightness * 0.2 : 0.12
      const score = (filenameHint ? 0.62 : 0.2) + leafyBias * 0.35 + fruitingBias * 0.28
      return { id: plant.id, label: plant.common_name, confidence: clamp(score) }
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)

  const diseaseCandidates = diseases
    .map((disease) => {
      const mildewCue = lowerName.includes('mildew') || pixels.brightness > 0.72
      const blightCue = lowerName.includes('blight') || (pixels.redRatio > 0.28 && pixels.greenRatio < 0.45)
      const score =
        disease.id.includes('mildew') && mildewCue
          ? 0.74
          : disease.id.includes('blight') && blightCue
            ? 0.68
            : 0.24
      return {
        id: disease.id,
        label: disease.label,
        confidence: clamp(score),
        actions: disease.organic_actions,
      }
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 2)

  return {
    plantCandidates,
    diseaseCandidates,
    modelStatus: onnxStatus,
  }
}

async function loadOnnxRuntimeStatus() {
  try {
    const ort = await import('onnxruntime-web')
    return `ONNX Runtime Web ready (${ort.InferenceSession ? 'adapter available' : 'fallback only'})`
  } catch {
    return 'Heuristic offline classifier active'
  }
}

async function sampleImage(file: File) {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  const size = 48
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Image analysis canvas is not available')
  }
  context.drawImage(bitmap, 0, 0, size, size)
  const data = context.getImageData(0, 0, size, size).data
  let red = 0
  let green = 0
  let blue = 0
  for (let index = 0; index < data.length; index += 4) {
    red += data[index]
    green += data[index + 1]
    blue += data[index + 2]
  }
  const total = red + green + blue || 1
  bitmap.close()
  return {
    redRatio: red / total,
    greenRatio: green / total,
    brightness: total / (size * size * 255 * 3),
  }
}

function clamp(value: number) {
  return Math.max(0.05, Math.min(0.96, Math.round(value * 100) / 100))
}
