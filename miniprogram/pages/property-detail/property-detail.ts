import { fetchPublicPropertyDetail, RawHouseItem } from '../../services/property'

interface FeatureItem {
  label: string
  value: string
}

interface InfoItem {
  label: string
  value: string
}

function buildFeatures(house: RawHouseItem): FeatureItem[] {
  return [
    { label: '区域', value: house.area || '-' },
    { label: '位置', value: house.location || '-' },
    { label: '户型', value: house.type || '-' },
    { label: '状态', value: house.status === 1 ? '待租' : house.status === 2 ? '已租' : '下架' },
  ]
}

function buildInfoItems(house: RawHouseItem): InfoItem[] {
  return [
    { label: '房源 ID', value: house.house_id || house._id || '-' },
    { label: '房东 ID', value: house.owner_id || '-' },
    { label: '创建时间', value: `${house.created_at || '-'}` },
    { label: '更新时间', value: `${house.updated_at || '-'}` },
  ]
}

Page({
  data: {
    houseId: '',
    title: '房源详情',
    priceText: '',
    gallery: [] as string[],
    tags: [] as string[],
    features: [] as FeatureItem[],
    infoItems: [] as InfoItem[],
    loading: true,
    loadFailed: false,
  },

  onLoad(query: Record<string, string | undefined>) {
    const houseId = query.id || ''

    this.setData({ houseId })

    if (!houseId) {
      this.setData({
        loading: false,
        loadFailed: true,
      })
      return
    }

    this.loadDetail(houseId)
  },

  loadDetail(houseId: string) {
    this.setData({
      loading: true,
      loadFailed: false,
    })

    fetchPublicPropertyDetail(houseId)
      .then((house) => {
        this.setData({
          title: `${house.location} ${house.type}`,
          priceText: `¥${house.price}/月`,
          gallery: house.images || [],
          tags: house.tags || [],
          features: buildFeatures(house),
          infoItems: buildInfoItems(house),
          loading: false,
          loadFailed: false,
        })
      })
      .catch(() => {
        this.setData({
          loading: false,
          loadFailed: true,
        })
      })
  },
})
