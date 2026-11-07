import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  Bot,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react'
import './PortfolioChat.css'

const WEBHOOK_URL =
  import.meta.env.VITE_PORTFOLIO_CHAT_WEBHOOK_URL?.trim() ?? ''
const CALLBACK_URL =
  import.meta.env.VITE_PORTFOLIO_CHAT_CALLBACK_URL?.trim() ?? ''

const SESSION_STORAGE_KEY = 'bassem-portfolio-chat-session-v1'
const MESSAGES_STORAGE_KEY = 'bassem-portfolio-chat-messages-v1'

const SUGGESTIONS = [
  'ما الخدمات التي تقدمها؟',
  'اعرض لي مشاريعك',
  'كيف يمكن أتمتة أعمالي؟',
]

type ChatRole = 'assistant' | 'user'

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-message',
  role: 'assistant',
  content:
    'أهلًا بك! أنا **مساعد باسم الذكي**. 👋\nأساعدك في التعرف على خدمات باسم ومشاريعه، وفهم كيف يمكن للذكاء الاصطناعي والأتمتة توفير وقتك وتطوير أعمالك.\n\nما الذي تود معرفته؟',
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function createSessionId() {
  return `session_${Date.now()}_${createId().replace(/-/g, '').slice(0, 12)}`
}

function getInitialSessionId() {
  if (typeof window === 'undefined') return createSessionId()

  try {
    const savedSessionId = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (savedSessionId) return savedSessionId

    const newSessionId = createSessionId()
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId)
    return newSessionId
  } catch {
    return createSessionId()
  }
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false

  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    (item.role === 'assistant' || item.role === 'user') &&
    typeof item.content === 'string'
  )
}

function getInitialMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [WELCOME_MESSAGE]

  try {
    const savedMessages = window.sessionStorage.getItem(MESSAGES_STORAGE_KEY)
    if (!savedMessages) return [WELCOME_MESSAGE]

    const parsed: unknown = JSON.parse(savedMessages)
    if (Array.isArray(parsed) && parsed.every(isChatMessage) && parsed.length > 0) {
      return parsed
    }
  } catch {
    // Start a clean conversation if the saved session data is unavailable.
  }

  return [WELCOME_MESSAGE]
}

function extractAssistantReply(payload: unknown): string | null {
  if (typeof payload === 'string') {
    const trimmed = payload.trim()
    return trimmed || null
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const reply = extractAssistantReply(item)
      if (reply) return reply
    }
    return null
  }

  if (!payload || typeof payload !== 'object') return null

  const data = payload as Record<string, unknown>
  const receivedData = data.received_data
  if (receivedData && typeof receivedData === 'object') {
    const nestedMessage = (receivedData as Record<string, unknown>).message
    if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
      return nestedMessage.trim()
    }
  }

  // Other possible response shapes, in order of preference.
  for (const key of ['reply', 'output', 'text', 'response']) {
    const value = data[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }

  // Some n8n setups wrap the result in a data or body property.
  for (const key of ['data', 'body', 'result']) {
    if (data[key] && typeof data[key] === 'object') {
      const nestedReply = extractAssistantReply(data[key])
      if (nestedReply) return nestedReply
    }
  }

  // Use a direct message only when no nested assistant message was returned.
  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim()
  }

  return null
}

function renderInlineMarkdown(line: string): ReactNode[] {
  return line.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${index}-${part}`}>{part.slice(2, -2)}</strong>
    }

    return <span key={`${index}-${part}`}>{part}</span>
  })
}

function renderMessageContent(content: string) {
  const lines = content.split(/\r?\n/)
  const output: ReactNode[] = []
  let bulletItems: string[] = []

  const flushBullets = () => {
    if (bulletItems.length === 0) return

    output.push(
      <ul key={`list-${output.length}`}>
        {bulletItems.map((item, index) => (
          <li key={`${index}-${item}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>,
    )
    bulletItems = []
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    if (!trimmed) {
      flushBullets()
      return
    }

    if (/^[-*]\s+/.test(trimmed)) {
      bulletItems.push(trimmed.replace(/^[-*]\s+/, ''))
      return
    }

    flushBullets()
    output.push(<p key={`paragraph-${index}`}>{renderInlineMarkdown(trimmed)}</p>)
  })

  flushBullets()
  return output
}

type PortfolioChatProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function PortfolioChat({ isOpen, onOpenChange }: PortfolioChatProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(getInitialSessionId)
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages)

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sendingRef = useRef(false)
  const activeAbortControllerRef = useRef<AbortController | null>(null)

  
  // حفظ المحادثة والجلسة
  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId)
      window.sessionStorage.setItem(
        MESSAGES_STORAGE_KEY,
        JSON.stringify(messages),
      )
    } catch {
      // Chat remains usable when storage is unavailable.
    }
  }, [messages, sessionId])

  // التمرير إلى آخر رسالة
  useEffect(() => {
    if (!isOpen) return

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [isOpen, isLoading, messages])

  // التركيز على حقل الكتابة بعد فتح الشات أو انتهاء التحميل
  useEffect(() => {
    if (!isOpen || isLoading) return

    inputRef.current?.focus()
  }, [isOpen, isLoading])

  // إلغاء الطلب النشط عند إزالة المكون
  useEffect(() => {
    return () => {
      activeAbortControllerRef.current?.abort()
      activeAbortControllerRef.current = null
    }
  }, [])

useEffect(() => {
  if (!isOpen) return

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onOpenChange(false)
    }
  }

  window.addEventListener('keydown', handleEscape)

  return () => {
    window.removeEventListener('keydown', handleEscape)
  }
}, [isOpen, onOpenChange])


  async function sendMessage(rawMessage: string) {
    const messageText = rawMessage.trim()
    if (!messageText || sendingRef.current) return

    if (!WEBHOOK_URL || !CALLBACK_URL) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: 'assistant',
          content: 'المساعد غير متاح حاليًا بسبب عدم اكتمال إعدادات الاتصال. يرجى المحاولة لاحقًا.',
        },
      ])
      return
    }

    sendingRef.current = true
    setIsLoading(true)
    setInput('')

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: messageText,
    }
    setMessages((current) => [...current, userMessage])

    const controller = new AbortController()
    activeAbortControllerRef.current = controller
    const timeoutId = window.setTimeout(() => controller.abort(), 60000)

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: messageText,
          sessionId,
          callbackUrl: CALLBACK_URL,
        }),
        signal: controller.signal,
      })

      const responseText = await response.text()
      let responsePayload: unknown = responseText

      if (responseText) {
        try {
          responsePayload = JSON.parse(responseText) as unknown
        } catch {
          responsePayload = responseText
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const assistantReply = extractAssistantReply(responsePayload)
      if (!assistantReply) {
        throw new Error('The webhook response did not contain an assistant reply.')
      }

      setMessages((current) => [
        ...current,
        { id: createId(), role: 'assistant', content: assistantReply },
      ])
    } catch (error) {
      // Skip state updates when the request was aborted by component unmount.
      if (activeAbortControllerRef.current === controller) {
        const errorMessage =
          error instanceof Error && error.name === 'AbortError'
            ? 'استغرق الرد وقتًا أطول من المتوقع. جرّب إرسال رسالتك مرة أخرى.'
            : 'تعذر الاتصال بالمساعد حاليًا. تأكد من اتصال الإنترنت وحاول مرة أخرى.'

        setMessages((current) => [
          ...current,
          { id: createId(), role: 'assistant', content: errorMessage },
        ])
      }
    } finally {
      window.clearTimeout(timeoutId)
      if (activeAbortControllerRef.current === controller) {
        activeAbortControllerRef.current = null
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage(input)
  }

  function startNewConversation() {
    if (sendingRef.current) return

    const nextSessionId = createSessionId()
    setSessionId(nextSessionId)
    setMessages([WELCOME_MESSAGE])
    setInput('')

    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, nextSessionId)
      window.sessionStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([WELCOME_MESSAGE]))
    } catch {
      // Ignore storage errors; the in-memory conversation is reset.
    }
  }

  return (
    <div className="portfolio-chat-dock" dir="rtl">
      {isOpen && (
        <section
          className="portfolio-chat-panel"
          id="portfolio-chat-panel"
          aria-label="محادثة مع مساعد باسم الذكي"
        >
          <header className="portfolio-chat-header">
            <div className="portfolio-chat-avatar" aria-hidden="true">
              <Bot size={21} />
              <span />
            </div>

            <div className="portfolio-chat-heading">
              <strong>مساعد باسم الذكي</strong>
              <span>
                <i /> مساعد المبيعات والخدمات
              </span>
            </div>

            <button
              className="portfolio-chat-icon-button"
              type="button"
              onClick={startNewConversation}
              disabled={isLoading}
              aria-label="بدء محادثة جديدة"
              title="محادثة جديدة"
            >
              <RefreshCw size={16} />
            </button>
          </header>

          <div className="portfolio-chat-messages" role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((message) => (
              <div
                className={`portfolio-chat-message portfolio-chat-message-${message.role}`}
                key={message.id}
              >
                {message.role === 'assistant' && (
                  <span className="portfolio-chat-message-avatar" aria-hidden="true">
                    <Sparkles size={13} />
                  </span>
                )}
                <div className="portfolio-chat-bubble">
                  {renderMessageContent(message.content)}
                </div>
              </div>
            ))}

            {messages.length === 1 && !isLoading && (
              <div className="portfolio-chat-suggestions" aria-label="أسئلة مقترحة">
                <span>ابدأ بسؤال سريع</span>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="portfolio-chat-message portfolio-chat-message-assistant">
                <span className="portfolio-chat-message-avatar" aria-hidden="true">
                  <Sparkles size={13} />
                </span>
                <div className="portfolio-chat-typing" aria-label="المساعد يكتب">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="portfolio-chat-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="اكتب سؤالك هنا..."
              aria-label="اكتب رسالتك للمساعد"
              autoComplete="off"
              maxLength={1500}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="إرسال الرسالة"
              title="إرسال"
            >
              <Send size={17} />
            </button>
          </form>

          <div className="portfolio-chat-footnote">
            <span>مدعوم بالذكاء الاصطناعي</span>
            <span className="portfolio-chat-footnote-dot">•</span>
            <span>باسم محمد</span>
          </div>
        </section>
      )}

      <button
        className="portfolio-chat-launcher"
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="portfolio-chat-panel"
        aria-label="فتح أو إغلاق محادثة مساعد باسم الذكي"
      >
        <MessageCircle size={22} />
        <span>لنتحدث</span>
      </button>
    </div>
  )
}
