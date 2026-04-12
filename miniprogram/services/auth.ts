import { API_ENDPOINTS } from '../api/endpoints'
import request from '../utils/request'

export interface WechatLoginResult {
  token: string
}

export function wechatLogin(code: string): Promise<WechatLoginResult> {
  return request<WechatLoginResult>({
    url: API_ENDPOINTS.auth.wechatLogin,
    data: { code },
  })
}
