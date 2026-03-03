import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './features/auth/pages/LoginPage'
import ClientsPage from './features/clients/pages/ClientsPage'
import ClientDetailPage from './features/clients/pages/ClientDetailPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/clients/:id" element={<ClientDetailPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App