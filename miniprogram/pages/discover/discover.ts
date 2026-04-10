interface FilterGroup {
  label: string
  active?: boolean
}

interface DiscoverProperty {
  id: string
  title: string
  district: string
  details: string
  price: string
  unitPrice: string
  tags: string[]
}

Page({
  data: {
    filterGroups: [
      { label: '区域', active: true },
      { label: '价格' },
      { label: '户型' },
      { label: '更多' },
      { label: '排序' },
    ] as FilterGroup[],
    smartTip: '根据你的浏览习惯，优先推荐地铁 15 分钟内、总价 600 万左右的三居。',
    properties: [
      {
        id: 'd-001',
        title: '大宁板块 通透三居',
        district: '静安区 · 大宁',
        details: '3室2厅 · 106㎡ · 南北通透 · 中楼层',
        price: '768万',
        unitPrice: '72500元/㎡',
        tags: ['近地铁', '满二', 'AI高匹配'],
      },
      {
        id: 'd-002',
        title: '前滩次新房 改善两居',
        district: '浦东新区 · 前滩',
        details: '2室2厅 · 92㎡ · 精装修 · 采光好',
        price: '830万',
        unitPrice: '90200元/㎡',
        tags: ['品质社区', '随时看房', '精装修'],
      },
      {
        id: 'd-003',
        title: '七宝成熟社区 家庭三居',
        district: '闵行区 · 七宝',
        details: '3室2厅 · 118㎡ · 近商圈 · 双卫',
        price: '598万',
        unitPrice: '50600元/㎡',
        tags: ['预算友好', '生活方便', '儿童友好'],
      },
    ] as DiscoverProperty[],
  },

  openDetail() {
    wx.navigateTo({ url: '/pages/property-detail/property-detail' })
  },

  goToAi() {
    wx.switchTab({ url: '/pages/ai/ai' })
  },
})
