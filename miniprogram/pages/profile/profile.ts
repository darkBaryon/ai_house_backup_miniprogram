import {
  fetchUserDashboard,
  fetchUserProfile,
  TenantDashboard,
} from '../../services/user'

interface TenantStatItem {
  key: 'favorite_count' | 'history_count' | 'session_count'
  label: string
  value: number
}

interface TenantActionItem {
  id: string
  title: string
  desc: string
}

interface TenantProfileInfo {
  nickname: string
  role: 'tenant'
}

const PROFILE_LOGIN_FLAG = 'profile_login_confirmed'

function getDefaultStats(): TenantStatItem[] {
  return [
    { key: 'favorite_count', label: '收藏房源', value: 0 },
    { key: 'history_count', label: '浏览记录', value: 0 },
    { key: 'session_count', label: '咨询会话', value: 0 },
  ]
}

function getAvatarText(nickname: string): string {
  const name = (nickname || '').trim()
  return name ? name.slice(0, 1) : '租'
}

function normalizeTenantDashboard(payload: TenantDashboard): TenantStatItem[] {
  return [
    {
      key: 'favorite_count',
      label: '收藏房源',
      value: typeof payload.favorite_count === 'number' ? payload.favorite_count : 0,
    },
    {
      key: 'history_count',
      label: '浏览记录',
      value: typeof payload.history_count === 'number' ? payload.history_count : 0,
    },
    {
      key: 'session_count',
      label: '咨询会话',
      value: typeof payload.session_count === 'number' ? payload.session_count : 0,
    },
  ]
}

Page({
  data: {
    profile: {
      nickname: '租客用户',
      role: 'tenant',
    } as TenantProfileInfo,
    isLoggedIn: false,
    avatarText: '租',
    loading: false,
    stats: getDefaultStats(),
    actions: [
      { id: 'favorite', title: '我的收藏', desc: '收藏房源与追踪进展' },
      { id: 'history', title: '浏览记录', desc: '最近看过的房源' },
      { id: 'session', title: '咨询记录', desc: '和客服的历史对话' },
      { id: 'discover', title: '继续找房', desc: '返回公开找房页继续筛选' },
    ] as TenantActionItem[],
    tips: [
      '租客模式下，找房页与咨询页将优先展示租客能力。',
      '切换到房东后，可进入房源管理与运营视图。',
    ],
  },

  onShow() {
    this.syncLoginState()
    this.loadTenantProfile()
    this.loadTenantStats()
    this.loadRemoteProfile()
    this.loadRemoteDashboard()
  },

  syncLoginState() {
    const confirmed = wx.getStorageSync(PROFILE_LOGIN_FLAG)

    this.setData({
      isLoggedIn: confirmed === 1 || confirmed === true,
    })
  },

  loadTenantProfile() {
    const nickname = (wx.getStorageSync('user_nickname') as string) || '租客用户'

    this.setData({
      profile: {
        nickname,
        role: 'tenant',
      },
      avatarText: getAvatarText(nickname),
    })
  },

  loadTenantStats() {
    const cached = wx.getStorageSync('tenant_dashboard') as
      | {
          favorite_count?: number
          history_count?: number
          session_count?: number
        }
      | undefined

    if (!cached) {
      this.setData({
        stats: getDefaultStats(),
      })
      return
    }

    const nextStats: TenantStatItem[] = [
      ...normalizeTenantDashboard(cached),
    ]

    this.setData({
      stats: nextStats,
    })
  },

  loadRemoteProfile() {
    if (!this.data.isLoggedIn) {
      return
    }

    this.setData({ loading: true })

    fetchUserProfile()
      .then((profile) => {
        const nickname = profile.nickname || this.data.profile.nickname || '租客用户'

        wx.setStorageSync('user_nickname', nickname)

        this.setData({
          profile: {
            nickname,
            role: 'tenant',
          },
          avatarText: getAvatarText(nickname),
          loading: false,
        })
      })
      .catch(() => {
        this.setData({ loading: false })
      })
  },

  loadRemoteDashboard() {
    if (!this.data.isLoggedIn) {
      return
    }

    fetchUserDashboard()
      .then((dashboard) => {
        const tenantPayload = dashboard.tenant || dashboard
        const next = normalizeTenantDashboard(tenantPayload)

        this.setData({
          stats: next,
        })

        wx.setStorageSync('tenant_dashboard', {
          favorite_count: next[0].value,
          history_count: next[1].value,
          session_count: next[2].value,
        })
      })
      .catch(() => {
        // 保持缓存/默认展示，不额外打扰用户。
      })
  },

  onActionTap(event: WechatMiniprogram.BaseEvent) {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      })
      return
    }

    const id = event.currentTarget.dataset.id as string

    if (id === 'discover') {
      wx.switchTab({ url: '/pages/discover/discover' })
      return
    }

    if (id === 'session') {
      wx.switchTab({ url: '/pages/ai/ai' })
      return
    }

    wx.showToast({
      title: '该功能后续接入',
      icon: 'none',
    })
  },

  onSwitchRoleTap() {
    wx.showToast({
      title: '房东模式即将接入',
      icon: 'none',
    })
  },

  onLoginTap() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  goToAi() {
    wx.switchTab({ url: '/pages/ai/ai' })
  },
})
