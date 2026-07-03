import { useEffect, useRef, useState } from 'react'
import { AxiosInstance } from './utils/axiosInstance'

const personas = {
  hitesh: {
    name: 'Hitesh Choudhary',
    shortName: 'Hitesh',
    initials: 'HC',
    color: 'violet',
    description: 'Learn with clarity, chai, and practical wisdom.',
    greeting: 'Namaste! Hitesh here. What are we building today?',
  },
  piyush: {
    name: 'Piyush Garg',
    shortName: 'Piyush',
    initials: 'PG',
    color: 'cyan',
    description: 'Explore engineering with a practical point of view.',
    greeting: "Hey! Piyush here. Let's break down your idea together.",
  },
  both: {
    name: 'Hitesh & Piyush',
    shortName: 'Both',
    initials: 'H+',
    color: 'mixed',
    description: 'Get two perspectives in one thoughtful conversation.',
    greeting: "We're both here. Bring us a question or an idea to explore.",
  },
}

const avatarColors = {
  violet: 'bg-linear-to-br from-[#8064dd] to-[#3c2e79]',
  cyan: 'bg-linear-to-br from-[#35adbb] to-[#195265]',
  mixed: 'bg-linear-to-br from-[#8a6ded] to-[#247c89]',
}

const avatarSizes = {
  small: 'size-[33px] text-[10px]',
  medium: 'size-10 text-xs',
  large: 'size-16 text-[17px]',
}

