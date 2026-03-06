// app.ts
const LOGS_KEY = 'logs'

App<IAppOption>({
  globalData: {},

  onLaunch() {
    console.log('[CustomerApp] onLaunch triggered')

    // 1. 读写启动日志到本地缓存
    const logs: number[] = wx.getStorageSync(LOGS_KEY) || []
    const now = Date.now()
    console.log('[CustomerApp] current timestamp:', now)
    logs.unshift(now)
    wx.setStorageSync(LOGS_KEY, logs)
    console.log('[CustomerApp] logs cache updated, length:', logs.length)

    // 2. 登录
    console.log('[CustomerApp] wx.login calling...')
    wx.login({
      success: (res) => {
        console.log('[CustomerApp] wx.login success, code:', res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: (err) => {
        console.log('[CustomerApp] wx.login fail:', err)
      },
    })
  },
})
