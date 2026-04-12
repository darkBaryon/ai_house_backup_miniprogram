export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    wechatLogin: '/auth/wechat_login',
  },
  chat: {
    send: '/chat/send',
  },
  house: {
    search: '/house/search',
    detail: '/house/detail',
    list: '/house/list',
    create: '/house/create',
    update: '/house/update',
    status: '/house/status',
    delete: '/house/delete',
  },
} as const
