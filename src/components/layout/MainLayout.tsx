import React from 'react'
import { useApp } from '@/context/AppContext'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { Dashboard } from '@/pages/Dashboard'
import { ImportPage } from '@/pages/ImportPage'
import { TemplatePage } from '@/pages/TemplatePage'
import { ProcessPage } from '@/pages/ProcessPage'
import { FileEditorPage } from '@/pages/FileEditorPage'
import { DeployPage } from '@/pages/DeployPage'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { AccountsPage } from '@/pages/AccountsPage'
import { VaultPage } from '@/pages/VaultPage'
import { AISecretaryPage } from '@/pages/AISecretaryPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AdminPage } from '@/pages/AdminPage'
import { AboutPage } from '@/pages/AboutPage'
import { FloatingAIBubble } from '@/components/features/FloatingAIBubble'
import type { ThemeId } from './ThemeLauncher'
import { THEMES } from './ThemeLauncher'

function Particles({ colors }: { colors: string[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-30"
          style={{
            width: `${4 + (i % 5) * 3}px`,
            height: `${4 + (i % 5) * 3}px`,
            left: `${(i * 6.25) % 100}%`,
            top: `${(i * 7.3) % 100}%`,
            background: colors[i % colors.length],
            animation: `particleFloat ${5 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
            filter: 'blur(1px)',
          }}
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${60 + i * 30}px`,
            height: `${60 + i * 30}px`,
            left: `${10 + i * 15}%`,
            top: `${5 + i * 14}%`,
            background: `radial-gradient(circle, ${colors[i % colors.length]}40, transparent)`,
            animation: `float ${7 + i * 1.5}s ease-in-out ${i * 0.8}s infinite`,
            filter: 'blur(8px)',
          }}
        />
      ))}
    </div>
  )
}

interface MainLayoutProps {
  theme: ThemeId
  onThemeChange: (id: ThemeId) => void
}

export function MainLayout({ theme, onThemeChange }: MainLayoutProps) {
  const { activeSection } = useApp()
  const themeConfig = THEMES.find(t => t.id === theme) || THEMES[0]

  const renderPage = () => {
    switch (activeSection) {
      case 'home': return <Dashboard />
      case 'import': return <ImportPage />
      case 'templates': return <TemplatePage />
      case 'process': return <ProcessPage />
      case 'editor': return <FileEditorPage />
      case 'deploy': return <DeployPage />
      case 'portfolio': return <PortfolioPage />
      case 'qr-codes': return <PortfolioPage />
      case 'accounts': return <AccountsPage />
      case 'vault': return <VaultPage />
      case 'ai-secretary': return <AISecretaryPage />
      case 'history': return <HistoryPage />
      case 'settings': return <SettingsPage />
      case 'admin': return <AdminPage />
      case 'about': return <AboutPage />
      default: return <Dashboard />
    }
  }

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden relative ${themeConfig.class}`}
      style={{ position: 'relative' }}
    >
      <Particles colors={themeConfig.preview} />
      <div className="fixed inset-0 z-0" style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(2px)' }} />

      <div className="relative z-10 flex h-full w-full">
        <Sidebar theme={theme} />
        <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
          <TopBar theme={theme} onThemeChange={onThemeChange} />
          <main
            className="flex-1 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
          >
            {renderPage()}
          </main>
        </div>
      </div>

      <FloatingAIBubble />
    </div>
  )
}
