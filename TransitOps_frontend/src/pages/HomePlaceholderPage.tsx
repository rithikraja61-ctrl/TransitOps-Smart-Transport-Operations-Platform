import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { getRoleLabel } from '../constants/roles'
import { signOut } from '../lib/auth'
import { getAuthSession } from '../lib/authStorage'
import { notifySuccess } from '../lib/notify'

export function HomePlaceholderPage() {
  const navigate = useNavigate()
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
          <Button variant="secondary" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>
      </div>
    </div>
  )
}
