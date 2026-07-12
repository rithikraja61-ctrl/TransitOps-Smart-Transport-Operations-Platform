import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { SelectField } from '../components/SelectField'
import { ApiError, getJson } from '../lib/api'
import {
  KPI_LABELS,
  VEHICLE_STATUS_OPTIONS,
  type DashboardKpis,
  type VehicleStatus,
} from '../types/dashboard'

const VEHICLE_TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'Van', label: 'Van' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Bus', label: 'Bus' },
]

function formatKpiValue(key: keyof DashboardKpis, value: number): string {
  if (key === 'fleetUtilizationPercent') {
    return `${value.toFixed(1)}%`
  }
  return String(value)
}

export function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vehicleType, setVehicleType] = useState('')
  const [vehicleStatus, setVehicleStatus] = useState<VehicleStatus | ''>('')

  const loadKpis = useCallback(async (type: string, status: VehicleStatus | '') => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (type) {
      params.set('vehicleType', type)
    }
    if (status) {
      params.set('vehicleStatus', status)
    }

    const query = params.toString()
    const path = query ? `/api/dashboard/kpis?${query}` : '/api/dashboard/kpis'

    try {
      const data = await getJson<DashboardKpis>(path)
      setKpis(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load dashboard'
      setError(message)
      setKpis(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadKpis('', '')
  }, [loadKpis])

  function handleApplyFilters() {
    void loadKpis(vehicleType, vehicleStatus)
  }

  function handleClearFilters() {
    setVehicleType('')
    setVehicleStatus('')
    void loadKpis('', '')
  }

  return (
    <>
      <header className="app-page__header">
        <h1 className="app-page__title">Dashboard</h1>
        <p className="app-page__subtitle">Fleet operations at a glance</p>
      </header>

      <div className="dashboard-filters">
        <SelectField
          id="filter-type"
          label="Vehicle type"
          value={vehicleType}
          options={VEHICLE_TYPE_OPTIONS}
          onChange={setVehicleType}
        />
        <SelectField
          id="filter-status"
          label="Vehicle status"
          value={vehicleStatus}
          options={VEHICLE_STATUS_OPTIONS}
          onChange={(value) => setVehicleStatus(value as VehicleStatus | '')}
        />
        <div className="dashboard-filters__actions">
          <Button variant="primary" onClick={handleApplyFilters}>
            Apply
          </Button>
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {loading ? <p className="app-loading">Loading KPIs…</p> : null}
      {error ? <p className="app-error">{error}</p> : null}

      {!loading && !error && kpis ? (
        <div className="kpi-grid">
          {KPI_LABELS.map(({ key, label }) => (
            <article key={key} className="kpi-card">
              <p className="kpi-card__label">{label}</p>
              <p className="kpi-card__value">{formatKpiValue(key, kpis[key])}</p>
            </article>
          ))}
        </div>
      ) : null}
    </>
  )
}
