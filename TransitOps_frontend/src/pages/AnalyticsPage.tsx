import { useCallback, useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '../components/Button'
import { ApiError, downloadAuthFile, getJson } from '../lib/api'
import { notifyError } from '../lib/notify'
import {
  ANALYTICS_KPI_LABELS,
  type AnalyticsKpiKey,
  type ReportSummary,
} from '../types/reports'

const CHART_COLOR = '#f97316'

function formatKpiValue(key: AnalyticsKpiKey, value: number): string {
  if (key === 'fleetUtilizationPercent') {
    return `${value.toFixed(1)}%`
  }
  if (key === 'avgFuelEfficiencyKmPerL') {
    return `${value.toFixed(1)} km/L`
  }
  if (key === 'totalOperationalCost') {
    return value.toFixed(2)
  }
  return String(value)
}

export function AnalyticsPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const loadSummary = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getJson<ReportSummary>('/api/reports/summary')
      setSummary(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load analytics'
      setError(message)
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSummary()
  }, [loadSummary])

  async function handleExportCsv() {
    if (exporting) {
      return
    }

    setExporting(true)
    try {
      await downloadAuthFile('/api/reports/export.csv', 'transitops-report.csv')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to export CSV'
      notifyError(message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <header className="app-page__header">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 className="app-page__title">Analytics</h1>
            <p className="app-page__subtitle">Operational insights and cost trends</p>
          </div>
          <Button variant="primary" onClick={() => void handleExportCsv()} disabled={exporting || loading || !summary}>
            {exporting ? 'Exporting…' : 'Export CSV'}
          </Button>
        </div>
      </header>

      <div className="vehicles-layout">
        {loading ? <p className="app-loading">Loading analytics…</p> : null}
        {error ? <p className="app-error">{error}</p> : null}

        {!loading && !error && summary ? (
          <>
            <div className="kpi-grid">
              {ANALYTICS_KPI_LABELS.map(({ key, label }) => (
                <article key={key} className="kpi-card">
                  <p className="kpi-card__label">{label}</p>
                  <p className="kpi-card__value">{formatKpiValue(key, summary[key])}</p>
                </article>
              ))}
            </div>

            <section className="app-card">
              <h2 className="app-page__title" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                Monthly fuel spend
              </h2>
              {summary.monthlyFuelSpend.length === 0 ? (
                <p className="app-card--empty">No fuel data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={summary.monthlyFuelSpend}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill={CHART_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </section>

            <section className="app-card">
              <h2 className="app-page__title" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                Expense breakdown
              </h2>
              {summary.expenseBreakdown.length === 0 ? (
                <p className="app-card--empty">No expense data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={summary.expenseBreakdown} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="amount" fill={CHART_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </section>
          </>
        ) : null}
      </div>
    </>
  )
}
