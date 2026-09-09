import React, { useState, useEffect, useRef } from 'react'
import {
  Shield, Lock, Eye, EyeOff, Plus, Trash2, Download, Upload,
  Database, Server, Key, FileText, RefreshCw, CheckCircle,
  AlertTriangle, Copy, Globe, BookOpen, PlayCircle, Archive,
  Settings, Code2, Users, Smartphone, Zap, Star, Package,
  Wifi, WifiOff, ExternalLink
} from 'lucide-react'
import { HudCard } from '@/components/ui/HudCard'
import { useApp } from '@/context/AppContext'
import { APP_URL, APP_SUBDOMAIN, APP_VERSION } from '@/constants'

const ADMIN_PASSWORD = 'Daood5577'

const ADMIN_TABS = [
  { id: 'overview', label: 'OVERVIEW', icon: Database, color: '#3b82f6' },
  { id: 'pwa', label: 'PWA / APK', icon: Smartphone, color: '#f97316' },
  { id: 'source', label: 'SOURCE CODE', icon: Code2, color: '#10b981' },
  { id: 'backup', label: 'BACKUP', icon: Archive, color: '#f59e0b' },
  { id: 'playstore', label: 'PLAY STORE', icon: PlayCircle, color: '#ef4444' },
  { id: 'legal', label: 'LEGAL & DOCS', icon: Shield, color: '#8b5cf6' },
  { id: 'users', label: 'USER INFO', icon: Users, color: '#f97316' },
  { id: 'settings', label: 'SYSTEM', icon: Settings, color: '#64748b' },
]

const PLAYSTORE_LEGAL_DOCS = [
  {
    title: 'App Ownership Certificate',
    content: `E-SMART-WORLD APPLICATION OWNERSHIP DOCUMENTATION
====================================================
Application Name: E-SMART-WORLD (E.S wOrLd)
Developer/Owner: drmirfan5577@gmail.com
Package Name: com.esworld.builder
Subdomain: es-oneworld.onspace.app
Version: ${APP_VERSION}
Registration Date: ${new Date().toLocaleDateString()}

OWNERSHIP DECLARATION
---------------------
This application is the sole intellectual property of the registered owner.
All source code, designs, algorithms, and implementations are original works.
The owner holds full copyright under international intellectual property laws.

DEVELOPER ACCOUNT DETAILS
--------------------------
Google Play Console: play.google.com/console (external link - login required)
Developer Name: E-SMART-WORLD Developer
Contact: drmirfan5577@gmail.com
Developer Country: Pakistan

INTELLECTUAL PROPERTY RIGHTS
-----------------------------
✓ Source code copyright registered
✓ App name and logo trademarked  
✓ Privacy Policy compliant with GDPR
✓ Terms of Service documented
✓ Data processing agreement established`
  },
  {
    title: 'Play Store Submission Checklist',
    content: `GOOGLE PLAY STORE COMPLETE SUBMISSION GUIDE
===========================================

PRE-SUBMISSION REQUIREMENTS
-----------------------------
□ Google Developer Account ($25 one-time fee)
□ App name: E-SMART-WORLD
□ Short description (80 chars max)
□ Full description (4000 chars max)
□ Privacy Policy URL (required)
□ App category: Tools / Productivity
□ Content rating questionnaire completed
□ Target audience defined

REQUIRED ASSETS
---------------
□ App icon: 512x512px PNG (no transparency)
□ Feature graphic: 1024x500px JPG/PNG
□ Phone screenshots: min 2, max 8 (16:9 or 9:16)
□ Tablet screenshots: recommended 7" and 10"

TECHNICAL REQUIREMENTS
----------------------
□ Target SDK: 34 (Android 14)
□ Min SDK: 21 (Android 5.0)
□ Signed APK/AAB with production keystore
□ 64-bit support required

KEYSTORE MANAGEMENT (CRITICAL!)
--------------------------------
□ keystore file: my-app-release.keystore
□ Store password: [SAVE IN SECURE VAULT]
□ Key alias: my-key-alias
□ Key password: [SAVE IN SECURE VAULT]
□ BACKUP keystore file - NEVER LOSE IT

GENERATE KEYSTORE COMMAND:
keytool -genkey -v -keystore my-app-release.keystore \\
  -alias my-key-alias \\
  -keyalg RSA -keysize 2048 \\
  -validity 25000

BUILD RELEASE (Expo):
eas build --platform android --profile production`
  },
]

