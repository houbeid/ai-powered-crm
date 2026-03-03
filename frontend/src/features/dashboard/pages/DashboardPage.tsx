import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../shared/components/Navbar'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'
import { clientService } from '../../clients/services/clientService'
import { dealService } from '../../deals/services/dealService'
import type { Client } from '../../clients/types/client.types'
import type { Deal } from '../../deals/types/deal.types'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [clientsData, dealsData] = await Promise.all([
        clientService.getAll(),
        dealService.getAll()
      ])
      setClients(clientsData)
      setDeals(dealsData)
    } catch {
      console.error('Error fetching dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const wonDeals = deals.filter(d => d.status === 'Won')
  const inProgressDeals = deals.filter(d => d.status === 'InProgress')
  const totalAmount = wonDeals.reduce((sum, d) => sum + d.amount, 0)
  const recentDeals = deals.slice(0, 5)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of your CRM activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Clients</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {clients.length}
            </p>
            <button
              onClick={() => navigate('/clients')}
              className="text-blue-600 text-xs mt-2 hover:underline"
            >
              View all →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Deals</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {deals.length}
            </p>
            <button
              onClick={() => navigate('/deals')}
              className="text-blue-600 text-xs mt-2 hover:underline"
            >
              View all →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Won Deals</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {wonDeals.length}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              {inProgressDeals.length} in progress
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              ${totalAmount.toLocaleString()}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              From won deals
            </p>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Deals
            </h2>
            <button
              onClick={() => navigate('/deals')}
              className="text-blue-600 text-sm hover:underline"
            >
              View all →
            </button>
          </div>

          {recentDeals.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400">No deals yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Client
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentDeals.map(deal => (
                  <tr
                    key={deal.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/deals')}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {deal.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {deal.client?.companyName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${deal.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(deal.status)}`}>
                        {deal.status}
                      </span>
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

export default DashboardPage