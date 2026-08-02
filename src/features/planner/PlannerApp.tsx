import { useEffect, useMemo, useState } from 'react'
import { HeartHandshake, RefreshCw, Sprout, Upload } from 'lucide-react'
import { clearGardenPlan, loadGardenPlan, saveGardenPlan } from '../../lib/storage'
import { useStaticData } from '../../lib/staticData'
import type { GardenPlan } from '../../types/domain'
import { resolveInitialPlan } from '../../lib/planIO'
import {
  defaultGardenPlan,
  labelForPlant,
  nearestSoilCell,
  normalizeGardenPlan,
  withSuggestedCrops,
} from '../../lib/planModel'
import { derivePlannerOutputs } from '../../lib/plannerDerived'
import { DataPanel } from './components/DataPanel'
import { Footer } from './components/Footer'
import { GardenSetupPanel } from './components/GardenSetupPanel'
import { PhotoAnalyzer } from './components/PhotoAnalyzer'
import { PlanActions } from './components/PlanActions'

export function PlannerApp() {
  const { data, isLoading, error, refetch, isFetching } = useStaticData()
  const [plan, setPlan] = useState<GardenPlan>(defaultGardenPlan)
  const [loaded, setLoaded] = useState(false)
  const [saved, setSaved] = useState('Loading local plan')

  useEffect(() => {
    void loadGardenPlan().then((stored) => {
      const resolution = resolveInitialPlan(window.location.hash, stored)
      setPlan(resolution.plan)
      setSaved(resolution.statusMessage)
      setLoaded(true)
      if (resolution.shouldClearShareHash) {
        // Consume the share hash so a later reload of this tab re-reads the
        // freshly saved local plan instead of silently reapplying the same
        // stale shared snapshot and discarding any edits made since.
        window.history.replaceState(null, '', window.location.pathname)
      }
    })
  }, [])

  useEffect(() => {
    if (!loaded) {
      return
    }
    const timer = window.setTimeout(() => {
      void saveGardenPlan(plan).then(() => setSaved('Saved locally in this browser'))
    }, 350)
    return () => window.clearTimeout(timer)
  }, [loaded, plan])

  const outputs = useMemo(() => (data ? derivePlannerOutputs(data, plan) : null), [data, plan])

  function applyFrostZone(zoneID: string) {
    const nextZone = data?.frost.find((zone) => zone.zone_id === zoneID)
    const nearestSoil = nextZone
      ? nearestSoilCell(data?.soilCells, nextZone.latitude, nextZone.longitude)
      : outputs?.soil
    setPlan((current) => ({
      ...current,
      frostZoneId: zoneID,
      latitude: nextZone?.latitude ?? current.latitude,
      longitude: nextZone?.longitude ?? current.longitude,
      soilCellId: nearestSoil?.id ?? current.soilCellId,
    }))
  }

  function applySuggestedCrops(cropIds: string[]) {
    setPlan((current) => withSuggestedCrops(current, cropIds))
    setSaved('Applied crop guesses')
  }

  function importPlan(nextPlan: GardenPlan) {
    setPlan(normalizeGardenPlan(nextPlan))
    setSaved('Imported state file')
  }

  function resetPlan() {
    void clearGardenPlan()
    window.history.replaceState(null, '', window.location.pathname)
    setPlan(defaultGardenPlan)
    setSaved('Started fresh')
  }

  if (isLoading) {
    return (
      <main className="app-shell">
        <section className="notice">Loading static garden brain...</section>
      </main>
    )
  }

  if (error || !data || !outputs) {
    return (
      <main className="app-shell">
        <section className="notice notice-error" role="alert">
          <strong>Static data could not be loaded.</strong>
          <span>
            {error instanceof Error ? error.message : 'The browser could not read the static data cache.'}
          </span>
          <span>Check the network connection, then retry the versioned data artifacts.</span>
          <button className="icon-button text-button" type="button" onClick={() => void refetch()}>
            <RefreshCw size={16} /> Retry
          </button>
        </section>
      </main>
    )
  }

  const { selectedPlants, frostZone, soil, sunCells, sunHours, rotation, companions, watering, harvests } =
    outputs

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Offline-first urban farming planner</p>
          <h1>Complete Gardener Planner</h1>
        </div>
        <nav className="top-actions" aria-label="Project links">
          <a
            className="icon-button text-button"
            href="https://github.com/baditaflorin/complete-gardener-planner"
            target="_blank"
            rel="noreferrer"
          >
            <Sprout size={17} /> Star on GitHub
          </a>
          <a
            className="icon-button text-button support"
            href="https://www.paypal.com/paypalme/florinbadita"
            target="_blank"
            rel="noreferrer"
          >
            <HeartHandshake size={17} /> Support
          </a>
        </nav>
      </header>

      <section className="workspace-grid">
        <GardenSetupPanel
          data={data}
          plan={plan}
          saved={saved}
          onPlanChange={setPlan}
          onFrostZoneChange={applyFrostZone}
        />

        <PhotoAnalyzer
          plants={data.plants}
          diseases={data.diseases}
          onApplySuggestedCrops={applySuggestedCrops}
        />
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
              <span
                key={cell.hour}
                title={`${cell.label}: ${Math.round(cell.intensity * 100)}%`}
                style={{ opacity: 0.18 + cell.intensity * 0.82 }}
              >
                {cell.hour}
              </span>
            ))}
          </div>
          <p className="muted">
            Lat {plan.latitude.toFixed(2)}, lon {plan.longitude.toFixed(2)}. Frost window:{' '}
            {frostZone.last_spring_frost} to {frostZone.first_autumn_frost}.
          </p>
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
              <div>
                <dt>Events</dt>
                <dd>{watering.eventsPerWeek} / week</dd>
              </div>
              <div>
                <dt>Run time</dt>
                <dd>{watering.minutesPerEvent} min</dd>
              </div>
              <div>
                <dt>Need</dt>
                <dd>{watering.irrigationMM} mm</dd>
              </div>
            </dl>
          )}
          <p className="muted">
            {watering?.note} Soil: {soil.texture}, pH {soil.ph}, {soil.drainage} drainage.
          </p>
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
                <strong>
                  {step.season}: {step.cropName}
                </strong>
                <span>
                  {step.rotationGroup}. {step.reason}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="planner-panel" aria-labelledby="harvest-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Harvest projection</p>
              <h2 id="harvest-title">
                {harvests.reduce((sum, item) => sum + item.yieldKg, 0).toFixed(1)} kg expected
              </h2>
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
          <p className="muted">
            Yield model: {data.yieldModel.model_kind}, MAE {data.yieldModel.mae_percent}%.
          </p>
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
                <strong>
                  {labelForPlant(data.plants, edge.source_id)} + {labelForPlant(data.plants, edge.target_id)}
                </strong>
                <span>
                  {edge.kind}: {edge.reason}
                </span>
              </article>
            ))}
          </div>
        </section>

        <DataPanel data={data} isFetching={isFetching} />
        <PlanActions
          plan={plan}
          data={data}
          outputs={outputs}
          onImportPlan={importPlan}
          onResetPlan={resetPlan}
          onStatus={setSaved}
        />
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
                <div>
                  <dt>Harvest</dt>
                  <dd>{plant.days_to_harvest} days</dd>
                </div>
                <div>
                  <dt>Water</dt>
                  <dd>{plant.water_mm_per_week} mm/wk</dd>
                </div>
                <div>
                  <dt>Sun</dt>
                  <dd>
                    {plant.sun_hours_min}-{plant.sun_hours_max}h
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
