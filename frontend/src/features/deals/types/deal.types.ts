import type { Client } from '../../clients/types/client.types'

export interface Deal {
  id: number
  title: string
  description: string
  amount: number
  status: string
  createdAt: string
  clientId: number
  client?: Client
}

export interface DealCreateRequest {
  title: string
  description: string
  amount: number
  clientId: number
}

export interface UpdateStatusRequest {
  status: string
}

export interface AiAdvice {
  analysis: string
  obstacles: string
  recommendations: string
  closingArgument: string
}