// index.ts
const CHAT_API_URL = 'http://127.0.0.1:5000/chat'

/** 单条消息：唯一 id + 内容 + 是否用户发送 */
interface ChatMessage {
  id: string
  content: string
  isUser: boolean
}

/** 生成唯一 ID：Date.now() + '-' + Math.random()，保证 wx:key 不重复 */
function generateMessageId(): string {
  return Date.now() + '-' + Math.random()
}

/** 获取或生成并持久化当前用户 ID */
function getOrGenerateUserId(): string {
  let userId = wx.getStorageSync('chat_user_id')
  if (!userId) {
    userId = 'user_' + Date.now() + Math.random().toString().substring(2, 8)
    wx.setStorageSync('chat_user_id', userId)
  }
  return userId
}

Page({
  data: {
    messages: [] as ChatMessage[],
    inputValue: '',
    scrollIntoView: '',
    currentUserId: '',
  },

  onLoad() {
    console.log('[CustomerApp] onLoad triggered')
    const uid = getOrGenerateUserId()
    this.setData({ currentUserId: uid })
  },

  onShow() {
    console.log('[CustomerApp] onShow triggered')
  },

  onInput(e: WechatMiniprogram.Input) {
    console.log('[CustomerApp] onInput triggered')
    const value = (e.detail && e.detail.value) || ''
    this.setData({ inputValue: value })
  },

  sendMessage() {
    console.log('[CustomerApp] sendMessage triggered')
    const { inputValue, messages, currentUserId } = this.data
    const trimmed = (inputValue || '').trim()
    if (!trimmed) {
      console.log('[CustomerApp] sendMessage skipped: empty input')
      return
    }

    const userMsg: ChatMessage = {
      id: generateMessageId(),
      content: trimmed,
      isUser: true,
    }
    const messagesWithUser = [...messages, userMsg]
    this.setData({
      messages: messagesWithUser,
      inputValue: '',
    })
    console.log('[CustomerApp] request sending, url:', CHAT_API_URL, 'message:', trimmed)

    wx.showLoading({ title: 'AI 思考中...', mask: true })

    wx.request({
      url: CHAT_API_URL,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        user_id: currentUserId,
        message: trimmed,
      },
      success: (res) => {
        console.log('[CustomerApp] res.data:', res.data)
        wx.hideLoading()
        const status = res.statusCode ?? 0
        if (status < 200 || status >= 300) {
          wx.showToast({ title: '服务器连接失败', icon: 'none' })
          return
        }
        const data = res.data as { ai?: { text?: string } } | null
        const replyText =
          data?.ai && typeof data.ai.text === 'string' ? data.ai.text : ''
        const aiMsg: ChatMessage = {
          id: generateMessageId(),
          content: replyText || '（无回复内容）',
          isUser: false,
        }
        const nextMessages = [...messagesWithUser, aiMsg]
        const toView = 'msg-' + aiMsg.id
        this.setData({
          messages: nextMessages,
          scrollIntoView: toView,
        })
        console.log('[CustomerApp] AI reply added, scrollIntoView:', toView)
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '服务器连接失败', icon: 'none' })
      },
    })
  },
})
