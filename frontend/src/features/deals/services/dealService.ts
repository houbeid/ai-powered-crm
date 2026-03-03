import axios from 'axios'
import type { Deal, DealCreateRequest, UpdateStatusRequest, AiAdvice } from '../types/deal.types'

const API_URL = import.meta.env.VITE_API_BASE_URL

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

export const dealService = {
  async getAll(): Promise<Deal[]> {
    const response = await axios.get<Deal[]>(`${API_URL}/deals`, {
      headers: getHeaders()
    })
    return response.data
  },

  async getById(id: number): Promise<Deal> {
    const response = await axios.get<Deal>(`${API_URL}/deals/${id}`, {
      headers: getHeaders()
    })
    return response.data
  },

  async getByClientId(clientId: number): Promise<Deal[]> {
    const response = await axios.get<Deal[]>(`${API_URL}/deals/client/${clientId}`, {
      headers: getHeaders()
    })
    return response.data
  },

  async create(data: DealCreateRequest): Promise<Deal> {
    const response = await axios.post<Deal>(`${API_URL}/deals`, data, {
      headers: getHeaders()
    })
    return response.data
  },

  async update(id: number, data: DealCreateRequest): Promise<Deal> {
    const response = await axios.put<Deal>(`${API_URL}/deals/${id}`, data, {
      headers: getHeaders()
    })
    return response.data
  },

  async updateStatus(id: number, data: UpdateStatusRequest): Promise<Deal> {
    const response = await axios.patch<Deal>(`${API_URL}/deals/${id}/status`, data, {
      headers: getHeaders()
    })
    return response.data
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/deals/${id}`, {
      headers: getHeaders()
    })
  },

  async getAiAdvice(id: number): Promise<AiAdvice> {
    const response = await axios.post<AiAdvice>(`${API_URL}/deals/${id}/ai-advice`, {}, {
      headers: getHeaders()
    })
    return response.data
  }
}