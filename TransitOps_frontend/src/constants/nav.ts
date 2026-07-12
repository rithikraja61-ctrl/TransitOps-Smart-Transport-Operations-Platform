export type NavItem = {
  path: string
  label: string
  scope: string
}

export const APP_NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', scope: 'data:dashboard' },
  { path: '/vehicles', label: 'Fleet', scope: 'data:fleet' },
  { path: '/drivers', label: 'Drivers', scope: 'data:drivers' },
  { path: '/trips', label: 'Trips', scope: 'data:trips' },
  { path: '/maintenance', label: 'Maintenance', scope: 'data:maintenance' },
  { path: '/fuel-expenses', label: 'Fuel & Expenses', scope: 'data:fuel_expenses' },
  { path: '/analytics', label: 'Analytics', scope: 'data:analytics' },
]

export function getDefaultAppPath(scopes: string[]): string {
  const first = APP_NAV_ITEMS.find((item) => scopes.includes(item.scope))
  return first?.path ?? '/'
}
