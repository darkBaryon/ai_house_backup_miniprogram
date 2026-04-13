import { API_ENDPOINTS } from '../../api/endpoints'
import request from '../../utils/request'

const PROFILE_LOGIN_FLAG = 'profile_login_confirmed'

Page({
  data: {
    loading: false,
    agreed: true,
  },

  onAgreeChange(event: WechatMiniprogram.BaseEvent<{ value: string[] }>) {
    this.setData({
      agreed: (event.detail.value || []).indexOf('agree') >= 0,
    })
  },

  onConfirmLogin() {
    if (this.data.loading) {
      return
    }

    if (!this.data.agreed) {
      wx.showToast({
        title: '请先勾选同意条款',
        icon: 'none',
      })
      return
    }

    this.setData({ loading: true })

    wx.login({
      success: (res) => {
        const code = res.code

        if (!code) {
          this.setData({ loading: false })
          wx.showToast({
            title: '登录失败，未获取到 code',
            icon: 'none',
          })
          return
        }

        request<{ token: string }>({
          url: API_ENDPOINTS.auth.wechatLogin,
          data: { code },
        })
          .then((loginData) => {
            const token = loginData && loginData.token ? loginData.token : ''

            if (!token) {
              this.setData({ loading: false })
              wx.showToast({
                title: '登录成功但未返回 token',
                icon: 'none',
              })
              return
            }

            wx.setStorageSync('token', token)
            wx.setStorageSync(PROFILE_LOGIN_FLAG, 1)
            const app = getApp<IAppOption>()
            app.globalData.token = token

            this.setData({ loading: false })
            wx.showToast({
              title: '登录成功',
              icon: 'success',
            })

            setTimeout(() => {
              wx.navigateBack()
            }, 220)
          })
          .catch((error) => {
            console.error('[Login] request failed:', error)
            this.setData({ loading: false })
          })
      },
      fail: (error) => {
        console.error('[Login] wx.login failed:', error)
        this.setData({ loading: false })
        wx.showToast({
          title: '微信登录失败',
          icon: 'none',
        })
      },
    })
  },
})
