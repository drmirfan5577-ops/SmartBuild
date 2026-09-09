import React, { useState } from 'react'
import { AppProvider, useApp } from '@/context/AppContext'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthPage } from '@/pages/AuthPage'
import type { ThemeId } from '@/components/layout/ThemeLauncher'

function LoadingScreen() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 40%, #fdf4ff 100%)' }}
    >
      <div className="text-center animate-fade-in">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 12px 40px rgba(59,130,246,0.4)', animation: 'float 2s ease-in-out infinite' }}
        >
          🥭
        </div>
        <div className="font-hud text-sm font-black" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          E-SMART-WORLD
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <div className="text-[10px] text-slate-300 mt-2">Initializing E.S wOrLd Platform...</div>
      </div>
    </div>
  )
}

function AppRoot() {
  const [theme, setTheme] = useState<ThemeId>('aurora')
  const { user, authLoading } = useApp()

  if (authLoading) return <LoadingScreen />
  if (!user) return <AuthPage />
  return <MainLayout theme={theme} onThemeChange={setTheme} />
}

export default function App() {
  return (
    <AppProvider>
      <AppRoot />
    </AppProvider>
  )
}
