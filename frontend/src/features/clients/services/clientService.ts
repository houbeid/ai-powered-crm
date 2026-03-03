import axios from 'axios';
import type { Client, ClientCreateRequest } from '../types/client.types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const clientService = {
  async getAll(): Promise<Client[]> {
    const response = await axios.get<Client[]>(`${API_URL}/clients`, {
      headers: getHeaders()
    });
    return response.data;
  },

  async getById(id: number): Promise<Client> {
    const response = await axios.get<Client>(`${API_URL}/clients/${id}`, {
      headers: getHeaders()
    });
    return response.data;
  },

  async create(data: ClientCreateRequest): Promise<Client> {
    const response = await axios.post<Client>(`${API_URL}/clients`, data, {
      headers: getHeaders()
    });
    return response.data;
  },

  async update(id: number, data: ClientCreateRequest): Promise<Client> {
    const response = await axios.put<Client>(`${API_URL}/clients/${id}`, data, {
      headers: getHeaders()
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/clients/${id}`, {
      headers: getHeaders()
    });
  }
};