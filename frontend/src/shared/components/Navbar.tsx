import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-blue-600">
              AI CRM
            </h1>

            {/* Navigation Links */}
            <div className="flex space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/clients"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/clients')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Clients
              </Link>
              <Link
                to="/deals"
                className={`px-3 py-2 rounded-md text-sm font font-medium transition-colors ${
                  isActive('/deals')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Deals
              </Link>
            </div>
          </div>

          {/* User + Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.fullName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar