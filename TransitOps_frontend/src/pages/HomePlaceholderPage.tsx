import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { getRoleLabel } from '../constants/roles'
import { clearAuthSession, getAuthSession } from '../lib/authStorage'

export function HomePlaceholderPage() {
  const navigate = useNavigate()
  const session = getAuthSession()

  if (!session) {
    return null
  }

  const { user } = session

  function handleSignOut() {
    clearAuthSession()
    navigate('/signin', { replace: true })
  }

  return (
    <div className="home-placeholder">
      <div className="home-placeholder__card">
        <h1 className="home-placeholder__title">Welcome, {user.username}</h1>
        <p className="home-placeholder__email">{user.email}</p>

        <div className="home-placeholder__badge">{getRoleLabel(user.role)}</div>

        <h2 className="home-placeholder__scopes-title">Your scopes</h2>
        <ul className="home-placeholder__scopes">
          {user.scopes.map((scope) => (
            <li key={scope} className="home-placeholder__scope">
              {scope}
            </li>
          ))}
        </ul>

        <div className="home-placeholder__actions">
          <Button variant="secondary" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
