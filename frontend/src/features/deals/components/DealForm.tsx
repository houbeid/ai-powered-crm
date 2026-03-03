import { useState, useEffect } from 'react'
import type { Deal, DealCreateRequest } from '../types/deal.types'
import { clientService } from '../../clients/services/clientService'
import type { Client } from '../../clients/types/client.types'

interface DealFormProps {
  deal?: Deal
  preselectedClientId?: number
  onSubmit: (data: DealCreateRequest) => Promise<void>
  onCancel: () => void
}

const DealForm = ({ deal, preselectedClientId, onSubmit, onCancel }: DealFormProps) => {
  const [form, setForm] = useState<DealCreateRequest>({
    title: deal?.title || '',
    description: deal?.description || '',
    amount: deal?.amount || 0,
    clientId: deal?.clientId || preselectedClientId || 0
  })
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll()
      setClients(data)
    } catch {
      console.error('Error fetching clients')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSubmit(form)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enterprise License"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Deal description..."
          rows={3}
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($)
        </label>
        <input
          type="number"
          required
          min={0}
          value={form.amount}
          onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="50000"
        />
      </div>

      {/* Client */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client
        </label>
        <select
          required
          value={form.clientId}
          onChange={e => setForm({ ...form, clientId: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0} disabled>Select a client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.companyName}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : deal ? 'Update' : 'Create'}
        </button>
      </div>

    </form>
  )
}

export default DealForm