import { API_ENDPOINTS } from '../api/endpoints'
import request from '../utils/request'

export type UserRole = 'tenant' | 'landlord'

export interface UserProfile {
  user_id?: string
  role?: UserRole
  nickname?: string
  avatar?: string
  contact?: {
    wechat?: string
    phone?: string
  }
}

export interface TenantDashboard {
  favorite_count?: number
  history_count?: number
  session_count?: number
}

export interface LandlordDashboard {
  house_total?: number
  house_on_rent?: number
  house_rented?: number
  house_offline?: number
}

export interface UserDashboard {
  tenant?: TenantDashboard
  landlord?: LandlordDashboard
  favorite_count?: number
  history_count?: number
  session_count?: number
  house_total?: number
  house_on_rent?: number
  house_rented?: number
  house_offline?: number
}

export function fetchUserProfile(): Promise<UserProfile> {
  return request<UserProfile>({
    url: API_ENDPOINTS.user.profile,
    data: {},
  })
}

export function fetchUserDashboard(): Promise<UserDashboard> {
  return request<UserDashboard>({
    url: API_ENDPOINTS.user.dashboard,
    data: {},
  })
}

