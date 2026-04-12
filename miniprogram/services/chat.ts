import { API_ENDPOINTS } from '../api/endpoints'
import request from '../utils/request'

export interface ChatMessageItem {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
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

function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

export function sendChatMessage(
  message: string
): Promise<ChatMessageItem | undefined> {
  return request<RawChatResponse>({
    url: API_ENDPOINTS.chat.send,
    data: { message },
  }).then((data) => {
    const assistantText = data.ai?.text || ''

    return assistantText
      ? {
          id: generateMessageId(),
          role: 'assistant',
          content: assistantText,
          timestamp: Date.now(),
        }
      : undefined
  })
}
