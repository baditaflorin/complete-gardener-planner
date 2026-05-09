import { Leaf } from 'lucide-react'
import type { GardenPlan, StaticData } from '../../../types/domain'
import { parseBoundedNumber, toggleCrop } from '../../../lib/planModel'

type Props = {
  data: StaticData
  plan: GardenPlan
  saved: string
  onPlanChange: (plan: GardenPlan) => void
  onFrostZoneChange: (zoneID: string) => void
}

export function GardenSetupPanel({ data, plan, saved, onPlanChange, onFrostZoneChange }: Props) {
  return (
    <section className="planner-panel planner-panel-wide" aria-labelledby="bed-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Garden setup</p>
          <h2 id="bed-title">Plan the next planting window</h2>
        </div>
        <span className="status-pill">{saved}</span>
      </div>

      <div className="controls-grid">
        <label>
          Garden name
          <input
            value={plan.name}
            onChange={(event) => onPlanChange({ ...plan, name: event.target.value })}
          />
        </label>
        <label>
          Frost zone
          <select value={plan.frostZoneId} onChange={(event) => onFrostZoneChange(event.target.value)}>
            {data.frost.map((zone) => (
              <option key={zone.zone_id} value={zone.zone_id}>
                {zone.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Soil cell
          <select
            value={plan.soilCellId}
            onChange={(event) => onPlanChange({ ...plan, soilCellId: event.target.value })}
          >
            {data.soilCells.map((cell) => (
              <option key={cell.id} value={cell.id}>
                {cell.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Planting date
          <input
            type="date"
            value={plan.plantingDateISO}
            onChange={(event) => onPlanChange({ ...plan, plantingDateISO: event.target.value })}
          />
        </label>
        <label>
          Bed area, sqm
          <input
            type="number"
            min="1"
            step="0.5"
            value={plan.bedAreaSqm}
            onChange={(event) =>
              onPlanChange({
                ...plan,
                bedAreaSqm: parseBoundedNumber(event.target.value, 0.5, 10000, plan.bedAreaSqm),
              })
            }
          />
        </label>
        <label>
          Shade, percent
          <input
            type="range"
            min="0"
            max="70"
            value={plan.shadePercent}
            onChange={(event) => onPlanChange({ ...plan, shadePercent: Number(event.target.value) })}
          />
          <span>{plan.shadePercent}% shade</span>
        </label>
      </div>

      <fieldset className="crop-picker">
        <legend>Crops in this bed</legend>
        {data.plants.map((plant) => (
          <label
            key={plant.id}
            className={plan.selectedCropIds.includes(plant.id) ? 'crop-chip selected' : 'crop-chip'}
          >
            <input
              type="checkbox"
              checked={plan.selectedCropIds.includes(plant.id)}
              onChange={() => onPlanChange(toggleCrop(plan, plant.id))}
            />
            <Leaf size={15} />
            {plant.common_name}
          </label>
        ))}
      </fieldset>
    </section>
  )
}
