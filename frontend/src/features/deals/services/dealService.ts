import api from '../../../shared/utils/api'
import type { Deal, DealCreateRequest, UpdateStatusRequest, AiAdvice } from '../types/deal.types'

export const dealService = {
  async getAll(): Promise<Deal[]> {
    const response = await api.get<Deal[]>('/deals')
    return response.data
  },

  async getById(id: number): Promise<Deal> {
    const response = await api.get<Deal>(`/deals/${id}`)
    return response.data
  },

  async getByClientId(clientId: number): Promise<Deal[]> {
    const response = await api.get<Deal[]>(`/deals/client/${clientId}`)
    return response.data
  },

  async create(data: DealCreateRequest): Promise<Deal> {
    const response = await api.post<Deal>('/deals', data)
    return response.data
  },

  async update(id: number, data: DealCreateRequest): Promise<Deal> {
    const response = await api.put<Deal>(`/deals/${id}`, data)
    return response.data
  },

  async updateStatus(id: number, data: UpdateStatusRequest): Promise<Deal> {
    const response = await api.patch<Deal>(`/deals/${id}/status`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/deals/${id}`)
  },

  async getAiAdvice(id: number): Promise<AiAdvice> {
    const response = await api.post<AiAdvice>(`/deals/${id}/ai-advice`, {})
    return response.data
  }
}