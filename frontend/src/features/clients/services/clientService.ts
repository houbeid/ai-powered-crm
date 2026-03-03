import api from '../../../shared/utils/api'
import type { Client, ClientCreateRequest } from '../types/client.types'

export const clientService = {
  async getAll(): Promise<Client[]> {
    const response = await api.get<Client[]>('/clients')
    return response.data
  },

  async getById(id: number): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`)
    return response.data
  },

  async create(data: ClientCreateRequest): Promise<Client> {
    const response = await api.post<Client>('/clients', data)
    return response.data
  },

  async update(id: number, data: ClientCreateRequest): Promise<Client> {
    const response = await api.put<Client>(`/clients/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clients/${id}`)
  }
}