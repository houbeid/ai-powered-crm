import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { clientService } from '../services/clientService'
import { dealService } from '../../deals/services/dealService'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'
import Navbar from '../../../shared/components/Navbar'
import type { Client } from '../types/client.types'
import type { Deal } from '../../deals/types/deal.types'

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [clientData, dealsData] = await Promise.all([
        clientService.getById(Number(id)),
        dealService.getByClientId(Number(id))
      ])
      setClient(clientData)
      setDeals(dealsData)
    } catch {
      navigate('/clients')
    } finally {
      setLoading(false)
    }
  }

  const wonDeals = deals.filter(d => d.status === 'Won')
  const totalAmount = wonDeals.reduce((sum, d) => sum + d.amount, 0)

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      New: 'bg-gray-100 text-gray-600',
      InProgress: 'bg-blue-100 text-blue-600',
      Won: 'bg-green-100 text-green-600',
      Lost: 'bg-red-100 text-red-600'
    }
    return styles[status] || 'bg-gray-100 text-gray-600'
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
                <p className="text-gray-600 text-sm">📧 {client.email}</p>
                <p className="text-gray-600 text-sm">📞 {client.phone}</p>
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
              onClick={() => navigate('/deals')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              + Add Deal
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{deals.length}</p>
            <p className="text-gray-500 text-sm mt-1">Total Deals</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{wonDeals.length}</p>
            <p className="text-gray-500 text-sm mt-1">Won Deals</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">
              ${totalAmount.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm mt-1">Total Amount</p>
          </div>
        </div>

        {/* Deals Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-800 p-6 border-b border-gray-100">
            Deals
          </h2>
          {deals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No deals yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Click "Add Deal" to create the first deal
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deals.map(deal => (
                  <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {deal.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${deal.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(deal.status)}`}>
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(deal.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

export default ClientDetailPage