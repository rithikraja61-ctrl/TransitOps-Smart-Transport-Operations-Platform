import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getDefaultAppPath } from '../constants/nav'
import { getAuthSession } from '../lib/authStorage'

type ScopeRouteProps = {
  scope: string
  children: ReactNode
}

export function ScopeRoute({ scope, children }: ScopeRouteProps) {
  const session = getAuthSession()

  if (!session) {
    return null
  }

  if (!session.user.scopes.includes(scope)) {
    const fallback = getDefaultAppPath(session.user.scopes)
    if (fallback !== window.location.pathname) {
      return <Navigate to={fallback} replace />
    }

    return (
      <div className="app-card app-card--empty">
        No modules available for your role.
      </div>
    )
  }

  return children
}
