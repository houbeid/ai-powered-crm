import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { clientService } from '../services/clientService'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'
import Navbar from '../../../shared/components/Navbar'
import type { Client } from '../types/client.types'

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchClient()
  }, [id])

  const fetchClient = async () => {
    try {
      setLoading(true)
      const data = await clientService.getById(Number(id))
      setClient(data)
    } catch {
      navigate('/clients')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LoadingSpinner />
    </div>
  )

  if (!client) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/clients')}
          className="text-gray-500 hover:text-gray-700 flex items-center space-x-1 mb-6 text-sm"
        >
          <span>←</span>
          <span>Back to Clients</span>
        </button>

        {/* Client Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {client.companyName}
              </h1>
              <div className="mt-3 space-y-1">
                <p className="text-gray-600 text-sm">
                  📧 {client.email}
                </p>
                <p className="text-gray-600 text-sm">
                  📞 {client.phone}
                </p>
                <p className="text-gray-600 text-sm">
                  📅 Client since {new Date(client.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/deals?clientId=${client.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              + Add Deal
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-gray-500 text-sm mt-1">Total Deals</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-gray-500 text-sm mt-1">Won Deals</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">$0</p>
            <p className="text-gray-500 text-sm mt-1">Total Amount</p>
          </div>
        </div>

        {/* Deals Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Deals
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-400">No deals yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Add Deal" to create the first deal
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ClientDetailPage