import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './features/auth/pages/LoginPage'
import ClientsPage from './features/clients/pages/ClientsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App