import { ChatMessageItem, sendChatMessage } from '../../services/chat'
import { fetchPublicHouseList, HouseListItem } from '../../services/house'

interface PromptItem {
  title: string
  desc: string
  text: string
}

Page({
  data: {
    serviceName: '林夏',
    promptItems: [
      { title: '首次租房', desc: '先控月租和通勤', text: '我第一次租房，想先控制月租和通勤时间。' },
      { title: '近地铁', desc: '优先通勤方便', text: '请优先帮我筛选近地铁、步行可达的待租房源。' },
      { title: '整租两居', desc: '适合两人居住', text: '我想找整租两居，最好拎包入住。' },
      { title: '押一付一', desc: '先看付款压力', text: '请优先推荐押一付一、预算友好的房源。' },
      { title: '可养宠物', desc: '看友好标签', text: '我有宠物，请优先筛选可养宠物的房源。' },
      { title: '预算不确定', desc: '先帮我缩小范围', text: '我预算还不太确定，请先帮我倒推出合适的租房范围。' },
    ] as PromptItem[],
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: '可以直接告诉我月租预算、区域、通勤时间和标签偏好，我会先帮你缩小到待租房源范围。',
        timestamp: Date.now(),
      },
    ] as ChatMessageItem[],
    houseCards: [] as HouseListItem[],
    houseLoading: false,
    houseLoadFailed: false,
    followUps: ['帮我筛选近地铁', '只看 3000 元以内', '优先押一付一', '可养宠物'],
    promptCollapsed: false,
    inputValue: '',
    sending: false,
  },

  onLoad() {
    this.loadHouseCards()
  },

  onShow() {
    const prefillMessage = wx.getStorageSync('ai_prefill_message') as string

    if (!prefillMessage) {
      return
    }

    wx.removeStorageSync('ai_prefill_message')
    this.sendMessage(prefillMessage)
  },

  onInput(event: WechatMiniprogram.Input) {
    const value = event.detail.value || ''
    this.setData({ inputValue: value })
  },

  sendPreset(event: WechatMiniprogram.BaseEvent) {
    const text = event.currentTarget.dataset.text as string

    if (!text) {
      return
    }

    this.sendMessage(text)
  },

  sendFollowUp(event: WechatMiniprogram.BaseEvent) {
    const text = event.currentTarget.dataset.text as string

    if (!text) {
      return
    }

    this.sendMessage(text)
  },

  submitInput() {
    this.sendMessage(this.data.inputValue)
  },

  togglePromptPanel() {
    this.setData({
      promptCollapsed: !this.data.promptCollapsed,
    })
  },

  openDetail(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id as string

    if (!id) {
      return
    }

    wx.navigateTo({ url: `/pages/house-detail/house-detail?id=${id}` })
  },

  loadHouseCards(keyword?: string) {
    this.setData({
      houseLoading: true,
      houseLoadFailed: false,
    })

    fetchPublicHouseList({
      keyword: keyword || '',
      page: 1,
      limit: 2,
    })
      .then((list) => {
        if (keyword && list.length === 0) {
          return fetchPublicHouseList({
            page: 1,
            limit: 2,
          })
        }

        return list
      })
      .then((list) => {
        this.setData({
          houseCards: list.slice(0, 2),
          houseLoading: false,
          houseLoadFailed: false,
        })
      })
      .catch(() => {
        this.setData({
          houseLoading: false,
          houseLoadFailed: true,
        })
      })
  },

  sendMessage(rawText: string) {
    const text = (rawText || '').trim()

    if (!text || this.data.sending) {
      return
    }

    const currentMessages = this.data.messages

    const userMessage: ChatMessageItem = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    this.setData({
      messages: [...currentMessages, userMessage],
      inputValue: '',
      sending: true,
    })

    sendChatMessage(text)
      .then((assistantMessage) => {
        const nextMessages = assistantMessage
          ? [...currentMessages, userMessage, assistantMessage]
          : [...currentMessages, userMessage]

        this.setData({
          messages: nextMessages,
          sending: false,
        })

        this.loadHouseCards(text)
      })
      .catch(() => {
        this.setData({
          sending: false,
        })
      })
  },
})