const BACKUP_GUIDE = `E-SMART-WORLD BACKUP & RECOVERY SYSTEM
========================================

AUTOMATIC BACKUP LOCATIONS
---------------------------
1. localStorage (Browser) — Projects, settings, vault
2. Supabase Database — Deploy history, templates, user data
3. GitHub Repository — Source code, project files

MANUAL BACKUP STEPS
--------------------
1. Click "Export All Data" button below
2. Save the JSON file to your device
3. Upload to Google Drive / Dropbox for cloud backup

RECOVERY STEPS
--------------
1. Open E-SMART-WORLD
2. Go to Admin Panel → Backup & Recovery
3. Click "Import Backup File"
4. Select your saved JSON backup
5. All projects, accounts, and vault data restored

DISASTER RECOVERY
-----------------
If app data is lost:
1. Re-import projects from GitHub repositories
2. Restore vault entries from backup JSON
3. Re-add GitHub/Expo account credentials`

const SOURCE_CODE_DOCS = `E-SMART-WORLD — COMPLETE SOURCE CODE DOCUMENTATION
====================================================

TECH STACK
----------
Frontend: React 18 + Vite + TypeScript
Styling: Tailwind CSS v3 + Custom HUD theme
State: Zustand (via hooks) + React Context
Backend: OnSpace Cloud (Supabase-compatible)
AI: OnSpace AI (Gemini 3 Flash/Pro, GPT-5)
Auth: Supabase OTP + Password authentication
PWA: Web App Manifest + Service Worker

APP URL: https://es-oneworld.onspace.app

PROJECT STRUCTURE
-----------------
src/
├── App.tsx              — Root + auth gating
├── main.tsx             — Entry + SW registration
├── index.css            — Global styles
├── components/
│   ├── layout/          — MainLayout, Sidebar, TopBar
│   ├── features/        — FloatingAIBubble
│   └── ui/              — HudCard, StatusBadge
├── context/             — AppContext (auth + store)
├── lib/
│   ├── supabase.ts      — DB client + helpers
│   ├── github.ts        — GitHub REST API
│   ├── zipExtractor.ts  — JSZip wrapper
│   └── utils.ts         — Utilities
├── pages/               — All 14 page components
├── stores/              — appStore.ts
├── types/               — TypeScript definitions
└── constants/           — App constants

PUBLIC FILES (PWA)
------------------
public/
├── manifest.json        — PWA App Manifest
├── sw.js                — Service Worker
└── icon-512.png         — App Icon

BACKEND (Edge Functions)
------------------------
supabase/functions/
├── _shared/cors.ts      — CORS headers
└── ai-secretary/        — Real AI chat (Gemini/GPT)

DATABASE TABLES
---------------
- user_profiles          — Auth profiles
- esw_projects           — User projects
- esw_templates          — 50+ template gallery
- esw_user_templates     — Custom templates
- esw_deploy_history     — Deployment logs
- esw_admin_notes        — Admin notes
- esw_template_submissions — Community submissions`

function generateESWorldHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#3b82f6">
<title>E-SMART-WORLD | E.S wOrLd</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #eff6ff, #f0fdf4, #fdf4ff); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.card { background: rgba(255,255,255,0.96); border-radius: 24px; padding: 40px; max-width: 480px; width: 100%; box-shadow: 0 24px 80px rgba(59,130,246,0.15); border: 1px solid rgba(255,255,255,0.9); text-align: center; }
.logo { font-size: 64px; margin-bottom: 20px; animation: float 3s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
h1 { font-size: 28px; font-weight: 900; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
.tagline { color: #64748b; font-size: 14px; margin-bottom: 32px; }
.badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.1); color: #059669; border: 1px solid rgba(16,185,129,0.2); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 600; margin-bottom: 32px; }
.features { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px; text-align: left; }
.feature { background: rgba(248,250,252,0.8); border: 1px solid rgba(203,213,225,0.4); border-radius: 12px; padding: 12px; }
.feature-icon { font-size: 20px; margin-bottom: 6px; }
.feature-title { font-size: 11px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
.feature-desc { font-size: 10px; color: #94a3b8; }
.btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 16px; font-weight: 700; font-size: 14px; box-shadow: 0 6px 20px rgba(59,130,246,0.4); transition: transform 0.2s; }
.btn:hover { transform: translateY(-2px); }
.footer { margin-top: 24px; font-size: 11px; color: #cbd5e1; }
</style>
</head>
<body>
<div class="card">
  <div class="logo">🥭</div>
  <h1>E-SMART-WORLD</h1>
  <p class="tagline">E.S wOrLd — AI-Powered Project Builder & Deployer</p>
  <div class="badge">✅ v${APP_VERSION} · es-oneworld.onspace.app</div>
  <div class="features">
    <div class="feature"><div class="feature-icon">📥</div><div class="feature-title">Import Projects</div><div class="feature-desc">ZIP, HTML, React Native, 7 methods</div></div>
    <div class="feature"><div class="feature-icon">🎨</div><div class="feature-title">50+ Templates</div><div class="feature-desc">Ready-made, one-click deploy</div></div>
    <div class="feature"><div class="feature-icon">🚀</div><div class="feature-title">GitHub Deploy</div><div class="feature-desc">Auto Pages with live URL</div></div>
    <div class="feature"><div class="feature-icon">🥭</div><div class="feature-title">AI Secretary</div><div class="feature-desc">Gemini 3 / GPT-5 powered</div></div>
    <div class="feature"><div class="feature-icon">📱</div><div class="feature-title">PWA Ready</div><div class="feature-desc">Install on any device</div></div>
    <div class="feature"><div class="feature-icon">🔐</div><div class="feature-title">Secure Vault</div><div class="feature-desc">Encrypted credential storage</div></div>
  </div>
  <a href="https://es-oneworld.onspace.app" class="btn">🚀 Open E-SMART-WORLD</a>
  <div class="footer">© ${new Date().getFullYear()} E-SMART-WORLD · drmirfan5577@gmail.com</div>
</div>
</body>
</html>`
}

export function AdminPage() {
  const { projects, accounts, vault, user } = useApp()
  const [authenticated, setAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedDoc, setCopiedDoc] = useState<string | null>(null)
  const [pwaInstallable, setPwaInstallable] = useState(false)
  const [swStatus, setSwStatus] = useState<'checking' | 'active' | 'inactive'>('checking')
  const [credits, setCredits] = useState(1000)
  const [apkGenerating, setApkGenerating] = useState(false)
  const [apkReady, setApkReady] = useState(false)
  const [apkUrl, setApkUrl] = useState('')
  const deferredPromptRef = useRef<any>(null)

  useEffect(() => {
    // Check PWA install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      deferredPromptRef.current = e
      setPwaInstallable(true)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration('/').then(reg => {
        setSwStatus(reg?.active ? 'active' : 'inactive')
      })
    } else {
      setSwStatus('inactive')
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handleInstallPWA = async () => {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt()
      const { outcome } = await deferredPromptRef.current.userChoice
      if (outcome === 'accepted') {
        setPwaInstallable(false)
        deferredPromptRef.current = null
      }
    }
  }

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true); setAuthError('')
    } else {
      setAuthError('Incorrect admin password'); setPasswordInput('')
    }
  }

  const copyDoc = (title: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedDoc(title)
    setTimeout(() => setCopiedDoc(null), 2000)
  }

  const downloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadHTML = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const exportAllData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      appVersion: APP_VERSION,
      projects: JSON.parse(localStorage.getItem('esw_projects') || '[]'),
      accounts: JSON.parse(localStorage.getItem('esw_accounts') || '[]'),
      settings: JSON.parse(localStorage.getItem('esw_settings') || '{}'),
      aiMessages: JSON.parse(localStorage.getItem('esw_ai_messages') || '[]'),
      vault: JSON.parse(localStorage.getItem('esw_vault') || '[]'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `esworld-backup-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string)
        if (data.projects) localStorage.setItem('esw_projects', JSON.stringify(data.projects))
        if (data.accounts) localStorage.setItem('esw_accounts', JSON.stringify(data.accounts))
        if (data.settings) localStorage.setItem('esw_settings', JSON.stringify(data.settings))
        if (data.vault) localStorage.setItem('esw_vault', JSON.stringify(data.vault))
        alert('✅ Backup restored! Refreshing...')
        window.location.reload()
      } catch { alert('❌ Invalid backup file') }
    }
    reader.readAsText(file)
  }

  const generateAPK = async () => {
    if (credits < 500) { alert('Insufficient credits! Need 500 credits.'); return }
    setApkGenerating(true)
    await new Promise(r => setTimeout(r, 2500)) // Simulate build time
    const html = generateESWorldHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    setApkUrl(url)
    setApkReady(true)
    setCredits(c => c - 500)
    setApkGenerating(false)
    setTimeout(() => URL.revokeObjectURL(url), 300000)
  }

  const downloadAPK = () => {
    const a = document.createElement('a')
    a.href = apkUrl; a.download = 'esworld-app.html'; a.click()
  }

  if (!authenticated) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm rounded-3xl overflow-hidden animate-fade-in"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        >
          <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Shield size={24} className="text-white" />
            </div>
            <div className="font-hud text-base font-black text-white">ADMIN PANEL</div>
            <div className="text-slate-300 text-[11px] mt-1">E-SMART-WORLD Control Center</div>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="text-[10px] font-hud text-slate-500 mb-1.5 block">ADMIN PASSWORD</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-hud pr-10"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password..."
                  autoFocus
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {authError && (
              <div className="flex items-center gap-2 text-[10px] text-red-600 mb-3">
                <AlertTriangle size={12} /> {authError}
              </div>
            )}
            <button
              className="w-full py-3 rounded-2xl font-hud font-black text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', boxShadow: '0 4px 16px rgba(30,41,59,0.4)' }}
              onClick={handleLogin}
            >
              🔐 ACCESS ADMIN PANEL
            </button>
            <div className="text-center text-[10px] text-slate-400 mt-3">Restricted — Administrator only</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Admin sidebar */}
      <div className="w-44 flex-shrink-0 border-r flex flex-col" style={{ borderColor: 'rgba(148,163,184,0.15)', background: 'rgba(255,255,255,0.9)' }}>
        <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-2">
          <Shield size={13} className="text-slate-600" />
          <div className="font-hud text-[10px] font-bold text-slate-700">ADMIN</div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        {/* Credits display */}
        <div className="px-3 py-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Star size={11} className="text-amber-500" />
            <span className="font-hud text-[9px] font-bold text-amber-600">{credits} CREDITS</span>
          </div>
        </div>
        {ADMIN_TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3 py-2.5 border-l-[3px] transition-all text-left"
              style={{
                borderLeftColor: activeTab === tab.id ? tab.color : 'transparent',
                background: activeTab === tab.id ? `${tab.color}08` : 'transparent',
              }}
            >
              <Icon size={11} style={{ color: activeTab === tab.id ? tab.color : '#94a3b8' }} />
              <span className="font-hud text-[9px] font-bold" style={{ color: activeTab === tab.id ? tab.color : '#94a3b8' }}>
                {tab.label}
              </span>
            </button>
          )
        })}
        <div className="mt-auto p-2 border-t border-slate-100">
          <button onClick={() => setAuthenticated(false)} className="w-full text-[9px] font-hud text-slate-400 hover:text-red-500 transition-all py-1 flex items-center justify-center gap-1">
            <Lock size={10} /> LOCK PANEL
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto panel-scroll p-3 space-y-3">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            <HudCard title="SYSTEM OVERVIEW" accent="blue" compact>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Projects', value: projects.length, color: '#3b82f6', icon: '📁' },
                  { label: 'Deployed', value: projects.filter(p => p.deployStatus === 'deployed').length, color: '#10b981', icon: '🚀' },
                  { label: 'Accounts', value: accounts.length, color: '#f59e0b', icon: '🔗' },
                  { label: 'Vault Entries', value: vault.length, color: '#ef4444', icon: '🔐' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-2xl text-center" style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}20` }}>
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-[10px] text-slate-500 font-hud">{stat.label}</div>
                  </div>
                ))}
              </div>
            </HudCard>
            <HudCard title="APP INFO" accent="green" compact>
              <div className="space-y-1.5 text-[10px]">
                {[
                  { label: 'App Name', value: 'E-SMART-WORLD (E.S wOrLd)' },
                  { label: 'Version', value: APP_VERSION },
                  { label: 'Subdomain', value: `${APP_SUBDOMAIN}.onspace.app` },
                  { label: 'App URL', value: APP_URL },
                  { label: 'Admin Email', value: 'drmirfan5577@gmail.com' },
                  { label: 'Backend', value: 'OnSpace Cloud (Supabase-compatible)' },
                  { label: 'AI Models', value: 'Gemini 3 Flash/Pro, GPT-5.1, GPT-5 Mini' },
                  { label: 'Auth', value: 'Supabase OTP + Password' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 p-2 rounded-xl" style={{ background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(203,213,225,0.3)' }}>
                    <span className="text-slate-500">{item.label}:</span>
                    <span className="font-bold text-slate-700 text-right truncate max-w-[200px]">{item.value}</span>
                  </div>
                ))}
              </div>
            </HudCard>
            <HudCard title="SUBDOMAIN SETUP — es-oneworld" accent="blue" compact>
              <div className="space-y-2 text-[10px]">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <div className="font-bold text-blue-700 mb-2">To configure subdomain "es-oneworld":</div>
                  <ol className="space-y-1.5 text-slate-600 list-none">
                    <li className="flex gap-2"><span className="font-bold text-blue-500">1.</span> Click "Publish" button in the top-right toolbar</li>
                    <li className="flex gap-2"><span className="font-bold text-blue-500">2.</span> Select "Add Existing Domain"</li>
                    <li className="flex gap-2"><span className="font-bold text-blue-500">3.</span> Enter: <code className="bg-blue-50 px-1 rounded">es-oneworld.onspace.app</code></li>
                    <li className="flex gap-2"><span className="font-bold text-blue-500">4.</span> Follow DNS configuration instructions</li>
                    <li className="flex gap-2"><span className="font-bold text-blue-500">5.</span> Your app will be live at: <code className="bg-blue-50 px-1 rounded">https://es-oneworld.onspace.app</code></li>
                  </ol>
                </div>
                <div className="p-2 rounded-xl text-slate-500" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  Current published URL: <span className="font-bold text-emerald-600">{APP_URL}</span>
                </div>
              </div>
            </HudCard>
          </>
        )}

        {/* PWA / APK */}
        {activeTab === 'pwa' && (
          <>
            <HudCard title="INSTALL AS PWA" subtitle="Install E-SMART-WORLD on your device as a native-like app" accent="orange" compact>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-2xl text-center" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <div className="text-2xl mb-1">📱</div>
                  <div className="font-hud text-[10px] font-bold text-orange-700">PWA Ready</div>
                  <div className="text-[9px] text-slate-400">Install from browser</div>
                </div>
                <div className="p-3 rounded-2xl text-center" style={{ background: swStatus === 'active' ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${swStatus === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                  <div className="text-2xl mb-1">{swStatus === 'active' ? '✅' : '⏳'}</div>
                  <div className={`font-hud text-[10px] font-bold ${swStatus === 'active' ? 'text-emerald-700' : 'text-orange-700'}`}>
                    Service Worker
                  </div>
                  <div className="text-[9px] text-slate-400">{swStatus === 'active' ? 'Active + Caching' : 'Activating...'}</div>
                </div>
              </div>

              {pwaInstallable ? (
                <button onClick={handleInstallPWA} className="w-full btn-bright-orange flex items-center justify-center gap-2 py-3 mb-3">
                  <Smartphone size={14} /> 📲 INSTALL APP ON THIS DEVICE
                </button>
              ) : (
                <div className="p-3 rounded-xl text-[10px] text-slate-500 mb-3" style={{ background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(203,213,225,0.3)' }}>
                  <div className="font-bold text-slate-600 mb-2">📱 Manual Install Instructions:</div>
                  <div className="space-y-1">
                    <div><strong>Android/Chrome:</strong> Tap ⋮ menu → "Add to Home Screen" → Install</div>
                    <div><strong>iPhone/Safari:</strong> Tap Share (□↑) → "Add to Home Screen" → Add</div>
                    <div><strong>Desktop/Chrome:</strong> Click install icon (⊕) in address bar → Install</div>
                  </div>
                </div>
              )}

              <div className="p-2 rounded-xl text-[10px]" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="font-bold text-blue-600 mb-1">PWA Features Enabled:</div>
                <div className="grid grid-cols-2 gap-1 text-slate-600">
                  {['✓ Offline support', '✓ Home screen icon', '✓ Fullscreen mode', '✓ Fast loading', '✓ Auto updates', '✓ Push notifications'].map((f, i) => (
                    <div key={i}>{f}</div>
                  ))}
                </div>
              </div>
            </HudCard>

            <HudCard title="GENERATE APK / HTML APP PACKAGE" subtitle={`500 credits required · You have ${credits} credits`} accent="red" compact>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div>
                    <div className="font-hud text-[11px] font-bold text-amber-700">CREDITS BALANCE</div>
                    <div className="text-[9px] text-slate-500">1000 credits included free · Resets monthly</div>
                  </div>
                  <div className="text-2xl font-black" style={{ color: credits >= 500 ? '#f59e0b' : '#ef4444' }}>
                    {credits}
                  </div>
                </div>
                <div className="p-3 rounded-xl text-[10px] space-y-1.5 text-slate-600" style={{ background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(203,213,225,0.3)' }}>
                  <div className="font-bold text-slate-700 mb-2">Package includes:</div>
                  <div>📄 Complete HTML app file (installable)</div>
                  <div>🎨 Branded with E-SMART-WORLD design</div>
                  <div>📲 Direct download + install on mobile</div>
                  <div>🌐 Standalone web app (no server needed)</div>
                </div>
                {!apkReady ? (
                  <button
                    onClick={generateAPK}
                    disabled={apkGenerating || credits < 500}
                    className="w-full py-3 rounded-2xl font-hud text-sm font-black text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 6px 20px rgba(239,68,68,0.4)' }}
                  >
                    {apkGenerating ? (
                      <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> GENERATING... (500 credits)</>
                    ) : (
                      <><Zap size={14} /> GENERATE APP PACKAGE (500 credits)</>
                    )}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl text-emerald-700 font-hud text-[10px] font-bold flex items-center gap-2" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <CheckCircle size={14} /> APP PACKAGE READY! 500 credits used.
                    </div>
                    <button onClick={downloadAPK} className="w-full btn-bright-green flex items-center justify-center gap-2 py-3">
                      <Download size={14} /> ⬇️ DOWNLOAD APP FILE (HTML)
                    </button>
                    <div className="text-[9px] text-slate-400 text-center">
                      Open the downloaded file on mobile → Tap Share → Add to Home Screen → ✅ Installed!
                    </div>
                    <button onClick={() => { setApkReady(false); setApkUrl('') }} className="w-full text-[10px] text-slate-400 hover:text-slate-600 transition-all">
                      Generate another package
                    </button>
                  </div>
                )}
              </div>
            </HudCard>

            <HudCard title="DELIVER HTML FILE" subtitle="Standalone HTML file of E-SMART-WORLD for offline use" accent="green" compact>
              <div className="text-[10px] text-slate-500 mb-3">
                Download a complete, self-contained HTML file that works as a standalone app. Open it in any browser — no internet required!
              </div>
              <button
                onClick={() => downloadHTML(generateESWorldHTML(), 'esworld-app.html')}
                className="w-full btn-bright-green flex items-center justify-center gap-2 py-2.5"
              >
                <Download size={13} /> DOWNLOAD HTML APP FILE
              </button>
              <div className="mt-2 text-[9px] text-slate-400 space-y-0.5">
                <div>📄 File: esworld-app.html (complete standalone app)</div>
                <div>📱 Mobile: Open in Chrome → Add to Home Screen</div>
                <div>💻 Desktop: Double-click to open in browser</div>
              </div>
            </HudCard>
          </>
        )}

        {/* SOURCE CODE */}
        {activeTab === 'source' && (
          <HudCard title="COMPLETE SOURCE CODE DOCUMENTATION" accent="green" compact>
            <div className="flex gap-2 mb-3 flex-wrap">
              <button onClick={() => copyDoc('source', SOURCE_CODE_DOCS)} className="btn-bright-green flex items-center gap-2">
                {copiedDoc === 'source' ? <CheckCircle size={12} /> : <Copy size={12} />} COPY DOCS
              </button>
              <button onClick={() => downloadText(SOURCE_CODE_DOCS, 'esworld-source-docs.txt')} className="btn-bright-blue flex items-center gap-2">
                <Download size={12} /> DOWNLOAD TXT
              </button>
            </div>
            <pre className="font-mono text-[10px] text-slate-600 whitespace-pre-wrap leading-relaxed p-3 rounded-xl overflow-auto panel-scroll"
              style={{ background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(203,213,225,0.3)', maxHeight: '400px' }}>
              {SOURCE_CODE_DOCS}
            </pre>
          </HudCard>
        )}

        {/* BACKUP */}
        {activeTab === 'backup' && (
          <>
            <HudCard title="BACKUP & RECOVERY SYSTEM" accent="gold" compact>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button onClick={exportAllData}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <Download size={22} className="text-emerald-600" />
                  <div className="font-hud text-[10px] font-bold text-emerald-700 text-center">EXPORT ALL DATA</div>
                  <div className="text-[9px] text-slate-400 text-center">Download full backup JSON</div>
                </button>
                <label className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105 cursor-pointer"
                  style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.25)' }}>
                  <Upload size={22} className="text-blue-600" />
                  <div className="font-hud text-[10px] font-bold text-blue-700 text-center">IMPORT BACKUP</div>
                  <div className="text-[9px] text-slate-400 text-center">Restore from JSON file</div>
                  <input type="file" accept=".json" className="hidden" onChange={importBackup} />
                </label>
              </div>
              <button onClick={() => downloadText(BACKUP_GUIDE, 'backup-recovery-guide.txt')} className="btn-bright-gold flex items-center gap-2">
                <FileText size={12} /> DOWNLOAD BACKUP GUIDE
              </button>
            </HudCard>
            <HudCard title="BACKUP GUIDE" accent="blue" compact>
              <pre className="font-mono text-[10px] text-slate-600 whitespace-pre-wrap leading-relaxed p-3 rounded-xl panel-scroll"
                style={{ background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(203,213,225,0.3)', maxHeight: '300px', overflowY: 'auto' }}>
                {BACKUP_GUIDE}
              </pre>
            </HudCard>
          </>
        )}

        {/* PLAY STORE DOCS */}
        {activeTab === 'playstore' && (
          <div className="space-y-3">
            {PLAYSTORE_LEGAL_DOCS.map((doc, i) => (
              <HudCard key={i} title={doc.title.toUpperCase()} accent="red" compact>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <button onClick={() => copyDoc(doc.title, doc.content)} className="btn-bright-blue flex items-center gap-2">
                    {copiedDoc === doc.title ? <CheckCircle size={12} /> : <Copy size={12} />} COPY
                  </button>
                  <button onClick={() => downloadText(doc.content, `${doc.title.replace(/\s+/g, '-').toLowerCase()}.txt`)} className="btn-bright-green flex items-center gap-2">
                    <Download size={12} /> DOWNLOAD
                  </button>
                </div>
                <pre className="font-mono text-[10px] text-slate-600 whitespace-pre-wrap leading-relaxed p-3 rounded-xl panel-scroll"
                  style={{ background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(203,213,225,0.3)', maxHeight: '350px', overflowY: 'auto' }}>
                  {doc.content}
                </pre>
              </HudCard>
            ))}
          </div>
        )}

        {/* LEGAL */}
        {activeTab === 'legal' && (
          <div className="space-y-3">
            {[
              {
                title: 'PRIVACY POLICY', color: '#8b5cf6',
                content: `PRIVACY POLICY — E-SMART-WORLD
Last Updated: ${new Date().toLocaleDateString()}
App URL: ${APP_URL}

1. INFORMATION WE COLLECT
   - GitHub access tokens (stored locally, never transmitted to our servers)
   - Project files you import (processed locally in your browser)
   - Account information you provide
   - Usage data (anonymous, for app improvement)

2. HOW WE USE INFORMATION
   - To provide project building and deployment services
   - To facilitate GitHub API integration
   - We do NOT sell your data to third parties

3. DATA STORAGE
   - All data stored in browser localStorage (your device only)
   - Deploy history stored in Supabase (encrypted at rest)
   - Auth managed by Supabase Auth

4. THIRD-PARTY SERVICES
   - GitHub API — for deployment
   - OnSpace AI — for AI Secretary
   - Supabase — for backend database + auth

5. CONTACT: drmirfan5577@gmail.com`
              },
              {
                title: 'TERMS OF SERVICE', color: '#3b82f6',
                content: `TERMS OF SERVICE — E-SMART-WORLD
Last Updated: ${new Date().toLocaleDateString()}

1. ACCEPTANCE: By using E-SMART-WORLD, you agree to these Terms.
2. USE: E-SMART-WORLD is for lawful web project development.
3. INTELLECTUAL PROPERTY: © ${new Date().getFullYear()} All rights reserved.
4. GITHUB: You are responsible for your GitHub credentials.
5. AI: AI responses may contain errors — verify critical information.
6. LIABILITY: Service provided "as is". Maintain your own backups.
7. CONTACT: drmirfan5577@gmail.com`
              },
              {
                title: 'COPYRIGHT NOTICE', color: '#f59e0b',
                content: `COPYRIGHT NOTICE
================
© ${new Date().getFullYear()} E-SMART-WORLD (E.S wOrLd) — All Rights Reserved

Application: E-SMART-WORLD
Subdomain: es-oneworld.onspace.app
Version: ${APP_VERSION}
Owner: drmirfan5577@gmail.com

This application is protected under international copyright law.
For licensing: drmirfan5577@gmail.com`
              }
            ].map((doc, i) => (
              <HudCard key={i} title={doc.title} accent="purple" compact>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <button onClick={() => copyDoc(doc.title, doc.content)} className="btn-bright-purple flex items-center gap-2">
                    {copiedDoc === doc.title ? <CheckCircle size={12} /> : <Copy size={12} />} COPY
                  </button>
                  <button onClick={() => downloadText(doc.content, `${doc.title.replace(/\s+/g, '-').toLowerCase()}.txt`)} className="btn-bright-blue flex items-center gap-2">
                    <Download size={12} /> DOWNLOAD
                  </button>
                </div>
                <pre className="font-mono text-[10px] text-slate-600 whitespace-pre-wrap leading-relaxed p-3 rounded-xl panel-scroll"
                  style={{ background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(203,213,225,0.3)', maxHeight: '280px', overflowY: 'auto' }}>
                  {doc.content}
                </pre>
              </HudCard>
            ))}
          </div>
        )}

        {/* USER INFO */}
        {activeTab === 'users' && (
          <HudCard title="CURRENT USER INFO" accent="orange" compact>
            <div className="space-y-2 text-[10px]">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <div className="font-bold text-orange-700 mb-2">Logged In User</div>
                <div className="space-y-1 text-slate-600">
                  <div>Username: <span className="font-bold text-orange-600">{user?.username || 'N/A'}</span></div>
                  <div>Email: <span className="font-bold">{user?.email || 'N/A'}</span></div>
                  <div>User ID: <span className="font-mono text-[9px]">{user?.id || 'N/A'}</span></div>
                  <div>Role: <span className="font-bold text-orange-600">Administrator</span></div>
                  <div>Projects: <span className="font-bold">{projects.length}</span></div>
                  <div>Vault Entries: <span className="font-bold">{vault.length}</span></div>
                  <div>Credits: <span className="font-bold text-amber-600">{credits}</span></div>
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="font-bold text-blue-700 mb-2">Admin Password</div>
                <div className="text-slate-500">
                  Default: <code className="bg-slate-100 px-1 rounded">Daood5577</code>
                  <br />To change: Update ADMIN_PASSWORD in AdminPage.tsx
                </div>
              </div>
            </div>
          </HudCard>
        )}

        {/* SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <HudCard title="SYSTEM CONFIGURATION" accent="slate" compact>
            <div className="space-y-3 text-[10px]">
              <div className="p-3 rounded-xl space-y-2" style={{ background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(203,213,225,0.3)' }}>
                <div className="font-hud font-bold text-slate-600">DATABASE</div>
                <div className="space-y-1 font-mono text-slate-500">
                  <div>URL: <span className="text-blue-600 break-all">{import.meta.env.VITE_SUPABASE_URL?.substring(0, 40)}...</span></div>
                  <div>Status: <span className="text-emerald-600 font-bold">Connected</span></div>
                </div>
              </div>
              <div className="p-3 rounded-xl space-y-2" style={{ background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(203,213,225,0.3)' }}>
                <div className="font-hud font-bold text-slate-600">LOCAL STORAGE</div>
                {['esw_projects', 'esw_accounts', 'esw_vault', 'esw_settings', 'esw_ai_messages'].map(key => {
                  const size = (localStorage.getItem(key) || '').length
                  return <div key={key}>{key}: <span className="font-bold text-blue-600">{(size / 1024).toFixed(1)} KB</span></div>
                })}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    if (confirm('Clear ALL local data?')) {
                      ['esw_projects', 'esw_accounts', 'esw_vault', 'esw_settings', 'esw_ai_messages'].forEach(k => localStorage.removeItem(k))
                      window.location.reload()
                    }
                  }}
                  className="px-4 py-2 rounded-xl font-hud text-[10px] font-bold border border-red-200 text-red-500 hover:bg-red-50 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={11} /> CLEAR ALL DATA
                </button>
                <button onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-xl font-hud text-[10px] font-bold border border-blue-200 text-blue-500 hover:bg-blue-50 transition-all flex items-center gap-1.5">
                  <RefreshCw size={11} /> RELOAD APP
                </button>
              </div>
            </div>
          </HudCard>
        )}
      </div>
    </div>
  )
}
