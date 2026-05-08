import { Database, RefreshCw } from 'lucide-react'
import type { StaticData } from '../../../types/domain'

type Props = {
  data: StaticData
  isFetching: boolean
}

export function DataPanel({ data, isFetching }: Props) {
  const generatedDates = Object.values(data.meta).map((meta) => new Date(meta.generated_at).getTime())
  const newest = new Date(Math.max(...generatedDates))
  const totalRecords = Object.values(data.meta).reduce((sum, meta) => sum + meta.record_count, 0)

  return (
    <section className="planner-panel" aria-labelledby="data-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Offline cache</p>
          <h2 id="data-title">Static data v1</h2>
        </div>
        {isFetching ? <RefreshCw className="spin" size={20} /> : <Database size={20} />}
      </div>
      <dl className="metric-list">
        <div><dt>Records</dt><dd>{totalRecords}</dd></div>
        <div><dt>Generated</dt><dd>{newest.toLocaleDateString()}</dd></div>
        <div><dt>Schema</dt><dd>{data.meta.plants.schema_version}</dd></div>
      </dl>
      <p className="muted">Includes plant database, companion graph, frost statistics, raster-like soil cells, weather normals, disease signatures, and yield coefficients.</p>
    </section>
  )
}
