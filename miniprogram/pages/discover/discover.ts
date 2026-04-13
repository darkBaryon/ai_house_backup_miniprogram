import { fetchPublicHouseList, HouseListItem } from '../../services/house'

interface QuickPreset {
  id: string
  label: string
}

type HouseCardListKey = 'recommendCards' | 'publicCards'
type ToggleField =
  | 'needNearSubway'
  | 'needPetFriendly'
  | 'needElevator'
  | 'needCookingAllowed'

Page({
  data: {
    quickPresets: [
      { id: 'near_subway', label: '近地铁' },
      { id: 'budget_friendly', label: '预算友好' },
      { id: 'whole_two_room', label: '整租两居' },
      { id: 'pet_friendly', label: '可养宠物' },
      { id: 'pay_monthly', label: '押一付一' },
    ] as QuickPreset[],
    selectedQuickPreset: '',
    advancedOpen: false,
    areaOptions: ['', '南山', '福田', '宝安', '罗湖'],
    selectedArea: '',
    rentModeOptions: [
      { label: '不限', value: '' },
      { label: '整租', value: 'whole' },
      { label: '合租', value: 'shared' },
    ],
    selectedRentMode: '',
    roomCountMinOptions: [0, 1, 2, 3],
    selectedRoomCountMin: 0,
    paymentCycleOptions: ['', '押一付一', '押一付三', '月付', '季付'],
    selectedPaymentCycle: '',
    furnishedOptions: [
      { label: '不限', value: '' },
      { label: '简装', value: 'basic' },
      { label: '拎包入住', value: 'full' },
    ],
    selectedFurnishedLevel: '',
    needNearSubway: false,
    needPetFriendly: false,
    needElevator: false,
    needCookingAllowed: false,
    minPriceInput: '',
    maxPriceInput: '',
    smartTip: '支持快捷筛选和高级筛选',
    searchKeyword: '',
    hasSearched: false,
    publicCards: [] as HouseListItem[],
    publicLoading: false,
    publicLoadFailed: false,
    recommendCards: [] as HouseListItem[],
    recommendLoading: true,
    recommendLoadFailed: false,
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

    wx.navigateTo({ url: `/pages/house-detail/house-detail?id=${id}` })
  },

  onKeywordInput(event: WechatMiniprogram.BaseEvent<{ value: string }>) {
    this.setData({
      searchKeyword: event.detail.value,
    })
  },

  onSearchTap() {
    this.loadPublicCards()
  },

  toggleAdvancedPanel() {
    this.setData({
      advancedOpen: !this.data.advancedOpen,
    })
  },

  onQuickPresetTap(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id as string

    if (!id) {
      return
    }

    const patch: WechatMiniprogram.IAnyObject = {
      selectedQuickPreset: id,
    }

    if (id === 'near_subway') {
      patch.needNearSubway = true
    } else if (id === 'budget_friendly') {
      patch.maxPriceInput = '3500'
    } else if (id === 'whole_two_room') {
      patch.selectedRentMode = 'whole'
      patch.selectedRoomCountMin = 2
    } else if (id === 'pet_friendly') {
      patch.needPetFriendly = true
    } else if (id === 'pay_monthly') {
      patch.selectedPaymentCycle = '押一付一'
    }

    this.setData(patch)
    this.loadPublicCards()
  },

  onAreaTap(event: WechatMiniprogram.BaseEvent) {
    this.setData({
      selectedArea: (event.currentTarget.dataset.value as string) || '',
    })
  },

  onRentModeTap(event: WechatMiniprogram.BaseEvent) {
    this.setData({
      selectedRentMode: (event.currentTarget.dataset.value as string) || '',
    })
  },

  onRoomCountTap(event: WechatMiniprogram.BaseEvent) {
    const value = Number(event.currentTarget.dataset.value)
    this.setData({
      selectedRoomCountMin: Number.isNaN(value) ? 0 : value,
    })
  },

  onPaymentCycleTap(event: WechatMiniprogram.BaseEvent) {
    this.setData({
      selectedPaymentCycle: (event.currentTarget.dataset.value as string) || '',
    })
  },

  onFurnishedTap(event: WechatMiniprogram.BaseEvent) {
    this.setData({
      selectedFurnishedLevel: (event.currentTarget.dataset.value as string) || '',
    })
  },

  onToggleFieldChange(event: WechatMiniprogram.BaseEvent<{ value: boolean }>) {
    const field = event.currentTarget.dataset.field as ToggleField
    const value = !!event.detail.value

    if (!field) {
      return
    }

    this.setData({
      [field]: value,
    })
  },

  onMinPriceInput(event: WechatMiniprogram.BaseEvent<{ value: string }>) {
    this.setData({
      minPriceInput: event.detail.value || '',
    })
  },

  onMaxPriceInput(event: WechatMiniprogram.BaseEvent<{ value: string }>) {
    this.setData({
      maxPriceInput: event.detail.value || '',
    })
  },

  onApplyFilters() {
    this.loadPublicCards()
  },

  onResetFilters() {
    this.setData({
      selectedQuickPreset: '',
      selectedArea: '',
      selectedRentMode: '',
      selectedRoomCountMin: 0,
      selectedPaymentCycle: '',
      selectedFurnishedLevel: '',
      needNearSubway: false,
      needPetFriendly: false,
      needElevator: false,
      needCookingAllowed: false,
      minPriceInput: '',
      maxPriceInput: '',
    })

    this.loadPublicCards()
  },

  onCardImageError(event: WechatMiniprogram.BaseEvent) {
    const listKey = event.currentTarget.dataset.listKey as HouseCardListKey
    const index = Number(event.currentTarget.dataset.index)
    const targetList =
      listKey === 'recommendCards' ? this.data.recommendCards : this.data.publicCards

    if (!Array.isArray(targetList) || Number.isNaN(index) || !targetList[index]) {
      return
    }

    this.setData({
      [`${listKey}[${index}].cover`]: '',
    })
  },

  parsePrice(value: string): number | undefined {
    const next = parseInt((value || '').trim(), 10)

    if (Number.isNaN(next) || next <= 0) {
      return undefined
    }

    return next
  },

  getSearchParams() {
    const minPrice = this.parsePrice(this.data.minPriceInput)
    const maxPrice = this.parsePrice(this.data.maxPriceInput)

    return {
      area: this.data.selectedArea,
      min_price: minPrice,
      max_price: maxPrice,
      keyword: this.data.searchKeyword.trim(),
      rent_mode: this.data.selectedRentMode,
      room_count_min:
        this.data.selectedRoomCountMin > 0 ? this.data.selectedRoomCountMin : undefined,
      payment_cycle: this.data.selectedPaymentCycle,
      near_subway: this.data.needNearSubway ? true : undefined,
      pet_friendly: this.data.needPetFriendly ? true : undefined,
      has_elevator: this.data.needElevator ? true : undefined,
      cooking_allowed: this.data.needCookingAllowed ? true : undefined,
      furnished_level: this.data.selectedFurnishedLevel,
      page: 1,
      limit: 20,
    }
  },

  loadPublicCards() {
    this.setData({
      hasSearched: true,
      publicLoading: true,
      publicLoadFailed: false,
    })

    fetchPublicHouseList(this.getSearchParams())
      .then((list) => {
        this.setData({
          publicCards: list,
          publicLoading: false,
          publicLoadFailed: false,
        })
      })
      .catch(() => {
        this.setData({
          publicLoading: false,
          publicLoadFailed: true,
        })
      })
  },

  loadRecommendCards() {
    this.setData({
      recommendLoading: true,
      recommendLoadFailed: false,
    })

    fetchPublicHouseList({
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
