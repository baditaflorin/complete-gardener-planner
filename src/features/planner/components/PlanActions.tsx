import { useRef } from 'react'
import { ClipboardCopy, Download, FileInput, Link2, Printer, RotateCcw, Table } from 'lucide-react'
import type { GardenPlan, StaticData } from '../../../types/domain'
import {
  buildHarvestCsv,
  buildPlanSummary,
  encodeShareHash,
  parseGardenState,
  safeFilename,
  serializeGardenState,
} from '../../../lib/planIO'
import type { PlannerOutputs } from '../../../lib/plannerDerived'

type Props = {
  plan: GardenPlan
  data: StaticData
  outputs: PlannerOutputs
  onImportPlan: (plan: GardenPlan) => void
  onResetPlan: () => void
  onStatus: (message: string) => void
}

export function PlanActions({ plan, data, outputs, onImportPlan, onResetPlan, onStatus }: Props) {
  const importInput = useRef<HTMLInputElement>(null)

  async function importState(file: File | undefined) {
    if (!file) return
    try {
      const imported = parseGardenState(await file.text())
      onImportPlan(imported)
      onStatus(`Imported ${file.name}`)
    } catch (caught) {
      onStatus(caught instanceof Error ? caught.message : 'The selected state file could not be imported.')
    } finally {
      if (importInput.current) {
        importInput.current.value = ''
      }
    }
  }

  function exportState() {
    downloadText(
      safeFilename(plan.name, '.garden-state.json'),
      serializeGardenState(plan),
      'application/json;charset=utf-8',
    )
    onStatus('Downloaded state JSON')
  }

  function exportHarvestCsv() {
    downloadText(safeFilename(plan.name, '-harvest.csv'), buildHarvestCsv(outputs), 'text/csv;charset=utf-8')
    onStatus('Downloaded harvest CSV')
  }

  async function copySummary() {
    try {
      await copyText(buildPlanSummary(plan, data, outputs))
      onStatus('Copied planner summary')
    } catch (caught) {
      onStatus(caught instanceof Error ? caught.message : 'Clipboard access failed.')
    }
  }

  async function copyShareLink() {
    const hash = encodeShareHash(plan)
    const url = `${window.location.origin}${window.location.pathname}#${hash}`
    window.history.replaceState(null, '', `#${hash}`)
    try {
      await copyText(url)
      onStatus('Copied share link')
    } catch (caught) {
      onStatus(caught instanceof Error ? caught.message : 'Clipboard access failed.')
    }
  }

  return (
    <section className="planner-panel action-panel" aria-labelledby="actions-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Take it with you</p>
          <h2 id="actions-title">Save, share, export</h2>
        </div>
      </div>
      <div className="action-grid">
        <button className="icon-button text-button" type="button" onClick={exportState}>
          <Download size={16} /> State JSON
        </button>
        <button
          className="icon-button text-button"
          type="button"
          onClick={() => importInput.current?.click()}
        >
          <FileInput size={16} /> Import state
        </button>
        <button className="icon-button text-button" type="button" onClick={() => void copySummary()}>
          <ClipboardCopy size={16} /> Copy summary
        </button>
        <button className="icon-button text-button" type="button" onClick={exportHarvestCsv}>
          <Table size={16} /> Harvest CSV
        </button>
        <button className="icon-button text-button" type="button" onClick={() => void copyShareLink()}>
          <Link2 size={16} /> Share link
        </button>
        <button className="icon-button text-button" type="button" onClick={() => window.print()}>
          <Printer size={16} /> Print
        </button>
        <button className="icon-button text-button danger-button" type="button" onClick={onResetPlan}>
          <RotateCcw size={16} /> Start fresh
        </button>
      </div>
      <input
        ref={importInput}
        className="hidden-file"
        type="file"
        accept="application/json,.json"
        onChange={(event) => void importState(event.target.files?.[0])}
      />
      <p className="muted">State JSON is the round-trip format; CSV is for spreadsheet harvest planning.</p>
    </section>
  )
}

function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

async function copyText(value: string) {
  if (!navigator.clipboard) {
    throw new Error('Clipboard access is not available in this browser. Use the download option instead.')
  }
  await navigator.clipboard.writeText(value)
}
