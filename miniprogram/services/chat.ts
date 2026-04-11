import request from '../utils/request'

const CHAT_API = {
  send: '/chat/send',
}

export interface ChatMessageItem {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface SessionRequirement {
  area?: string
  budget?: string | number
  type?: string
  [key: string]: unknown
}

export interface ChatSessionMeta {
  sessionId: string
  stateText: string
  requirementTextList: string[]
}

interface RawChatResponse {
  user?: {
    text?: string
    timestamp?: string
  }
  ai?: {
    text?: string
    timestamp?: string
  }
}

export interface SendChatResult {
  session: ChatSessionMeta
  assistantMessage?: ChatMessageItem
}

function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

export function sendChatMessage(
  message: string
): Promise<SendChatResult> {
  return request<RawChatResponse>({
    url: CHAT_API.send,
    data: { message },
  }).then((data) => {
    const assistantText = data.ai?.text || ''

    return {
      session: {
        sessionId: '后端当前未返回 session_id',
        stateText: '后端当前未返回会话状态',
        requirementTextList: [],
      },
      assistantMessage: assistantText
        ? {
            id: generateMessageId(),
            role: 'assistant',
            content: assistantText,
            timestamp: Date.now(),
          }
        : undefined,
    }
  })
}
