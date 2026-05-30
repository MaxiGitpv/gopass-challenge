import { apiClient } from './axios';
import type { ApiResponse, AuthData } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthData> {
  const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/login', payload);
  return data.data;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthData> {
  const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/register', payload);
  return data.data;
}
