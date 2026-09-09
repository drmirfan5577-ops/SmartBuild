import React from 'react'
import {
  LayoutDashboard, Upload, Cpu, Rocket, QrCode, Link, Lock,
  Bot, History, Settings, ChevronLeft, ChevronRight, Zap,
  LayoutTemplate, Code2, Shield, Info, User, LogOut
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { NAV_SECTIONS, APP_NAME, APP_TAGLINE } from '@/constants'
import type { NavSection } from '@/types'
import type { ThemeId } from './ThemeLauncher'
import { THEMES } from './ThemeLauncher'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Upload, Cpu, Rocket, QrCode, Link, Lock,
  Bot, History, Settings, LayoutTemplate, Code2, Shield, Info,
}

const sectionColors: Record<string, string> = {
  home: '#3b82f6',
  import: '#10b981',
  templates: '#8b5cf6',
  process: '#f59e0b',
  editor: '#06b6d4',
  deploy: '#10b981',
  portfolio: '#ec4899',
  'qr-codes': '#ec4899',
  accounts: '#f97316',
  vault: '#ef4444',
  'ai-secretary': '#8b5cf6',
  history: '#64748b',
  settings: '#475569',
  admin: '#dc2626',
  about: '#0ea5e9',
}

interface SidebarProps {
  theme?: ThemeId
}

export function Sidebar({ theme }: SidebarProps) {
  const { activeSection, navigate, sidebarOpen, setSidebarOpen, user, logout } = useApp()
  const themeConfig = THEMES.find(t => t.id === theme) || THEMES[0]

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`flex flex-col z-30 h-full transition-all duration-300 flex-shrink-0
          ${sidebarOpen ? 'w-52' : 'w-14'}
          fixed lg:static top-0 left-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(40px) saturate(1.5)',
          borderRight: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.06)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 px-3 py-3 border-b"
          style={{ borderColor: 'rgba(148,163,184,0.15)' }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${themeConfig.preview[0]}, ${themeConfig.preview[1] || themeConfig.preview[0]})`,
              boxShadow: `0 4px 12px ${themeConfig.preview[0]}50`,
            }}
          >
            <Zap size={14} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="font-hud text-[10px] font-bold leading-tight text-shimmer-blue">
                {APP_NAME}
              </div>
              <div className="font-hud text-[7px] leading-tight text-slate-400">
                {APP_TAGLINE}
              </div>
            </div>
          )}
        </div>

        {/* User info strip */}
        {user && sidebarOpen && (
          <div
            className="flex items-center gap-2 px-3 py-2 border-b"
            style={{ borderColor: 'rgba(148,163,184,0.1)', background: 'rgba(59,130,246,0.04)' }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              {user.username?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-hud text-[9px] font-bold text-slate-700 truncate">{user.username}</div>
              <div className="text-[8px] text-slate-400 truncate">{user.email}</div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 py-1 overflow-y-auto panel-scroll space-y-0.5 px-1.5">
          {NAV_SECTIONS.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = activeSection === item.id
            const color = sectionColors[item.id] || '#3b82f6'
            const isAdmin = item.id === 'admin'
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id as NavSection)
                  if (window.innerWidth < 1024) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-all duration-200 text-left ${
                  isActive
                    ? 'border-l-[3px]'
                    : 'border-l-[3px] border-l-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
                style={isActive ? {
                  background: `linear-gradient(135deg, ${color}15, ${color}08)`,
                  borderLeftColor: color,
                  color,
                  boxShadow: `inset 0 0 12px ${color}08`,
                } : isAdmin ? { borderLeft: '3px solid transparent' } : {}}
              >
                {Icon && (
                  <Icon
                    size={14}
                    className="flex-shrink-0"
                    style={{ color: isActive ? color : isAdmin ? '#dc2626' : undefined }}
                  />
                )}
                {sidebarOpen && (
                  <span
                    className="font-hud text-[9px] font-bold truncate flex-1"
                    style={{ color: isAdmin && !isActive ? '#dc2626' : undefined }}
                  >
                    {item.label}
                  </span>
                )}
                {sidebarOpen && isAdmin && !isActive && (
                  <span className="text-[7px] px-1 py-0.5 rounded font-hud font-bold flex-shrink-0"
                    style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>
                    ADMIN
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Theme preview strip */}
        {sidebarOpen && (
          <div className="px-2 pb-1">
            <div className="h-1 rounded-full overflow-hidden flex">
              {themeConfig.preview.map((c, i) => (
                <div key={i} className="flex-1" style={{ background: c }} />
              ))}
            </div>
          </div>
        )}

        {/* Logout + Toggle */}
        <div className="p-2 border-t space-y-1" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
          {user && (
            <button
              onClick={() => logout()}
              className={`w-full flex items-center gap-2 p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            >
              <LogOut size={13} />
              {sidebarOpen && <span className="font-hud text-[9px] font-bold">SIGN OUT</span>}
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all duration-200"
          >
            {sidebarOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>
      </aside>
    </>
  )
}
