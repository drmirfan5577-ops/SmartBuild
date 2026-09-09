import React, { useState } from 'react'
import { Palette, X, Check, Sparkles, Sun, Waves, Star, Zap, Rainbow } from 'lucide-react'

export type ThemeId = 'aurora' | 'crystal' | 'sunrise' | 'ocean' | 'galaxy' | 'neon'

export interface ThemeConfig {
  id: ThemeId
  name: string
  icon: React.ElementType
  class: string
  preview: string[]
  desc: string
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    icon: Sparkles,
    class: 'theme-aurora',
    preview: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
    desc: 'Purple-pink aurora borealis'
  },
  {
    id: 'crystal',
    name: 'Crystal',
    icon: Star,
    class: 'theme-crystal',
    preview: ['#a8edea', '#fed6e3', '#d299c2', '#fef9d7'],
    desc: 'Soft crystal pastel glow'
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    icon: Sun,
    class: 'theme-sunrise',
    preview: ['#ff9a9e', '#fecfef', '#ffecd2', '#fcb69f'],
    desc: 'Warm morning sunrise bloom'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: Waves,
    class: 'theme-ocean',
    preview: ['#43e97b', '#38f9d7', '#4facfe', '#00f2fe'],
    desc: 'Deep ocean teal & emerald'
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    icon: Rainbow,
    class: 'theme-galaxy',
    preview: ['#a18cd1', '#fbc2eb', '#fad0c4', '#ffeaa7'],
    desc: 'Dreamy galaxy lavender'
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: Zap,
    class: 'theme-neon',
    preview: ['#f7971e', '#ffd200', '#5efce8', '#736efe'],
    desc: 'Electric neon carnival'
  },
]

interface ThemeLauncherProps {
  current: ThemeId
  onChange: (id: ThemeId) => void
}

export function ThemeLauncher({ current, onChange }: ThemeLauncherProps) {
  const [open, setOpen] = useState(false)
  const currentTheme = THEMES.find(t => t.id === current) || THEMES[0]
  const Icon = currentTheme.icon

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
        title="Change Display Theme"
      >
        <div className="flex gap-0.5">
          {currentTheme.preview.slice(0, 3).map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <Icon size={12} style={{ color: currentTheme.preview[0] }} />
        <span className="font-hud text-[9px] font-bold text-slate-600 hidden sm:block">{currentTheme.name}</span>
        <Palette size={11} className="text-slate-400" />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 z-50 animate-fade-in"
          style={{
            width: 280,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.9)',
            borderRadius: 16,
            boxShadow: '0 16px 48px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div>
              <div className="font-hud text-[11px] font-bold text-slate-700">DISPLAY LAUNCHER</div>
              <div className="text-[10px] text-slate-400">Choose your background theme</div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
              <X size={14} />
            </button>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {THEMES.map(theme => {
              const TIcon = theme.icon
              const isActive = current === theme.id
              return (
                <button
                  key={theme.id}
                  onClick={() => { onChange(theme.id); setOpen(false) }}
                  className="relative flex flex-col gap-2 p-3 rounded-xl text-left transition-all duration-200 overflow-hidden"
                  style={{
                    border: isActive ? '2px solid transparent' : '1px solid rgba(203,213,225,0.5)',
                    background: isActive ? 'rgba(59,130,246,0.06)' : 'rgba(248,250,252,0.8)',
                    boxShadow: isActive ? '0 0 0 2px #3b82f6, 0 4px 12px rgba(59,130,246,0.15)' : 'none',
                  }}
                >
                  {/* Preview strip */}
                  <div className="h-8 rounded-lg overflow-hidden flex">
                    {theme.preview.map((c, i) => (
                      <div key={i} className="flex-1" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-hud text-[10px] font-bold text-slate-700">{theme.name}</div>
                      <div className="text-[9px] text-slate-400">{theme.desc}</div>
                    </div>
                    {isActive && <Check size={12} className="text-blue-500 flex-shrink-0" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
