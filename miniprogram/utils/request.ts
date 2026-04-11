declare const __wxConfig:
  | {
      envVersion?: 'develop' | 'trial' | 'release'
    }
  | undefined

interface BaseUrlMap {
  develop: string
  trial: string
  release: string
}

const BASE_URL_MAP: BaseUrlMap = {
  develop: 'http://127.0.0.1:5000',
  trial: 'http://127.0.0.1:5000',
  release: 'http://127.0.0.1:5000',
}

const API_VERSION = 'v1'

function resolveBaseUrl(): string {
  const envVersion = __wxConfig?.envVersion || 'develop'
  return BASE_URL_MAP[envVersion]
}

export const BASE_URL = resolveBaseUrl()
export const API_PREFIX = `/api/${API_VERSION}`

type RequestData = WechatMiniprogram.RequestOption['data']

export interface RequestOptions {
  url: string
  data?: RequestData
  header?: WechatMiniprogram.IAnyObject
}

export interface ApiResponse<T = WechatMiniprogram.IAnyObject> {
  code?: number
  data?: T
  message?: string
  msg?: string
  detail?: string
}

function showErrorToast(message?: string): void {
  wx.showToast({
    title: message && message.trim() ? message : '请求失败，请稍后重试',
    icon: 'none',
    duration: 2000,
  })
}

function isSuccessCode(code?: number): boolean {
  return code === 1
}

function buildRequestUrl(url: string): string {
  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
    return url
  }

  if (url.indexOf('/api/') === 0) {
    return `${BASE_URL}${url}`
  }

  return `${BASE_URL}${API_PREFIX}${url}`
}

export function request<T = WechatMiniprogram.IAnyObject>(
  options: RequestOptions
): Promise<T> {
  const { url, data, header = {} } = options
  const requestUrl = buildRequestUrl(url)

  return new Promise<T>((resolve, reject) => {
    const token = wx.getStorageSync('token') as string
    const requestHeader: WechatMiniprogram.IAnyObject = {
      'content-type': 'application/json',
      ...header,
    }

    if (token) {
      requestHeader.Authorization = `Bearer ${token}`
    }

    wx.request<ApiResponse<T>>({
      url: requestUrl,
      method: 'POST',
      data,
      header: requestHeader,
      success: (response) => {
        const { statusCode, data: responseData } = response

        if (statusCode < 200 || statusCode >= 300) {
          const errorMessage =
            responseData?.detail ||
            responseData?.message ||
            responseData?.msg ||
            `请求失败（HTTP ${statusCode}）`

          showErrorToast(errorMessage)
          reject(new Error(errorMessage))
          return
        }

        if (!isSuccessCode(responseData?.code)) {
          const errorMessage =
            responseData?.detail ||
            responseData?.message ||
            responseData?.msg ||
            '业务处理失败'

          showErrorToast(errorMessage)
          reject(new Error(errorMessage))
          return
        }

        resolve((responseData?.data ?? {}) as T)
      },
      fail: (error) => {
        const errorMessage = error.errMsg || '网络异常，请检查网络连接'
        showErrorToast(errorMessage)
        reject(new Error(errorMessage))
      },
    })
  })
}

export default request
