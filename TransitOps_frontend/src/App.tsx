import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ScopeRoute } from './components/ScopeRoute'
import { getDefaultAppPath } from './constants/nav'
import { getAuthSession } from './lib/authStorage'
import { DashboardPage } from './pages/DashboardPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { VehiclesPage } from './pages/VehiclesPage'
import { AppShell } from './sections/app/AppShell'

function DefaultRedirect() {
  const session = getAuthSession()
  if (!session) {
    return <Navigate to="/signin" replace />
  }
  return <Navigate to={getDefaultAppPath(session.user.scopes)} replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <ScopeRoute scope="data:dashboard">
                <DashboardPage />
              </ScopeRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ScopeRoute scope="data:fleet">
                <VehiclesPage />
              </ScopeRoute>
            }
          />
          <Route path="/drivers" element={<DefaultRedirect />} />
          <Route path="/trips" element={<DefaultRedirect />} />
          <Route path="/maintenance" element={<DefaultRedirect />} />
          <Route path="/fuel-expenses" element={<DefaultRedirect />} />
          <Route path="/analytics" element={<DefaultRedirect />} />
        </Route>
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        toastClassName="transitops-toast"
      />
    </BrowserRouter>
  )
}

export default App
