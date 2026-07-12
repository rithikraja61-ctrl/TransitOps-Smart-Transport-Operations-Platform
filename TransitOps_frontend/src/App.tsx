import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ScopeRoute } from './components/ScopeRoute'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DriversPage } from './pages/DriversPage'
import { FuelExpensesPage } from './pages/FuelExpensesPage'
import { MaintenancePage } from './pages/MaintenancePage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { TripsPage } from './pages/TripsPage'
import { VehiclesPage } from './pages/VehiclesPage'
import { AppShell } from './sections/app/AppShell'

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
          <Route
            path="/drivers"
            element={
              <ScopeRoute scope="data:drivers">
                <DriversPage />
              </ScopeRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ScopeRoute scope="data:trips">
                <TripsPage />
              </ScopeRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ScopeRoute scope="data:maintenance">
                <MaintenancePage />
              </ScopeRoute>
            }
          />
          <Route
            path="/fuel-expenses"
            element={
              <ScopeRoute scope="data:fuel_expenses">
                <FuelExpensesPage />
              </ScopeRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ScopeRoute scope="data:analytics">
                <AnalyticsPage />
              </ScopeRoute>
            }
          />
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
