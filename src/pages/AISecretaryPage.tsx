import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Send, Trash2, Bot, Sparkles, Copy, CheckCircle, RefreshCw,
  Cpu, Globe, Rocket, Code2, BookOpen, Zap, ChevronDown, Settings,
  Maximize2, Minimize2, MessageSquare
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { supabase } from '@/lib/supabase'
import { generateId } from '@/lib/utils'
import type { AIMessage } from '@/types'

const AI_MODELS = [
  { id: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash', badge: 'FAST', color: '#06b6d4' },
  { id: 'google/gemini-3-pro-preview', label: 'Gemini 3 Pro', badge: 'SMART', color: '#8b5cf6' },
  { id: 'openai/gpt-5-mini', label: 'GPT-5 Mini', badge: 'FAST', color: '#10b981' },
  { id: 'openai/gpt-5.1', label: 'GPT-5.1', badge: 'BEST', color: '#f59e0b' },
]

const QUICK_PROMPTS = [
  { label: '🚀 Deploy to GitHub', prompt: 'How do I deploy my project to GitHub Pages step by step?' },
  { label: '📦 Import ZIP', prompt: 'How do I import a ZIP project file into E-SMART-WORLD?' },
  { label: '🔑 GitHub Token', prompt: 'How do I get a GitHub Personal Access Token with repo scope?' },
  { label: '📱 Expo Setup', prompt: 'How do I set up Expo Go and publish my React Native app?' },
  { label: '🏪 Play Store', prompt: 'Guide me through uploading my app to the Google Play Store' },
  { label: '💡 Create Template', prompt: 'How do I create and save my own template in the template gallery?' },
  { label: '🔐 Vault Setup', prompt: 'How do I use the Secure Vault to save my GitHub token?' },
  { label: '✨ Variations', prompt: 'How does the Variations & Multiplication Engine work?' },
]

const SAMPLE_CODE_PROMPTS = [
  'Create a complete HTML landing page for a coffee shop with menu and booking form',
  'Write a React todo app with localStorage persistence and dark/light mode toggle',
  'Build a React Native login screen with gradient background and animated inputs',
  'Generate a responsive portfolio website with CSS animations and project cards',
]

function MessageBubble({ msg, onCopy }: { msg: AIMessage; onCopy: (text: string) => void }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'

  const handleCopy = () => {
    onCopy(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n')
        const lang = lines[0].replace('```', '') || 'code'
        const code = lines.slice(1, -1).join('\n')
        return (
          <div key={i} className="my-2 rounded-xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
              <span className="font-mono text-[9px] text-blue-400 uppercase">{lang}</span>
              <button onClick={() => { navigator.clipboard.writeText(code); }} className="text-[8px] text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-all">
                <Copy size={9} /> COPY
              </button>
            </div>
            <pre className="p-3 font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">{code}</pre>
          </div>
        )
      }
      if (part.startsWith('`') && !part.startsWith('```')) {
        return <code key={i} className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>{part.slice(1,-1)}</code>
      }
      return (
        <span key={i} className="leading-relaxed">
          {part.split('\n').map((line, j) => {
            const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            return (
              <React.Fragment key={j}>
                {j > 0 && <br />}
                <span dangerouslySetInnerHTML={{ __html: boldLine }} />
              </React.Fragment>
            )
          })}
        </span>
      )
    })
  }

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} group animate-fade-in`}>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
            : 'linear-gradient(135deg, #ff9a9e, #fecfef, #ffd200)',
          boxShadow: isUser ? '0 2px 8px rgba(59,130,246,0.3)' : '0 2px 8px rgba(255,150,100,0.3)',
        }}
      >
        {isUser ? <Bot size={12} className="text-white" /> : '🥭'}
      </div>
      <div className={`max-w-[82%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className="text-[11px] px-3.5 py-2.5 rounded-2xl leading-relaxed"
          style={isUser ? {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(59,130,246,0.25)',
            borderBottomRightRadius: '6px',
          } : {
            background: 'rgba(255,255,255,0.95)',
            color: '#334155',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,255,255,0.9)',
            borderBottomLeftRadius: '6px',
          }}
        >
          {formatContent(msg.content)}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <span className="text-[9px] text-slate-400">
            {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button onClick={handleCopy} className="text-[9px] text-slate-400 hover:text-blue-600 flex items-center gap-0.5 transition-all">
            {copied ? <CheckCircle size={9} className="text-emerald-500" /> : <Copy size={9} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export function AISecretaryPage() {
  const { aiMessages, addAiMessage, clearAiMessages } = useApp()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id)
  const [showModelPicker, setShowModelPicker] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'prompts' | 'code'>('chat')
  const [expanded, setExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages, streamingText])

  const activeModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0]

  const sendMessage = useCallback(async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setStreamingText('')

    addAiMessage({ role: 'user', content: msg })
    setLoading(true)

    const conversationMessages = [
      ...aiMessages.slice(-20).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: msg }
    ]

    try {
      abortRef.current = new AbortController()

      // Try streaming first
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-secretary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: conversationMessages,
            model: selectedModel,
            stream: true,
          }),
          signal: abortRef.current.signal,
        }
      )

      if (!response.ok) {
        throw new Error(`AI request failed: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                const delta = parsed.choices?.[0]?.delta?.content || ''
                fullText += delta
                setStreamingText(fullText)
              } catch {}
            }
          }
        }
        setStreamingText('')
        if (fullText) {
          addAiMessage({ role: 'assistant', content: fullText })
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return
      // Fallback: non-streaming
      try {
        const { data, error } = await supabase.functions.invoke('ai-secretary', {
          body: { messages: conversationMessages, model: selectedModel, stream: false }
        })
        if (error) throw error
        const text = data?.text || 'Sorry, I could not get a response. Please try again.'
        setStreamingText('')
        addAiMessage({ role: 'assistant', content: text })
      } catch (fallbackErr: any) {
        console.error('AI fallback error:', fallbackErr)
        addAiMessage({
          role: 'assistant',
          content: '🥭 Connection issue. Please check your network and try again. If the issue persists, the AI service may be temporarily unavailable.'
        })
      }
    } finally {
      setLoading(false)
      setStreamingText('')
    }
  }, [input, loading, aiMessages, selectedModel, addAiMessage])

  const stopGeneration = () => {
    abortRef.current?.abort()
    if (streamingText) {
      addAiMessage({ role: 'assistant', content: streamingText + '\n\n*[Generation stopped]*' })
    }
    setStreamingText('')
    setLoading(false)
  }

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const displayMessages = aiMessages.length === 0 ? [] : aiMessages

  return (
    <div className={`h-full flex flex-col overflow-hidden ${expanded ? 'fixed inset-0 z-40' : ''}`}
      style={expanded ? { background: 'rgba(248,250,252,0.98)', backdropFilter: 'blur(30px)' } : {}}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0 border-b"
        style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(148,163,184,0.15)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-base animate-float"
            style={{ background: 'linear-gradient(135deg, #ff9a9e, #fecfef, #ffd200)', boxShadow: '0 3px 12px rgba(255,150,100,0.4)' }}
          >
            🥭
          </div>
          <div>
            <div className="font-hud text-[11px] font-bold text-purple-700">AI SECRETARY</div>
            <div className="text-[9px] text-slate-400">Powered by {activeModel.label}</div>
          </div>
          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-hud text-[9px] text-emerald-600 font-bold">LIVE AI</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Model picker */}
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-hud text-[9px] font-bold transition-all"
              style={{ borderColor: `${activeModel.color}40`, background: `${activeModel.color}10`, color: activeModel.color }}
            >
              <Cpu size={10} />
              {activeModel.label}
              <ChevronDown size={9} />
            </button>
            {showModelPicker && (
              <div
                className="absolute right-0 top-8 z-50 rounded-2xl overflow-hidden animate-fade-in"
                style={{ background: 'rgba(255,255,255,0.98)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.9)', minWidth: '200px' }}
              >
                {AI_MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setShowModelPicker(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 transition-all"
                  >
                    <div className="text-left">
                      <div className="font-hud text-[10px] font-bold" style={{ color: m.color }}>{m.label}</div>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${m.color}15`, color: m.color }}>{m.badge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all">
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={clearAiMessages} className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Clear chat">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: 'rgba(148,163,184,0.1)', background: 'rgba(255,255,255,0.92)' }}>
        {[
          { id: 'chat', label: 'CHAT', icon: MessageSquare },
          { id: 'prompts', label: 'QUICK HELP', icon: Zap },
          { id: 'code', label: 'CODE GEN', icon: Code2 },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-1.5 px-4 py-2 border-b-2 font-hud text-[10px] font-bold transition-all"
              style={{
                borderBottomColor: activeTab === tab.id ? '#8b5cf6' : 'transparent',
                color: activeTab === tab.id ? '#7c3aed' : '#94a3b8',
                background: activeTab === tab.id ? 'rgba(139,92,246,0.06)' : 'transparent',
              }}
            >
              <Icon size={11} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'chat' && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 panel-scroll">
            {displayMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 animate-float"
                  style={{ background: 'linear-gradient(135deg, #ff9a9e, #fecfef, #ffd200)', boxShadow: '0 8px 24px rgba(255,150,100,0.3)' }}
                >
                  🥭
                </div>
                <div className="font-hud text-sm font-bold text-purple-700 mb-2">AI SECRETARY READY</div>
                <div className="text-[11px] text-slate-500 max-w-xs leading-relaxed mb-4">
                  Powered by {activeModel.label}. Ask me anything about E-SMART-WORLD — deployment, coding, templates, GitHub setup, and more!
                </div>
                <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                  {QUICK_PROMPTS.slice(0, 4).map(q => (
                    <button
                      key={q.label}
                      onClick={() => sendMessage(q.prompt)}
                      className="text-[10px] p-2 rounded-xl text-left border transition-all hover:scale-105"
                      style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#6d28d9' }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {displayMessages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} onCopy={copyMessage} />
            ))}
            {(loading || streamingText) && (
              <div className="flex gap-2 animate-fade-in">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-base"
                  style={{ background: 'linear-gradient(135deg, #ff9a9e, #fecfef, #ffd200)' }}
                >
                  🥭
                </div>
                <div
                  className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-bl-md text-[11px] leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.95)', color: '#334155', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                >
                  {streamingText ? (
                    <span>{streamingText}<span className="animate-pulse">▌</span></span>
                  ) : (
                    <div className="flex gap-1 items-center">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                      ))}
                      <span className="text-slate-400 text-[9px] ml-1">Thinking...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 p-3 border-t"
            style={{ borderColor: 'rgba(148,163,184,0.15)', background: 'rgba(255,255,255,0.95)' }}
          >
            <div
              className="flex gap-2 items-end rounded-2xl p-1.5"
              style={{ background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.25)' }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask AI Secretary anything... (Enter to send, Shift+Enter for new line)"
                className="flex-1 resize-none bg-transparent outline-none text-[11px] text-slate-700 leading-relaxed px-2 py-1.5 max-h-24 panel-scroll placeholder:text-slate-400"
                rows={1}
                style={{ minHeight: '32px' }}
              />
              {loading ? (
                <button
                  onClick={stopGeneration}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
                >
                  <div className="w-3 h-3 rounded-sm" style={{ background: '#ef4444' }} />
                </button>
              ) : (
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 3px 10px rgba(139,92,246,0.4)', color: '#fff' }}
                >
                  <Send size={14} />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <div className="text-[9px] text-slate-400">
                Enter to send • Shift+Enter for new line • Using {activeModel.label}
              </div>
              <div className="text-[9px] text-slate-400">{aiMessages.length} messages</div>
            </div>
          </div>
        </>
      )}

      {/* QUICK HELP TAB */}
      {activeTab === 'prompts' && (
        <div className="flex-1 overflow-y-auto panel-scroll p-3">
          <div className="font-hud text-[10px] text-purple-600 mb-3 font-bold">QUICK HELP TOPICS</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {QUICK_PROMPTS.map(q => (
              <button
                key={q.label}
                onClick={() => { setActiveTab('chat'); sendMessage(q.prompt) }}
                className="text-left p-3 rounded-2xl border transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#6d28d9' }}
              >
                <div className="text-[11px] font-bold mb-0.5">{q.label}</div>
                <div className="text-[9px] text-slate-400 leading-relaxed">{q.prompt.substring(0, 60)}...</div>
              </button>
            ))}
          </div>
          <HudCard title="APP NAVIGATION GUIDE" accent="purple" compact>
            <div className="space-y-1.5 text-[10px]">
              {[
                { icon: '📥', label: 'IMPORT', desc: 'Import ZIP/HTML/code files' },
                { icon: '🎨', label: 'TEMPLATES', desc: '50+ ready templates with variables' },
                { icon: '⚙️', label: 'PROCESS', desc: 'Build, compile, create variations' },
                { icon: '✏️', label: 'EDITOR', desc: 'Edit files with live preview' },
                { icon: '🚀', label: 'DEPLOY', desc: 'GitHub Pages + Expo Go + APK' },
                { icon: '📱', label: 'QR CODES', desc: 'Share via QR code' },
                { icon: '🔐', label: 'VAULT', desc: 'Secure credential storage' },
                { icon: '📊', label: 'HISTORY', desc: 'Deployment history log' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.1)' }}>
                  <span className="text-base">{item.icon}</span>
                  <div>
                    <span className="font-hud font-bold text-purple-700">{item.label}</span>
                    <span className="text-slate-500 ml-1">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </HudCard>
        </div>
      )}

      {/* CODE GENERATOR TAB */}
      {activeTab === 'code' && (
        <div className="flex-1 overflow-y-auto panel-scroll p-3">
          <HudCard title="CODE GENERATION PROMPTS" subtitle="Click any prompt to generate complete code" accent="blue" compact>
            <div className="space-y-2">
              {SAMPLE_CODE_PROMPTS.map((prompt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.15)' }}
                  onClick={() => { setActiveTab('chat'); sendMessage(prompt) }}
                >
                  <Code2 size={14} className="text-blue-400 flex-shrink-0" />
                  <span className="text-[11px] text-slate-600 leading-relaxed">{prompt}</span>
                  <Zap size={11} className="text-blue-400 flex-shrink-0 ml-auto" />
                </div>
              ))}
            </div>
          </HudCard>
          <HudCard title="CUSTOM CODE REQUEST" accent="green" compact className="mt-3">
            <textarea
              className="input-hud resize-none text-[11px]"
              rows={4}
              placeholder="Describe what you want to build... e.g. 'Create a responsive restaurant website with dark theme, menu cards, and contact form'"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              className="mt-2 w-full btn-bright-purple flex items-center justify-center gap-2"
              onClick={() => { setActiveTab('chat'); sendMessage() }}
              disabled={!input.trim() || loading}
            >
              <Sparkles size={13} /> GENERATE WITH AI
            </button>
          </HudCard>
        </div>
      )}
    </div>
  )
}
