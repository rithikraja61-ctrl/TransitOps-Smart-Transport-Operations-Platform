import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePlaceholderPage } from './pages/HomePlaceholderPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePlaceholderPage />
            </ProtectedRoute>
          }
        />
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
