import { wechatLogin } from './services/auth'

App<IAppOption>({
  globalData: {
    token: '',
  },

  onLaunch() {
    wx.login({
      success: (res) => {
        const code = res.code
				
        if (!code) {
          wx.showToast({
            title: '微信登录失败，未获取到 code',
            icon: 'none',
          })
          return
        }

        wechatLogin(code)
          .then((loginData) => {
            const token = loginData && loginData.token ? loginData.token : ''

            if (!token) {
              wx.showToast({
                title: '登录成功但未返回 token',
                icon: 'none',
              })
              return
            }
            // 登录态持久化：保存本地 token，并同步到 globalData 供页面快速读取。
            wx.setStorageSync('token', token)
            this.globalData.token = token
          })
          .catch((error) => {
            console.error('[App] wechat login init failed:', error)
          })
      },
      fail: (error) => {
        console.error('[App] wx.login failed:', error)
        wx.showToast({
          title: '微信登录失败，请稍后重试',
          icon: 'none',
        })
      },
    })
  },
})
