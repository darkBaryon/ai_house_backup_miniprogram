interface ScenarioItem {
  title: string
  subtitle: string
  prompt: string
}

interface HighlightItem {
  title: string
  copy: string
}

interface GuideStep {
  title: string
  copy: string
}

interface SampleMessage {
  role: 'user' | 'assistant'
  content: string
}

interface FutureCard {
  title: string
  copy: string
  tags: string[]
}

Page({
  data: {
    city: '上海',
    quickFilters: ['近地铁', '押一付一', '整租两居', '可养宠物'],
    scenarios: [
      {
        title: '通勤优先',
        subtitle: '先说上班地点和时长',
        prompt: '我想租房，优先考虑通勤方便，最好近地铁。',
      },
      {
        title: '预算优先',
        subtitle: '先控制月租压力',
        prompt: '我预算有限，请先帮我筛选月租更友好的房源。',
      },
      {
        title: '整租优先',
        subtitle: '适合情侣或两人合住',
        prompt: '我想找整租两居，最好拎包入住。',
      },
      {
        title: '标签优先',
        subtitle: '让 AI 帮你筛标签',
        prompt: '请优先推荐可养宠物、押一付一的房源。',
      },
    ] as ScenarioItem[],
    highlights: [
      {
        title: '不需要先会筛选',
        copy: '直接说需求，AI 会代替你理解预算、区域、通勤和标签偏好。',
      },
      {
        title: '后端会自动检索房源',
        copy: '用户聊天时，AI 会触发后端检索，把更匹配的待租房源整理给你。',
      },
      {
        title: '继续追问就能缩小范围',
        copy: '你可以接着问“只看近地铁”“月租再低一点”“优先押一付一”。',
      },
    ] as HighlightItem[],
    guideSteps: [
      {
        title: '告诉 AI 需求',
        copy: '月租预算、区域、通勤时间、租房标签，说出一部分就可以开始。',
      },
      {
        title: 'AI 自动检索房源',
        copy: '后端会在聊天过程中解析意图、检索房源，并生成更自然的推荐回复。',
      },
      {
        title: '继续追问与细化',
        copy: '通过继续聊天逐步缩小选择，不需要自己来回切筛选器。',
      },
    ] as GuideStep[],
    sampleMessages: [
      {
        role: 'user',
        content: '月租 3500 左右，想住近地铁，可养宠物。',
      },
      {
        role: 'assistant',
        content: '我会优先从待租房源里筛选近地铁、可养宠物、预算友好的选项，并继续帮你缩小范围。',
      },
    ] as SampleMessage[],
    futureCards: [
      {
        title: '下一步会接房源卡片',
        copy: '等后端补充 AI 命中房源的结构化返回后，这里会直接展示可点开的推荐房源卡。',
        tags: ['AI推荐', '房源联动'],
      },
      {
        title: '我的房源仍然保留',
        copy: '当前后端已支持房东管理自己的房源，所以“找房”页暂时承担我的房源管理入口。',
        tags: ['当前可用', '管理入口'],
      },
    ] as FutureCard[],
  },

  goToDiscover() {
    wx.switchTab({ url: '/pages/discover/discover' })
  },

  goToAi() {
    wx.switchTab({ url: '/pages/ai/ai' })
  },

  sendScenario(event: WechatMiniprogram.BaseEvent) {
    const prompt = event.currentTarget.dataset.prompt as string

    if (!prompt) {
      this.goToAi()
      return
    }

    wx.switchTab({ url: '/pages/ai/ai' })
    wx.setStorageSync('ai_prefill_message', prompt)
  },
})
