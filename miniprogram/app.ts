App<IAppOption>({
  globalData: {},

  onLaunch() {
    wx.login({
      success: () => {},
    })
  },
})
