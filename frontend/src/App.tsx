import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './features/auth/hooks/useAuth'
import LoginPage from './features/auth/pages/LoginPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import ClientsPage from './features/clients/pages/ClientsPage'
import ClientDetailPage from './features/clients/pages/ClientDetailPage'
import DealsPage from './features/deals/pages/DealsPage'

// Route protégée
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes protégées */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />

      <Route path="/clients" element={
        <PrivateRoute>
          <ClientsPage />
        </PrivateRoute>
      } />

      <Route path="/clients/:id" element={
        <PrivateRoute>
          <ClientDetailPage />
        </PrivateRoute>
      } />

      <Route path="/deals" element={
        <PrivateRoute>
          <DealsPage />
        </PrivateRoute>
      } />

      {/* Redirect par défaut */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App