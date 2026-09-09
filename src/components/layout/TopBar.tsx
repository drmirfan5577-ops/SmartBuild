import React from 'react'
import { Menu, Wifi, Battery, Bell, Globe, LogOut, User, ChevronDown } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { NAV_SECTIONS } from '@/constants'
import { formatTime, formatDate } from '@/lib/utils'
import { ThemeLauncher } from './ThemeLauncher'
import type { ThemeId } from './ThemeLauncher'

const sectionColors: Record<string, string> = {
  home: '#3b82f6', import: '#10b981', templates: '#8b5cf6', process: '#f59e0b',
  editor: '#06b6d4', deploy: '#10b981', 'qr-codes': '#ec4899', accounts: '#f97316',
  vault: '#ef4444', 'ai-secretary': '#8b5cf6', history: '#64748b', settings: '#475569',
  admin: '#dc2626', about: '#0ea5e9', portfolio: '#ec4899',
}

interface TopBarProps {
  theme: ThemeId
  onThemeChange: (id: ThemeId) => void
}

export function TopBar({ theme, onThemeChange }: TopBarProps) {
  const { activeSection, setSidebarOpen, sidebarOpen, user, logout } = useApp()
  const section = NAV_SECTIONS.find(s => s.id === activeSection)
  const [time, setTime] = React.useState(formatTime())
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const color = sectionColors[activeSection] || '#3b82f6'

  React.useEffect(() => {
    const t = setInterval(() => setTime(formatTime()), 1000)
    return () => clearInterval(t)
  }, [])

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U'

  return (
    <header
      className="flex items-center justify-between px-3 py-2 flex-shrink-0 relative"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        minHeight: '52px',
        zIndex: 20,
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <div className="font-hud text-xs font-bold leading-tight" style={{ color }}>
            {section?.label || 'DASHBOARD'}
          </div>
          <div className="text-[9px] text-slate-400">
            {formatDate()}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-hud text-[9px] font-bold text-emerald-600">LIVE</span>
        </div>

        {/* Status icons */}
        <div className="hidden sm:flex items-center gap-1 text-slate-300">
          <Globe size={12} />
          <Wifi size={12} />
          <Battery size={12} />
        </div>

        {/* Time */}
        <div
          className="font-hud text-[10px] font-bold px-2 py-1 rounded-lg"
          style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}
        >
          {time}
        </div>

        {/* Theme launcher */}
        <ThemeLauncher current={theme} onChange={onThemeChange} />

        {/* User menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border transition-all hover:bg-slate-50"
              style={{ border: '1px solid rgba(203,213,225,0.4)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                {initials}
              </div>
              <span className="font-hud text-[10px] font-bold text-slate-600 hidden sm:block max-w-[80px] truncate">{user.username}</span>
              <ChevronDown size={11} className="text-slate-400" />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-full mt-1 z-50 rounded-2xl overflow-hidden animate-fade-in min-w-[160px]"
                style={{
                  background: 'rgba(255,255,255,0.98)',
                  border: '1px solid rgba(203,213,225,0.4)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
              >
                <div className="px-3 py-2.5 border-b" style={{ borderColor: 'rgba(203,213,225,0.3)' }}>
                  <div className="font-hud text-[10px] font-bold text-slate-700">{user.username}</div>
                  <div className="text-[9px] text-slate-400 truncate">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    logout()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-red-50 transition-all text-left"
                >
                  <LogOut size={12} className="text-red-400" />
                  <span className="font-hud text-[10px] font-bold text-red-500">Sign Out</span>
                </button>
              </div>
            )}

            {/* Click outside to close */}
            {showUserMenu && (
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            )}
          </div>
        )}
      </div>
    </header>
  )
}
