interface ShortcutItem {
  title: string
  subtitle: string
  tone: string
}

interface PropertyItem {
  id: string
  title: string
  location: string
  meta: string
  price: string
  tags: string[]
}

Page({
  data: {
    city: '上海',
    quickFilters: ['近地铁', '低总价', '精装修', 'AI推荐'],
    shortcuts: [
      { title: '买新房', subtitle: '刚需改善', tone: 'blue' },
      { title: '二手房', subtitle: '成熟社区', tone: 'green' },
      { title: '租房', subtitle: '拎包入住', tone: 'gold' },
      { title: '地图找房', subtitle: '按位置筛选', tone: 'purple' },
      { title: '学区找房', subtitle: '教育配套', tone: 'blue' },
      { title: 'AI选房', subtitle: '智能匹配', tone: 'green' },
      { title: '降价房源', subtitle: '近期调价', tone: 'gold' },
      { title: '预约看房', subtitle: '专属带看', tone: 'purple' },
    ] as ShortcutItem[],
    todayPicks: [
      {
        id: 'p-001',
        title: '静安内环 品质三居',
        location: '静安区 | 中兴路',
        meta: '3室2厅 · 108㎡ · 南北通透',
        price: '798万',
        tags: ['近地铁', '精装修', 'AI高匹配'],
      },
      {
        id: 'p-002',
        title: '浦东花木 改善四居',
        location: '浦东新区 | 花木',
        meta: '4室2厅 · 143㎡ · 双阳台',
        price: '1180万',
        tags: ['学区配套', '满五', '随时看房'],
      },
    ] as PropertyItem[],
    aiMatches: [
      {
        id: 'm-001',
        title: '预算 500 万内推荐',
        location: '闵行区 | 七宝',
        meta: '2室2厅 · 89㎡ · 地铁步行 8 分钟',
        price: '468万',
        tags: ['通勤友好', '首付压力低'],
      },
      {
        id: 'm-002',
        title: '家庭居住优先推荐',
        location: '宝山区 | 大场',
        meta: '3室2厅 · 112㎡ · 社区新',
        price: '535万',
        tags: ['儿童友好', '绿化高'],
      },
    ] as PropertyItem[],
  },

  goToDiscover() {
    wx.switchTab({ url: '/pages/discover/discover' })
  },

  goToAi() {
    wx.switchTab({ url: '/pages/ai/ai' })
  },

  openPropertyDetail() {
    wx.navigateTo({ url: '/pages/property-detail/property-detail' })
  },
})
