import { fetchPublicPropertyList, PropertyListItem } from '../../services/property'

interface FilterGroup {
  label: string
  active?: boolean
}

interface ShowCaseCard {
  title: string
  meta: string
  price: string
  badge: string
}

Page({
  data: {
    productHighlights: [
      '先说需求，再慢慢缩小范围',
      '客服会继续追问通勤和预算偏好',
    ],
    filterGroups: [
      { label: '整租', active: true },
      { label: '近地铁' },
      { label: '押一付一' },
      { label: '独卫' },
      { label: '可养宠物' },
      { label: '随时看房' },
    ] as FilterGroup[],
    smartTip: '公开房源接口补齐后，这里会直接切成可浏览的找房列表；当前更推荐先去咨询。',
    recommendCards: [] as PropertyListItem[],
    recommendLoading: true,
    recommendLoadFailed: false,
    showCaseCards: [
      {
        title: '通勤优先',
        meta: '适合上班族，先看地铁和通勤时间',
        price: '先说公司位置和预算',
        badge: '高频需求',
      },
      {
        title: '预算敏感',
        meta: '适合第一次租房，先控总预算和付款方式',
        price: '再细化整租 / 合租',
        badge: '省心路线',
      },
    ] as ShowCaseCard[],
  },

  onLoad() {
    this.loadRecommendCards()
  },

  goToAi() {
    wx.switchTab({ url: '/pages/ai/ai' })
  },

  openDetail(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id as string

    if (!id) {
      return
    }

    wx.navigateTo({ url: `/pages/property-detail/property-detail?id=${id}` })
  },

  loadRecommendCards() {
    this.setData({
      recommendLoading: true,
      recommendLoadFailed: false,
    })

    fetchPublicPropertyList({
      page: 1,
      limit: 2,
    })
      .then((list) => {
        this.setData({
          recommendCards: list.slice(0, 2),
          recommendLoading: false,
          recommendLoadFailed: false,
        })
      })
      .catch(() => {
        this.setData({
          recommendLoading: false,
          recommendLoadFailed: true,
        })
      })
  },
})
