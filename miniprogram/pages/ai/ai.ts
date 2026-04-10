interface PromptItem {
  title: string
  desc: string
}

interface ChatItem {
  role: 'assistant' | 'user'
  content: string
}

interface AiResult {
  title: string
  summary: string
  tags: string[]
}

Page({
  data: {
    promptItems: [
      { title: '首次买房', desc: '先控预算和通勤' },
      { title: '婚房', desc: '优先氛围与配套' },
      { title: '学区房', desc: '兼顾教育与居住' },
      { title: '投资', desc: '看板块和流动性' },
      { title: '租房', desc: '缩短找房时间' },
      { title: '预算不确定', desc: '先帮你倒推范围' },
    ] as PromptItem[],
    messages: [
      {
        role: 'assistant',
        content: '可以直接告诉我预算、区域、通勤时间和家庭成员情况，我会先帮你缩小选择范围。',
      },
      {
        role: 'user',
        content: '预算 600 万左右，希望离地铁近，适合一家三口。',
      },
      {
        role: 'assistant',
        content: '我会优先推荐闵行、宝山和浦东部分板块的三居，并尽量控制通勤与学区配套的平衡。',
      },
    ] as ChatItem[],
    aiResults: [
      {
        title: '推荐区域：七宝 / 春申 / 大场',
        summary: '这些区域更容易在预算内找到三居，生活配套成熟，通勤压力相对可控。',
        tags: ['预算友好', '家庭居住', '地铁覆盖'],
      },
      {
        title: '下一步建议：锁定三类房源',
        summary: '优先看次新改善盘、成熟社区大两居和学区周边三居，先跑通三套样板房源。',
        tags: ['先看样板', '减少试错'],
      },
    ] as AiResult[],
    followUps: ['帮我筛选近地铁', '只看 500 万以内', '更适合家庭居住的', '转人工顾问'],
  },
})
