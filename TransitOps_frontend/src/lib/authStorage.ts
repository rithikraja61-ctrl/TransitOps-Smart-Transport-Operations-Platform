import type { AuthSession, SigninResponse } from '../types/auth'

const STORAGE_KEY = 'transitops_auth'

function readFromStorage(storage: Storage): AuthSession | null {
  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    storage.removeItem(STORAGE_KEY)
    return null
  }
}

export function getAuthSession(): AuthSession | null {
  return readFromStorage(localStorage) ?? readFromStorage(sessionStorage)
}

export function saveAuthSession(
  response: SigninResponse,
  rememberMe: boolean,
): void {
  const session: AuthSession = {
    accessToken: response.accessToken,
    tokenType: response.tokenType,
    expiresIn: response.expiresIn,
    user: {
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
      scopes: response.scopes,
    },
  }

  clearAuthSession()
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null
}
