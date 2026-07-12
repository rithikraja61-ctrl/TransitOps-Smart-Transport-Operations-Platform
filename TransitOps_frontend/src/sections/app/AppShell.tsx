import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { APP_NAV_ITEMS } from '../../constants/nav'
import { getRoleLabel } from '../../constants/roles'
import { signOut } from '../../lib/auth'
import { getAuthSession } from '../../lib/authStorage'
import { notifySuccess } from '../../lib/notify'

function userInitials(username: string): string {
  const parts = username.split(/[_\s-]+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return username.slice(0, 2).toUpperCase()
}

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [signingOut, setSigningOut] = useState(false)
  const session = getAuthSession()

  if (!session) {
    return null
  }

  const { user } = session

  async function handleSignOut() {
    if (signingOut) {
      return
    }

    setSigningOut(true)
    try {
      await signOut()
      notifySuccess('Signed out successfully')
      navigate('/signin', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar" aria-label="Module navigation">
        <h1 className="app-shell__title">TransitOps</h1>
        <nav className="app-shell__nav">
          {APP_NAV_ITEMS.map((item) => {
            const hasAccess = user.scopes.includes(item.scope)
            const isActive = location.pathname === item.path

            if (!hasAccess) {
              return (
                <span
                  key={item.path}
                  className="app-shell__nav-link app-shell__nav-link--disabled"
                  title="No access for your role"
                >
                  {item.label}
                </span>
              )
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`app-shell__nav-link${isActive ? ' app-shell__nav-link--active' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="app-shell__content">
        <header className="app-shell__topbar">
          <div className="app-shell__user">
            <div className="app-shell__avatar" aria-hidden="true">
              {userInitials(user.username)}
            </div>
            <div className="app-shell__user-meta">
              <span className="app-shell__username">{user.username}</span>
              <span className="app-shell__role">{getRoleLabel(user.role)}</span>
            </div>
          </div>
          <Button
            variant="secondary"
            className="app-shell__signout"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </header>

        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
