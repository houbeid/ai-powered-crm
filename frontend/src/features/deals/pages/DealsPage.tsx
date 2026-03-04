import { useState, useEffect } from 'react'
import { dealService } from '../services/dealService'
import DealForm from '../components/DealForm'
import AiAdviceCard from '../components/AiAdviceCard'
import Modal from '../../../shared/components/Modal'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'
import Navbar from '../../../shared/components/Navbar'
import type { Deal, DealCreateRequest, AiAdvice } from '../types/deal.types'

const STATUSES = ['New', 'InProgress', 'Won', 'Lost']

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    New: 'bg-gray-100 text-gray-600',
    InProgress: 'bg-blue-100 text-blue-600',
    Won: 'bg-green-100 text-green-600',
    Lost: 'bg-red-100 text-red-600'
  }
  return styles[status] || 'bg-gray-100 text-gray-600'
}

const DealsPage = () => {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [aiAdvice, setAiAdvice] = useState<AiAdvice | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const data = await dealService.getAll()
      setDeals(data)
    } catch {
      console.error('Error fetching deals')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: DealCreateRequest) => {
    await dealService.create(data)
    await fetchDeals()
    setIsFormModalOpen(false)
  }

  const handleUpdate = async (data: DealCreateRequest) => {
    if (!selectedDeal) return
    await dealService.update(selectedDeal.id, data)
    await fetchDeals()
    setIsFormModalOpen(false)
    setSelectedDeal(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this deal?')) return
    setDeleteLoading(id)
    try {
      await dealService.delete(id)
      await fetchDeals()
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    if (!selectedDeal) return
    await dealService.updateStatus(selectedDeal.id, { status })
    await fetchDeals()
    setIsStatusModalOpen(false)
    setSelectedDeal(null)
  }

  const handleAiAdvice = async (deal: Deal) => {
    setSelectedDeal(deal)
    setIsAiModalOpen(true)
    setAiLoading(true)
    try {
      const advice = await dealService.getAiAdvice(deal.id)
      setAiAdvice(advice)
    } catch {
      console.error('Error fetching AI advice')
    } finally {
      setAiLoading(false)
    }
  }

  const openCreateModal = () => {
    setSelectedDeal(null)
    setIsFormModalOpen(true)
  }

  const openEditModal = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsFormModalOpen(true)
  }

  const openStatusModal = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsStatusModalOpen(true)
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
            <h1 className="text-2xl font-bold text-gray-800">Deals</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and track your deals
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Deal
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : deals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-400 text-lg">No deals yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Add Deal" to get started
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deals.map(deal => (
                  <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
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
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(deal.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(deal)}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openStatusModal(deal)}
                          className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-yellow-100 transition-colors"
                        >
                          Status
                        </button>

                        {deal.status === 'New' || deal.status === 'InProgress' ? (
                          <button
                            onClick={() => handleAiAdvice(deal)}
                            className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors"
                          >
                             AI
                          </button>
                        ) : deal.status === 'Lost' ? (
                          <button
                            onClick={() => handleAiAdvice(deal)}
                            className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors"
                          >
                             Recovery
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleDelete(deal.id)}
                          disabled={deleteLoading === deal.id}
                          className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === deal.id ? '...' : 'Delete'}
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

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setSelectedDeal(null)
        }}
        title={selectedDeal ? 'Edit Deal' : 'Add Deal'}
      >
        <DealForm
          deal={selectedDeal || undefined}
          onSubmit={selectedDeal ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsFormModalOpen(false)
            setSelectedDeal(null)
          }}
        />
      </Modal>

      {/* Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setSelectedDeal(null)
        }}
        title="Update Status"
      >
        <div className="space-y-3">
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => handleUpdateStatus(status)}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                selectedDeal?.status === status
                  ? 'ring-2 ring-blue-500 ' + getStatusBadge(status)
                  : getStatusBadge(status) + ' hover:opacity-80'
              }`}
            >
              {status}
              {selectedDeal?.status === status && ' ✓'}
            </button>
          ))}
        </div>
      </Modal>

      {/* AI Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false)
          setAiAdvice(null)
          setSelectedDeal(null)
        }}
        title=" AI Deal Advice"
      >
        {aiLoading ? (
          <div className="py-8">
            <LoadingSpinner />
            <p className="text-center text-gray-500 text-sm mt-2">
              Analyzing your deal...
            </p>
          </div>
        ) : aiAdvice ? (
          <AiAdviceCard
            advice={aiAdvice}
            onClose={() => {
              setIsAiModalOpen(false)
              setAiAdvice(null)
            }}
          />
        ) : (
          <p className="text-center text-gray-500 py-8">
            Failed to load AI advice. Please try again.
          </p>
        )}
      </Modal>

    </div>
  )
}

export default DealsPage