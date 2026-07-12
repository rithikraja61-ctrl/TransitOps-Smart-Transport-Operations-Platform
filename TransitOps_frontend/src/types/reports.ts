export type ReportSummary = {
  avgFuelEfficiencyKmPerL: number
  fleetUtilizationPercent: number
  totalDistanceKm: number
  totalOperationalCost: number
  monthlyFuelSpend: { month: string; amount: number }[]
  expenseBreakdown: { category: string; amount: number }[]
}

export type AnalyticsKpiKey =
  | 'avgFuelEfficiencyKmPerL'
  | 'fleetUtilizationPercent'
  | 'totalDistanceKm'
  | 'totalOperationalCost'

export const ANALYTICS_KPI_LABELS: { key: AnalyticsKpiKey; label: string }[] = [
  { key: 'avgFuelEfficiencyKmPerL', label: 'Avg Fuel Efficiency (km/L)' },
  { key: 'fleetUtilizationPercent', label: 'Fleet Utilization' },
  { key: 'totalDistanceKm', label: 'Total Distance (km)' },
  { key: 'totalOperationalCost', label: 'Operational Cost' },
]
