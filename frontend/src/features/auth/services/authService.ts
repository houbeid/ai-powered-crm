import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(`${API_URL}/auth/register`, data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};