function Icon({ name, size = 20 }) {
  const paths = {
    chevron: <path d="m7 10 5 5 5-5" />,
    sparkle: (
      <>
        <path d="m12 3-1.1 3.1a7.5 7.5 0 0 1-4.8 4.8L3 12l3.1 1.1a7.5 7.5 0 0 1 4.8 4.8L12 21l1.1-3.1a7.5 7.5 0 0 1 4.8-4.8L21 12l-3.1-1.1a7.5 7.5 0 0 1-4.8-4.8L12 3Z" />
        <path d="M5 3v4M3 5h4" />
      </>
    ),
    arrow: (
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    reset: (
      <>
        <path d="M20 11a8.1 8.1 0 1 0-2.4 5.8" />
        <path d="M20 4v7h-7" />
      </>
    ),
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Avatar({ persona, size = 'medium', className = '' }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-white/12 font-bold tracking-[-0.04em] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_6px_18px_rgba(0,0,0,0.25)] ${avatarColors[persona.color]} ${avatarSizes[size]} ${className}`}
    >
      <span className="[text-shadow:0_1px_4px_rgba(0,0,0,0.28)]">{persona.initials}</span>
    </span>
  )
}

function App() {
  const [selected, setSelected] = useState('hitesh')
  const [menuOpen, setMenuOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)
  const currentPersona = personas[selected]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading])

  const resizeTextarea = (target) => {
    target.style.height = '0'
    target.style.height = `${Math.min(target.scrollHeight, 160)}px`
  }

  const sendMessage = async () => {
    const question = message.trim()
    if (!question || isLoading || selected !== 'hitesh') return

    setMessages((items) => [
      ...items,
      { id: crypto.randomUUID(), role: 'user', content: question },
    ])
    setMessage('')
    setIsLoading(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const response = await AxiosInstance.post('/chat/hitesh', { question })
      const responseData = response?.data?.data
      const reply =
        typeof responseData === 'string'
          ? responseData
          : responseData?.answer || responseData?.message || 'No response received.'

      setMessages((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
          persona: 'hitesh',
        },
      ])
    } catch (error) {
      console.error('Hitesh chat request failed:', error)
      setMessages((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'I could not respond right now. Please try again.',
          persona: 'hitesh',
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className="relative isolate grid h-svh grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-[#0b0c0f] text-[#e9e9ed]">
      <div className="pointer-events-none fixed -top-72 left-[12%] -z-10 size-[34rem] rounded-full bg-[#9b7bff] opacity-[0.09] blur-[130px]" />
      <div className="pointer-events-none fixed -right-68 -bottom-68 -z-10 size-[34rem] rounded-full bg-[#28d8d8] opacity-[0.09] blur-[130px]" />

      <header className="relative z-20 grid h-[76px] grid-cols-[1fr_auto_1fr] items-center border-b border-[#292a31] bg-[rgba(9,10,13,0.7)] px-8 backdrop-blur-[22px] max-[700px]:h-[68px] max-[700px]:grid-cols-[auto_1fr_auto] max-[700px]:gap-2.5 max-[700px]:px-4">
        <a
          className="flex w-max items-center gap-2.5 font-semibold tracking-[-0.02em] text-[#f1f1f3] no-underline"
          href="#"
          aria-label="Persona home"
        >
          <span className="grid size-[34px] place-items-center rounded-[10px] bg-linear-to-br from-[#bba8ff] to-[#72e4dc] text-[#0a0a0d] shadow-[0_0_24px_rgba(139,116,255,0.22)]">
            <Icon name="sparkle" size={19} />
          </span>
          <span className="max-[700px]:hidden">Persona</span>
          <span className="rounded-[5px] border border-[#383a43] px-1.5 py-0.5 text-[9px] leading-3.5 tracking-[0.1em] text-[#92949d] max-[700px]:hidden">
            AI
          </span>
        </a>

        <div className="relative max-[700px]:min-w-0 max-[700px]:justify-self-center">
          <button
            className={`grid min-w-[248px] grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-[14px] border bg-[rgba(24,25,31,0.88)] px-2.5 py-2 text-left text-[#f1f1f3] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-colors hover:border-[#4a4d58] hover:bg-[#1b1c22] max-[700px]:w-[min(230px,100%)] max-[700px]:min-w-0 ${menuOpen ? 'border-[#4a4d58] bg-[#1b1c22]' : 'border-[#353640]'}`}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="listbox"
          >
            <Avatar persona={currentPersona} size="small" />
            <span className="flex min-w-0 flex-col leading-tight">
              <small className="text-[9px] font-semibold tracking-[0.09em] text-[#666873] uppercase max-[700px]:hidden">
                Chatting with
              </small>
              <strong className="overflow-hidden text-[13px] font-medium text-ellipsis whitespace-nowrap">
                {currentPersona.name}
              </strong>
            </span>
            <span className={`h-5 text-[#92949d] transition-transform ${menuOpen ? 'rotate-180' : ''}`}>
              <Icon name="chevron" size={18} />
            </span>
          </button>

          {menuOpen && (
            <>
              <button
                className="fixed inset-0 z-1 cursor-default border-0 bg-transparent"
                aria-label="Close persona menu"
                onClick={() => setMenuOpen(false)}
              />
              <div
                className="absolute top-[calc(100%+10px)] left-1/2 z-2 w-[300px] -translate-x-1/2 animate-[menu-in_160ms_ease_both] rounded-2xl border border-[#353640] bg-[rgba(22,23,29,0.98)] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] max-[700px]:w-[min(300px,calc(100vw-32px))]"
                role="listbox"
                aria-label="Choose who to chat with"
              >
                <p className="mx-2 mt-[3px] mb-[7px] text-[10px] font-semibold tracking-[0.08em] text-[#666873] uppercase">
                  Choose your mentor
                </p>
                {Object.entries(personas).map(([key, persona]) => (
                  <button
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-[11px] border-0 bg-transparent p-[9px] text-left text-[#f1f1f3] hover:bg-[#202127]"
                    type="button"
                    role="option"
                    aria-selected={selected === key}
                    key={key}
                    onClick={() => {
                      setSelected(key)
                      setMenuOpen(false)
                    }}
                  >
                    <Avatar persona={persona} size="small" />
                    <span className="flex flex-col">
                      <strong className="text-[13px] font-medium">{persona.name}</strong>
                      <small className="text-[11px] text-[#666873]">
                        {key === 'both' ? 'Talk to both' : `Talk to ${persona.shortName}`}
                      </small>
                    </span>
                    <i
                      className={`size-[7px] rounded-full border-2 ${selected === key ? 'border-[#a996ff] shadow-[0_0_0_3px_rgba(169,150,255,0.12)]' : 'border-transparent'}`}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <section className={`flex min-h-0 overflow-y-auto px-6 pt-6 pb-2.5 max-[700px]:px-[18px] ${messages.length ? 'justify-stretch' : 'justify-center'}`}>
        {messages.length === 0 ? (
          <div className="m-auto w-full max-w-[680px] animate-[welcome-in_500ms_ease_both] pb-[22px] text-center max-[700px]:pb-2">
            <div className="relative mb-[22px] flex h-[74px] items-center justify-center max-[700px]:mb-[18px]">
              {selected === 'both' ? (
                <>
                  <Avatar persona={personas.hitesh} size="large" className="border-[3px] border-[#0b0c0f]" />
                  <Avatar persona={personas.piyush} size="large" className="-ml-3.5 border-[3px] border-[#0b0c0f]" />
                </>
              ) : (
                <Avatar persona={currentPersona} size="large" className="border-[3px] border-[#0b0c0f]" />
              )}
              <span className="absolute bottom-[-2px] left-[calc(50%+35px)] grid size-7 place-items-center rounded-full border-[3px] border-[#0b0c0f] bg-[#c9baff] text-[#17131f]">
                <Icon name="sparkle" size={17} />
              </span>
            </div>
            <p className="mb-3 text-[10px] font-bold tracking-[0.18em] text-[#9d8ce0] uppercase">
              Your personal tech mentors
            </p>
            <h1 className="mx-auto max-w-[600px] text-[clamp(36px,5vw,56px)] leading-[1.02] font-medium tracking-[-0.055em] text-[#f1f1f3] max-[700px]:text-[39px]">
              Think better. Build{' '}
              <span className="bg-linear-to-r from-[#a48ef4] to-[#6dd7d0] bg-clip-text text-transparent">
                smarter.
              </span>
            </h1>
            <p className="mx-auto mt-[18px] max-w-[450px] text-sm leading-[1.7] text-[#92949d] max-[700px]:mt-3.5 max-[700px]:text-[13px]">
              {currentPersona.description}
            </p>
            <div className="mt-[30px] flex flex-wrap justify-center gap-2 max-[700px]:mt-[23px]">
              {[
                'Help me understand system design',
                'Review my learning roadmap',
                'How should I approach a new project?',
              ].map((prompt, index) => (
                <button
                  className={`rounded-full border border-[#292a31] bg-[rgba(20,21,26,0.68)] px-[13px] py-[9px] text-[11px] text-[#a6a8b0] transition hover:-translate-y-px hover:border-[#454752] hover:text-[#f1f1f3] ${index === 2 ? 'max-[700px]:hidden' : ''}`}
                  key={prompt}
                  onClick={() => setMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-auto mb-0 w-full max-w-[760px] py-[30px]" aria-live="polite">
            {messages.map((item) => {
              const persona = item.persona ? personas[item.persona] : null
              const isUser = item.role === 'user'
              return (
                <article
                  className={`mb-7 flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}
                  key={item.id}
                >
                  {!isUser && <Avatar persona={persona} size="small" />}
                  <div className={`min-w-0 ${isUser ? 'max-w-[78%] rounded-[17px_17px_4px_17px] border border-[#30313a] bg-[#202127] px-[15px] py-[11px]' : ''}`}>
                    {!isUser && (
                      <span className="mb-[5px] block text-[11px] font-semibold text-[#92949d]">
                        {persona.name}
                      </span>
                    )}
                    <p className={`m-0 text-sm leading-[1.65] ${item.isError ? 'text-[#d99595]' : 'text-[#d9dae0]'}`}>
                      {item.content}
                    </p>
                  </div>
                </article>
              )
            })}
            {isLoading && (
              <article className="mb-7 flex animate-[welcome-in_250ms_ease_both] items-start gap-3">
                <Avatar persona={personas.hitesh} size="small" />
                <div className="min-w-0">
                  <span className="mb-[7px] block text-[11px] font-semibold text-[#92949d]">
                    Hitesh Choudhary
                  </span>
                  <div
                    className="flex w-fit items-center gap-1.5 rounded-[4px_16px_16px_16px] border border-[#292a31] bg-[#18191e] px-3.5 py-3"
                    aria-label="Hitesh is typing"
                  >
                    {[0, 1, 2].map((dot) => (
                      <span
                        className="size-1.5 animate-bounce rounded-full bg-[#9f8bea]"
                        style={{ animationDelay: `${dot * 130}ms` }}
                        key={dot}
                      />
                    ))}
                  </div>
                </div>
              </article>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </section>

      <footer className="relative z-10 mx-auto w-[min(780px,calc(100%-40px))] px-0 pt-2.5 pb-4 before:pointer-events-none before:absolute before:inset-[-50px_-100px_0] before:-z-1 before:bg-linear-to-b before:from-transparent before:to-[#0b0c0f] before:from-0% before:to-55% max-[700px]:w-[calc(100%-24px)] max-[700px]:pb-[max(10px,env(safe-area-inset-bottom))]">
        <div className="flex min-h-[58px] items-end gap-2 rounded-[20px] border border-[#343640] bg-[rgba(25,26,32,0.92)] py-[7px] pr-2 pl-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-[18px] transition focus-within:border-[#555160] focus-within:shadow-[0_18px_55px_rgba(0,0,0,0.35),0_0_0_3px_rgba(156,137,226,0.06)]">
          <button
            className="grid size-[42px] shrink-0 place-items-center rounded-[13px] border-0 bg-transparent text-[#7c7e88] hover:bg-[#23242b] hover:text-[#c7c8ce]"
            type="button"
            aria-label="Add attachment"
          >
            <Icon name="plus" size={20} />
          </button>
          <textarea
            ref={textareaRef}
            className="min-h-[43px] max-h-40 flex-1 resize-none border-0 bg-transparent px-[3px] py-2.5 text-sm leading-[23px] text-[#f1f1f3] outline-0 placeholder:text-[#6f717c]"
            rows="1"
            value={message}
            aria-label="Message"
            placeholder={`Message ${currentPersona.shortName}...`}
            onChange={(event) => {
              setMessage(event.target.value)
              resizeTextarea(event.target)
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            className="grid size-[42px] shrink-0 place-items-center rounded-[13px] border-0 bg-linear-to-br from-[#b9a6ff] to-[#8c79d9] text-[#131118] shadow-[0_5px_18px_rgba(154,133,225,0.22)] transition hover:not-disabled:-translate-y-px disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#2c2d34] disabled:text-[#656771] disabled:shadow-none"
            type="button"
            aria-label={isLoading ? 'Waiting for response' : 'Send message'}
            disabled={!message.trim() || isLoading || selected !== 'hitesh'}
            onClick={sendMessage}
          >
            {isLoading ? (
              <span className="size-[18px] animate-spin rounded-full border-2 border-[#656771] border-t-[#b9a6ff]" />
            ) : (
              <Icon name="arrow" size={19} />
            )}
          </button>
        </div>
        <p className="mt-[9px] text-center text-[9px] tracking-[0.02em] text-[#555761] max-[700px]:hidden">
          AI can make mistakes. Consider checking important information.
        </p>
      </footer>
    </main>
  )
}

export default App
