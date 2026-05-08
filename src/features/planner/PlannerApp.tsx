import { useEffect, useMemo, useState } from 'react'
import { HeartHandshake, Leaf, RefreshCw, Sprout, Upload } from 'lucide-react'
import { buildSunMap, averageSunHours } from '../../lib/sun'
import { buildRotationPlan, companionSummary } from '../../lib/rotation'
import { calculateWateringSchedule } from '../../lib/irrigation'
import { projectHarvests } from '../../lib/yield'
import { defaultGardenPlan, loadGardenPlan, saveGardenPlan } from '../../lib/storage'
import { useStaticData } from '../../lib/staticData'
import type { GardenPlan } from '../../types/domain'
import { DataPanel } from './components/DataPanel'
import { Footer } from './components/Footer'
import { PhotoAnalyzer } from './components/PhotoAnalyzer'

export function PlannerApp() {
  const { data, isLoading, error, refetch, isFetching } = useStaticData()
  const [plan, setPlan] = useState<GardenPlan>(defaultGardenPlan)
  const [saved, setSaved] = useState('Loading local plan')

  useEffect(() => {
    void loadGardenPlan().then((stored) => {
      setPlan(stored)
      setSaved('Saved locally in this browser')
    })
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void saveGardenPlan(plan).then(() => setSaved('Saved locally in this browser'))
    }, 350)
    return () => window.clearTimeout(timer)
  }, [plan])

  const selectedPlants = useMemo(
    () => data?.plants.filter((plant) => plan.selectedCropIds.includes(plant.id)) ?? [],
    [data?.plants, plan.selectedCropIds],
  )
  const frostZone = data?.frost.find((zone) => zone.zone_id === plan.frostZoneId) ?? data?.frost[0]
  const soil = data?.soilCells.find((cell) => cell.id === plan.soilCellId) ?? data?.soilCells[0]
  const weather = data?.weatherNormals.find((normal) => normal.zone_id === plan.frostZoneId) ?? data?.weatherNormals[0]
  const monthIndex = Math.max(0, new Date(plan.plantingDateISO).getMonth())
  const sunCells = buildSunMap(plan.latitude, plan.longitude, plan.plantingDateISO, plan.shadePercent)
  const sunHours = averageSunHours(sunCells)

  const rotation = data ? buildRotationPlan(data.plants, plan.selectedCropIds) : []
  const companions = data ? companionSummary(data.companions, plan.selectedCropIds) : []
  const watering = data && soil && weather ? calculateWateringSchedule({
    plants: data.plants,
    selectedIds: plan.selectedCropIds,
    soil,
    weather,
    bedAreaSqm: plan.bedAreaSqm,
    monthIndex,
  }) : null
  const harvests = data && soil ? projectHarvests({
    plants: data.plants,
    selectedIds: plan.selectedCropIds,
    model: data.yieldModel,
    soil,
    bedAreaSqm: plan.bedAreaSqm,
    plantingDateISO: plan.plantingDateISO,
    sunHours,
    waterBalanceMM: watering?.weeklyNeedMM ?? 0,
    diseasePressure: plan.diseasePressure,
  }) : []

  if (isLoading) {
    return <main className="app-shell"><section className="notice">Loading static garden brain...</section></main>
  }

  if (error || !data || !soil || !weather || !frostZone) {
    return (
      <main className="app-shell">
        <section className="notice notice-error" role="alert">
          <strong>Static data could not be loaded.</strong>
          <button className="icon-button text-button" type="button" onClick={() => void refetch()}>
            <RefreshCw size={16} /> Retry
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Offline-first urban farming planner</p>
          <h1>Complete Gardener Planner</h1>
        </div>
        <nav className="top-actions" aria-label="Project links">
          <a className="icon-button text-button" href="https://github.com/baditaflorin/complete-gardener-planner" target="_blank" rel="noreferrer">
            <Sprout size={17} /> Star on GitHub
          </a>
          <a className="icon-button text-button support" href="https://www.paypal.com/paypalme/florinbadita" target="_blank" rel="noreferrer">
            <HeartHandshake size={17} /> Support
          </a>
        </nav>
      </header>

      <section className="workspace-grid">
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
              <input value={plan.name} onChange={(event) => setPlan({ ...plan, name: event.target.value })} />
            </label>
            <label>
              Frost zone
              <select value={plan.frostZoneId} onChange={(event) => setPlan({ ...plan, frostZoneId: event.target.value })}>
                {data.frost.map((zone) => <option key={zone.zone_id} value={zone.zone_id}>{zone.label}</option>)}
              </select>
            </label>
            <label>
              Soil cell
              <select value={plan.soilCellId} onChange={(event) => setPlan({ ...plan, soilCellId: event.target.value })}>
                {data.soilCells.map((cell) => <option key={cell.id} value={cell.id}>{cell.label}</option>)}
              </select>
            </label>
            <label>
              Planting date
              <input type="date" value={plan.plantingDateISO} onChange={(event) => setPlan({ ...plan, plantingDateISO: event.target.value })} />
            </label>
            <label>
              Bed area, sqm
              <input type="number" min="1" step="0.5" value={plan.bedAreaSqm} onChange={(event) => setPlan({ ...plan, bedAreaSqm: Number(event.target.value) })} />
            </label>
            <label>
              Shade, percent
              <input type="range" min="0" max="70" value={plan.shadePercent} onChange={(event) => setPlan({ ...plan, shadePercent: Number(event.target.value) })} />
              <span>{plan.shadePercent}% shade</span>
            </label>
          </div>

          <fieldset className="crop-picker">
            <legend>Crops in this bed</legend>
            {data.plants.map((plant) => (
              <label key={plant.id} className={plan.selectedCropIds.includes(plant.id) ? 'crop-chip selected' : 'crop-chip'}>
                <input
                  type="checkbox"
                  checked={plan.selectedCropIds.includes(plant.id)}
                  onChange={() => setPlan((current) => toggleCrop(current, plant.id))}
                />
                <Leaf size={15} />
                {plant.common_name}
              </label>
            ))}
          </fieldset>
        </section>

        <PhotoAnalyzer plants={data.plants} diseases={data.diseases} />
      </section>

      <section className="dashboard-grid">
        <section className="planner-panel" aria-labelledby="sun-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SunCalc map</p>
              <h2 id="sun-title">{sunHours} weighted sun hours</h2>
            </div>
          </div>
          <div className="sun-map" aria-label="Hourly sun intensity">
            {sunCells.map((cell) => (
              <span key={cell.hour} title={`${cell.label}: ${Math.round(cell.intensity * 100)}%`} style={{ opacity: 0.18 + cell.intensity * 0.82 }}>
                {cell.hour}
              </span>
            ))}
          </div>
          <p className="muted">Lat {plan.latitude.toFixed(2)}, lon {plan.longitude.toFixed(2)}. Frost window: {frostZone.last_spring_frost} to {frostZone.first_autumn_frost}.</p>
        </section>

        <section className="planner-panel" aria-labelledby="water-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Irrigation calculator</p>
              <h2 id="water-title">{watering?.litersPerWeek ?? 0} L / week</h2>
            </div>
          </div>
          {watering && (
            <dl className="metric-list">
              <div><dt>Events</dt><dd>{watering.eventsPerWeek} / week</dd></div>
              <div><dt>Run time</dt><dd>{watering.minutesPerEvent} min</dd></div>
              <div><dt>Need</dt><dd>{watering.irrigationMM} mm</dd></div>
            </dl>
          )}
          <p className="muted">{watering?.note} Soil: {soil.texture}, pH {soil.ph}, {soil.drainage} drainage.</p>
        </section>

        <section className="planner-panel" aria-labelledby="rotation-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Crop rotation</p>
              <h2 id="rotation-title">Four-season plan</h2>
            </div>
          </div>
          <ol className="timeline-list">
            {rotation.map((step) => (
              <li key={step.season}>
                <strong>{step.season}: {step.cropName}</strong>
                <span>{step.rotationGroup}. {step.reason}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="planner-panel" aria-labelledby="harvest-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Harvest projection</p>
              <h2 id="harvest-title">{harvests.reduce((sum, item) => sum + item.yieldKg, 0).toFixed(1)} kg expected</h2>
            </div>
          </div>
          <ol className="harvest-list">
            {harvests.map((item) => (
              <li key={item.plantId}>
                <span>{item.cropName}</span>
                <strong>{item.yieldKg} kg</strong>
                <time dateTime={item.harvestDateISO}>{item.harvestDateISO}</time>
              </li>
            ))}
          </ol>
          <p className="muted">Yield model: {data.yieldModel.model_kind}, MAE {data.yieldModel.mae_percent}%.</p>
        </section>

        <section className="planner-panel planner-panel-wide" aria-labelledby="companion-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Companion graph</p>
              <h2 id="companion-title">Edges affecting selected crops</h2>
            </div>
          </div>
          <div className="edge-list">
            {companions.map((edge) => (
              <article key={`${edge.source_id}-${edge.target_id}`} className={`edge edge-${edge.kind}`}>
                <strong>{labelFor(data.plants, edge.source_id)} + {labelFor(data.plants, edge.target_id)}</strong>
                <span>{edge.kind}: {edge.reason}</span>
              </article>
            ))}
          </div>
        </section>

        <DataPanel data={data} isFetching={isFetching} />
      </section>

      <section className="planner-panel" aria-labelledby="selected-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Plant database</p>
            <h2 id="selected-title">Selected crop cards</h2>
          </div>
          <button className="icon-button text-button" type="button" onClick={() => void refetch()}>
            <Upload size={16} /> Refresh data
          </button>
        </div>
        <div className="crop-card-grid">
          {selectedPlants.map((plant) => (
            <article className="crop-card" key={plant.id}>
              <strong>{plant.common_name}</strong>
              <span>{plant.scientific_name}</span>
              <dl>
                <div><dt>Harvest</dt><dd>{plant.days_to_harvest} days</dd></div>
                <div><dt>Water</dt><dd>{plant.water_mm_per_week} mm/wk</dd></div>
                <div><dt>Sun</dt><dd>{plant.sun_hours_min}-{plant.sun_hours_max}h</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function toggleCrop(plan: GardenPlan, cropId: string): GardenPlan {
  const selected = new Set(plan.selectedCropIds)
  if (selected.has(cropId)) {
    selected.delete(cropId)
  } else {
    selected.add(cropId)
  }
  return { ...plan, selectedCropIds: Array.from(selected) }
}

function labelFor(plants: { id: string; common_name: string }[], id: string) {
  return plants.find((plant) => plant.id === id)?.common_name ?? id
}
