export interface Client {
  id: number;
  companyName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface ClientCreateRequest {
  companyName: string;
  email: string;
  phone: string;
}