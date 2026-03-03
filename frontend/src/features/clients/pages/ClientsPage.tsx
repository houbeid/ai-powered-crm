import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientService } from '../services/clientService'
import ClientForm from '../components/ClientForm'
import Modal from '../../../shared/components/Modal'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'
import Navbar from '../../../shared/components/Navbar'
import type { Client, ClientCreateRequest } from '../types/client.types'

const ClientsPage = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const data = await clientService.getAll()
      setClients(data)
    } catch {
      console.error('Error fetching clients')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: ClientCreateRequest) => {
    await clientService.create(data)
    await fetchClients()
    setIsModalOpen(false)
  }

  const handleUpdate = async (data: ClientCreateRequest) => {
    if (!selectedClient) return
    await clientService.update(selectedClient.id, data)
    await fetchClients()
    setIsModalOpen(false)
    setSelectedClient(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) return
    setDeleteLoading(id)
    try {
      await clientService.delete(id)
      await fetchClients()
    } finally {
      setDeleteLoading(null)
    }
  }

  const openCreateModal = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  const openEditModal = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your business clients
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Client
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : clients.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-400 text-lg">No clients yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Add Client" to get started
            </p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                    Company
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                    Phone
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                    Created At
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {client.companyName}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {client.phone}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(client)}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          disabled={deleteLoading === client.id}
                          className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === client.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedClient(null)
        }}
        title={selectedClient ? 'Edit Client' : 'Add Client'}
      >
        <ClientForm
          client={selectedClient || undefined}
          onSubmit={selectedClient ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedClient(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default ClientsPage