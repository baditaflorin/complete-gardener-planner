import type { DiseaseSignature, Plant } from '../types/domain'
import { currentCorrectionMemory } from './inference/corrections'
import { GardenInputError } from './inference/errors'
import { analyzeGardenEvidence } from './inference/engine'
import type { GardenInference, VisualSignals } from './inference/types'

export type PhotoAnalysisResult = GardenInference & {
  modelStatus: string
  performanceMs: number
}

let cachedOnnxStatus: string | null = null

export async function analyzeGardenPhoto(
  file: File,
  plants: Plant[],
  diseases: DiseaseSignature[],
  signal?: AbortSignal,
): Promise<PhotoAnalysisResult> {
  const started = performance.now()
  throwIfAborted(signal)
  const mediaType = mediaTypeFor(file)

  if (isUnsupportedMedia(mediaType, file.name) || file.size > 15 * 1024 * 1024) {
    analyzeGardenEvidence(
      {
        filename: file.name,
        mediaType,
        sizeBytes: file.size,
        text: file.name,
        visual: null,
      },
      { plants, diseases, correctionMemory: currentCorrectionMemory() },
    )
  }

  const [visual, modelStatus] = await Promise.all([sampleImage(file, signal), loadOnnxRuntimeStatus()])
  throwIfAborted(signal)
  const inference = analyzeGardenEvidence(
    {
      filename: file.name,
      mediaType,
      sizeBytes: file.size,
      text: file.name,
      visual,
    },
    { plants, diseases, correctionMemory: currentCorrectionMemory() },
  )

  return {
    ...inference,
    modelStatus,
    performanceMs: Math.round((performance.now() - started) * 10) / 10,
  }
}

async function loadOnnxRuntimeStatus() {
  if (cachedOnnxStatus) {
    return cachedOnnxStatus
  }
  try {
    const ort = await import('onnxruntime-web')
    cachedOnnxStatus = `ONNX Runtime Web ready (${ort.InferenceSession ? 'adapter available' : 'fallback only'})`
  } catch {
    cachedOnnxStatus = 'Heuristic offline classifier active'
  }
  return cachedOnnxStatus
}

async function sampleImage(file: File, signal?: AbortSignal): Promise<VisualSignals> {
  throwIfAborted(signal)
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch (caught) {
    throw new GardenInputError({
      kind: 'corrupt-image',
      what: 'This photo could not be decoded.',
      why: caught instanceof Error ? caught.message : 'The browser could not read usable pixels.',
      nowWhat: 'Upload the original photo again as a JPEG or PNG, ideally cropped to the affected plant.',
      recoverable: true,
    })
  }
  throwIfAborted(signal)
  const canvas = document.createElement('canvas')
  const size = 48
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    bitmap.close()
    throw new Error('Image analysis canvas is not available')
  }
  context.drawImage(bitmap, 0, 0, size, size)
  const data = context.getImageData(0, 0, size, size).data
  let red = 0
  let green = 0
  let blue = 0
  let whitePixels = 0
  let brownPixels = 0
  let yellowPixels = 0
  for (let index = 0; index < data.length; index += 4) {
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    red += r
    green += g
    blue += b
    if (r > 195 && g > 195 && b > 185) whitePixels += 1
    if (r > 95 && g > 45 && g < 130 && b < 95) brownPixels += 1
    if (r > 145 && g > 120 && b < 95) yellowPixels += 1
  }
  const pixelCount = size * size
  const total = red + green + blue || 1
  bitmap.close()
  return {
    redRatio: red / total,
    greenRatio: green / total,
    blueRatio: blue / total,
    brightness: total / (pixelCount * 255 * 3),
    whitePatchRatio: whitePixels / pixelCount,
    brownSpotRatio: brownPixels / pixelCount,
    yellowRatio: yellowPixels / pixelCount,
  }
}

function mediaTypeFor(file: File) {
  if (file.type) return file.type.toLowerCase()
  const lower = file.name.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.heic')) return 'image/heic'
  return 'application/octet-stream'
}

function isUnsupportedMedia(mediaType: string, filename: string) {
  return mediaType.includes('heic') || mediaType.includes('heif') || filename.toLowerCase().endsWith('.heic')
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Photo analysis was cancelled.', 'AbortError')
  }
}
