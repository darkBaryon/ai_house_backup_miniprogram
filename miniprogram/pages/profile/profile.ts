Page({
  data: {
    stats: [
      { label: '收藏房源', value: '12' },
      { label: '浏览记录', value: '38' },
      { label: '预约看房', value: '3' },
      { label: 'AI对话', value: '9' },
    ],
    services: ['联系顾问', '我的预约', '消息通知', '浏览记录', '隐私设置', '意见反馈'],
  },

  goToAi() {
    wx.switchTab({ url: '/pages/ai/ai' })
  },
})
