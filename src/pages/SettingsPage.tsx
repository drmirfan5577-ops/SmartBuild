import React, { useState } from 'react'
import { Settings, Lock, Github, Eye, EyeOff, CheckCircle, Palette } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { APP_NAME, APP_VERSION } from '@/constants'
import type { LockType } from '@/types'

const LOCK_TYPES: { id: LockType; label: string; desc: string }[] = [
  { id: '4digit', label: '4-Digit PIN', desc: 'Classic numeric PIN code' },
  { id: 'pattern', label: 'Pattern Lock', desc: 'Draw a pattern on a 3×3 grid' },
  { id: 'text', label: 'Text Password', desc: 'Full text-based password' },
  { id: 'none', label: 'No Lock', desc: 'Vault always unlocked (not recommended)' },
]

export function SettingsPage() {
  const { settings, updateSettings } = useApp()
  const [newCode, setNewCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [githubUser, setGithubUser] = useState(settings.githubUser)
  const [githubToken, setGithubToken] = useState(settings.githubToken)
  const [defaultRepo, setDefaultRepo] = useState(settings.defaultRepo)
  const [activeTab, setActiveTab] = useState<'security' | 'github' | 'about'>('security')

  const tabs = [
    { id: 'security', label: 'SECURITY', icon: Lock, color: '#8b5cf6' },
    { id: 'github', label: 'GITHUB', icon: Github, color: '#10b981' },
    { id: 'about', label: 'ABOUT', icon: Palette, color: '#f59e0b' },
  ]

  const saveSettings = () => {
    if (activeTab === 'security') {
      const code = newCode || settings.lockCode
      updateSettings({ lockType: settings.lockType, lockCode: code })
    } else if (activeTab === 'github') {
      updateSettings({ githubUser, githubToken, defaultRepo })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      <div
        className="w-36 flex-shrink-0 border-r flex flex-col"
        style={{ borderColor: 'rgba(148,163,184,0.15)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}
      >
        <div className="px-3 py-2.5 border-b border-slate-100">
          <div className="font-hud text-[10px] font-bold text-slate-600">SETTINGS</div>
        </div>
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className="flex items-center gap-2 px-3 py-3 border-l-[3px] text-left transition-all"
              style={{
                borderLeftColor: activeTab === t.id ? t.color : 'transparent',
                background: activeTab === t.id ? `${t.color}08` : 'transparent',
              }}
            >
              <Icon size={13} style={{ color: activeTab === t.id ? t.color : '#94a3b8' }} />
              <span className="font-hud text-[10px] font-bold" style={{ color: activeTab === t.id ? t.color : '#94a3b8' }}>
                {t.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex-1 p-3 overflow-hidden flex flex-col gap-3">
        {activeTab === 'security' && (
          <>
            <HudCard title="VAULT LOCK TYPE" accent="purple" compact>
              <div className="grid grid-cols-2 gap-2">
                {LOCK_TYPES.map(lt => (
                  <button
                    key={lt.id}
                    onClick={() => updateSettings({ lockType: lt.id })}
                    className="flex flex-col gap-0.5 p-3 rounded-2xl border text-left transition-all"
                    style={{
                      borderColor: settings.lockType === lt.id ? '#8b5cf6' : 'rgba(203,213,225,0.4)',
                      background: settings.lockType === lt.id ? 'rgba(139,92,246,0.08)' : 'rgba(248,250,252,0.8)',
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {settings.lockType === lt.id && <CheckCircle size={10} className="text-purple-500" />}
                      <span className="font-hud text-[10px] font-bold text-purple-700">{lt.label}</span>
                    </div>
                    <span className="text-[9px] text-slate-400">{lt.desc}</span>
                  </button>
                ))}
              </div>
            </HudCard>

            <HudCard title="CHANGE LOCK CODE" accent="blue" compact>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    className="input-hud pr-8"
                    type={showCode ? 'text' : 'password'}
                    placeholder={settings.lockType === '4digit' ? 'New 4-digit PIN' : 'New password/code'}
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    maxLength={settings.lockType === '4digit' ? 4 : 50}
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600" onClick={() => setShowCode(!showCode)}>
                    {showCode ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
                <input className="input-hud" type="password" placeholder="Confirm code" value={confirmCode} onChange={e => setConfirmCode(e.target.value)} maxLength={settings.lockType === '4digit' ? 4 : 50} />
                <div className="text-[10px] text-slate-400">Current lock: <span className="text-purple-600 font-bold">{settings.lockType}</span></div>
                <button className="btn-bright-blue w-full flex items-center justify-center gap-2" onClick={saveSettings} disabled={!!newCode && newCode !== confirmCode}>
                  {saved ? <><CheckCircle size={12} /> SAVED!</> : 'SAVE SECURITY SETTINGS'}
                </button>
                {newCode && newCode !== confirmCode && <div className="text-[10px] text-red-500">Codes do not match</div>}
              </div>
            </HudCard>
          </>
        )}

        {activeTab === 'github' && (
          <HudCard title="GITHUB CONFIGURATION" accent="green" compact>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-hud text-slate-500 mb-1 block">DEFAULT GITHUB USERNAME</label>
                <input className="input-hud" value={githubUser} onChange={e => setGithubUser(e.target.value)} placeholder="drmirfan5577" />
              </div>
              <div>
                <label className="text-[10px] font-hud text-slate-500 mb-1 block">DEFAULT REPOSITORY NAME</label>
                <input className="input-hud" value={defaultRepo} onChange={e => setDefaultRepo(e.target.value)} placeholder="E-SMART-WORLD" />
              </div>
              <div>
                <label className="text-[10px] font-hud text-slate-500 mb-1 block">GITHUB ACCESS TOKEN</label>
                <input className="input-hud" type="password" value={githubToken} onChange={e => setGithubToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxx" />
              </div>
              <button className="btn-bright-green w-full flex items-center justify-center gap-2" onClick={saveSettings}>
                {saved ? <><CheckCircle size={12} /> SAVED!</> : 'SAVE GITHUB SETTINGS'}
              </button>
            </div>
          </HudCard>
        )}

        {activeTab === 'about' && (
          <HudCard title="ABOUT E-SMART-WORLD" accent="gold" compact>
            <div className="space-y-3">
              <div
                className="text-center py-4 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)', backgroundSize: '200% 200%', animation: 'auroraShift 6s ease infinite' }}
              >
                <div className="font-hud text-xl font-black text-white drop-shadow mb-1">E-SMART-WORLD</div>
                <div className="font-hud text-sm text-white/80">E.S wOrLd</div>
                <div className="text-[10px] text-white/60 mt-1">{APP_VERSION}</div>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {[
                  { label: 'Account', value: 'drmirfan5577@gmail.com', color: '#3b82f6' },
                  { label: 'Repository', value: 'E-SMART-WORLD', color: '#10b981' },
                  { label: 'Framework', value: 'React + Vite + TypeScript', color: '#8b5cf6' },
                  { label: 'Styling', value: 'Tailwind CSS', color: '#f59e0b' },
                  { label: 'Layout', value: 'Mobile + Desktop', color: '#ec4899' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between p-2 rounded-xl" style={{ background: `${item.color}06` }}>
                    <span className="text-slate-500">{item.label}:</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-2xl text-[10px] text-slate-500" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                A complete AI-powered project builder, processor and GitHub deployer. Import ZIP/HTML/React Native projects, build them, and deploy to GitHub Pages with QR code generation.
              </div>
            </div>
          </HudCard>
        )}
      </div>
    </div>
  )
}
