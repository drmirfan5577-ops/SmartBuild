import React, { useState, useEffect, useRef } from 'react'
import { X, Send, Minimize2, Cpu, ChevronDown } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { supabase } from '@/lib/supabase'

const QUICK_HELP = [
  'How to import ZIP?',
  'Deploy to GitHub',
  'Get QR code',
  'Expo Go setup',
  'Play Store guide',
]

const AI_MODELS_MINI = [
  { id: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash' },
  { id: 'openai/gpt-5-mini', label: 'GPT-5 Mini' },
  { id: 'openai/gpt-5.1', label: 'GPT-5.1' },
]

export function FloatingAIBubble() {
  const { navigate, aiMessages, addAiMessage } = useApp()
  const [pos, setPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 160 })
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [localMessages, setLocalMessages] = useState<{ role: string; text: string }[]>([
    { role: 'ai', text: '🥭 Hello! I am your AI Secretary. Ask me anything about E-SMART-WORLD! Powered by Gemini 3.' }
  ])
  const [typing, setTyping] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AI_MODELS_MINI[0].id)
  const [showModelPicker, setShowModelPicker] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [localMessages, typing])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y })
  }
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    setDragging(true)
    setDragOffset({ x: t.clientX - pos.x, y: t.clientY - pos.y })
  }

  useEffect(() => {
    if (!dragging) return
    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: Math.max(0, Math.min(window.innerWidth - 56, e.clientX - dragOffset.x)), y: Math.max(0, Math.min(window.innerHeight - 56, e.clientY - dragOffset.y)) })
    }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      setPos({ x: Math.max(0, Math.min(window.innerWidth - 56, t.clientX - dragOffset.x)), y: Math.max(0, Math.min(window.innerHeight - 56, t.clientY - dragOffset.y)) })
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, dragOffset])

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || typing) return
    setInput('')
    setLocalMessages(prev => [...prev, { role: 'user', text: msg }])
    setTyping(true)

    try {
      const conversationMessages = [
        ...localMessages.slice(-10).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: msg }
      ]

      const { data, error } = await supabase.functions.invoke('ai-secretary', {
        body: { messages: conversationMessages, model: selectedModel, stream: false }
      })

      if (error || !data?.text) throw new Error(error?.message || 'No response')
      setLocalMessages(prev => [...prev, { role: 'ai', text: data.text }])
    } catch {
      // Fallback to built-in responses
      const fallbacks: Record<string, string> = {
        'import': '📦 Go to "IMPORT PROJECT" → "Browse ZIP Files" → Select your ZIP → Enter name → Click Import!',
        'deploy': '🚀 Go to "DEPLOY" → Select project → Enter GitHub token & repo name → Click "DEPLOY NOW"!',
        'qr': '📱 After deploying, go to "QR / LINKS" — your QR code will be ready to scan or download!',
        'vault': '🔐 Go to "SECURE VAULT" → Enter PIN → Choose category → Click "ADD NEW ENTRY"!',
        'expo': '📱 Go to "DEPLOY" → "Expo Go" tab → Follow the 7-step guide to publish your React Native app!',
        'play': '🏪 Go to "DEPLOY" → "Play Store" tab → Follow the complete 9-step submission guide!',
      }
      const key = Object.keys(fallbacks).find(k => msg.toLowerCase().includes(k))
      const reply = key ? fallbacks[key] : '🥭 I am connecting to AI... For full AI power, open the AI Secretary page! Tap the minimize button above.'
      setLocalMessages(prev => [...prev, { role: 'ai', text: reply }])
    }
    setTyping(false)
  }

  const panelX = pos.x > window.innerWidth / 2 ? pos.x - 284 : pos.x + 64
  const panelY = Math.min(pos.y, window.innerHeight - 420)

  const activeModelLabel = AI_MODELS_MINI.find(m => m.id === selectedModel)?.label || 'Gemini 3'

  return (
    <>
      {/* Floating bubble */}
      <div
        className={`fixed z-50 select-none ${!dragging ? 'animate-float' : ''}`}
        style={{ left: pos.x, top: pos.y, width: 52, height: 52 }}
      >
        <button
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onClick={() => !dragging && setOpen(!open)}
          className="w-full h-full rounded-full flex items-center justify-center text-2xl cursor-grab active:cursor-grabbing transition-all"
          style={{
            background: 'linear-gradient(135deg, #ff9a9e, #fecfef, #ffd200)',
            boxShadow: '0 4px 20px rgba(255,100,100,0.4), 0 8px 32px rgba(255,200,0,0.2)',
            border: '3px solid rgba(255,255,255,0.9)',
            animation: !dragging ? 'pulseGlow 2s ease-in-out infinite' : 'none',
          }}
          title="AI Secretary — Powered by Gemini 3"
        >
          🥭
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 rounded-2xl overflow-hidden animate-fade-in"
          style={{
            left: Math.max(8, Math.min(window.innerWidth - 292, panelX)),
            top: Math.max(8, panelY),
            width: 284,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100"
            style={{ background: 'linear-gradient(135deg, #fff7ed, #fef3c7)' }}
          >
            <span className="text-lg">🥭</span>
            <div className="flex-1">
              <div className="font-hud text-[10px] font-bold text-amber-700">AI SECRETARY</div>
              {/* Model picker inline */}
              <div className="relative">
                <button
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className="flex items-center gap-0.5 text-[8px] text-amber-500 hover:text-amber-700 transition-all"
                >
                  <Cpu size={8} />
                  {activeModelLabel}
                  <ChevronDown size={7} />
                </button>
                {showModelPicker && (
                  <div
                    className="absolute left-0 top-5 z-50 rounded-xl overflow-hidden shadow-xl"
                    style={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(203,213,225,0.5)', minWidth: '160px' }}
                  >
                    {AI_MODELS_MINI.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedModel(m.id); setShowModelPicker(false) }}
                        className="w-full text-left px-3 py-2 text-[10px] hover:bg-amber-50 transition-all"
                        style={{ color: selectedModel === m.id ? '#d97706' : '#64748b', fontWeight: selectedModel === m.id ? 700 : 400 }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              className="text-slate-400 hover:text-amber-600 transition-all p-0.5"
              onClick={() => { navigate('ai-secretary'); setOpen(false) }}
              title="Open full AI Secretary"
            >
              <Minimize2 size={11} />
            </button>
            <button className="text-slate-400 hover:text-red-500 transition-all p-0.5" onClick={() => setOpen(false)}>
              <X size={12} />
            </button>
          </div>

          {/* Messages */}
          <div ref={messagesRef} className="p-2 space-y-2 overflow-y-auto panel-scroll" style={{ maxHeight: 220 }}>
            {localMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[90%] text-[10px] leading-relaxed px-2.5 py-1.5 rounded-xl"
                  style={m.role === 'user'
                    ? { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }
                    : { background: 'linear-gradient(135deg, #fef3c7, #fff7ed)', color: '#92400e', border: '1px solid rgba(245,158,11,0.2)' }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-1 px-2.5 py-1.5 rounded-xl w-fit" style={{ background: '#fef3c7' }}>
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="px-2 pb-1 flex flex-wrap gap-1">
            {QUICK_HELP.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[8px] px-2 py-0.5 rounded-full font-hud border border-amber-200 text-amber-700 hover:border-amber-400 hover:bg-amber-50 transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-1.5 p-2 border-t border-slate-100">
            <input
              className="flex-1 px-2.5 py-1.5 rounded-xl text-[10px] outline-none border border-slate-200 bg-slate-50 focus:border-amber-400 focus:bg-white transition-all text-slate-700"
              placeholder="Ask AI Secretary..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="flex-shrink-0 px-2 py-1.5 rounded-xl font-hud text-[9px] font-bold transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }}
            >
              <Send size={10} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
