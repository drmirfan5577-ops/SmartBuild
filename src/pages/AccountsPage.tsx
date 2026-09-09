import React, { useState } from 'react'
import { Plus, Github, Cloud, Bot, ExternalLink, Trash2, CheckCircle, Link2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { SavedAccount } from '@/types'

const PLATFORMS = [
  { id: 'github', label: 'GitHub', icon: Github, color: '#10b981' },
  { id: 'expo', label: 'Expo Go', icon: Bot, color: '#8b5cf6' },
  { id: 'cloud', label: 'Cloud Storage', icon: Cloud, color: '#3b82f6' },
  { id: 'ai', label: 'AI Model', icon: Bot, color: '#f97316' },
] as const

export function AccountsPage() {
  const { accounts, addAccount, removeAccount } = useApp()
  const [selectedPlatform, setSelectedPlatform] = useState<SavedAccount['platform']>('github')
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!label.trim()) return
    addAccount({ platform: selectedPlatform, label, url, email, token, verified: false })
    setLabel(''); setUrl(''); setEmail(''); setToken('')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const platformAccounts = accounts.filter(a => a.platform === selectedPlatform)

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* Left */}
      <div className="w-40 flex-shrink-0 border-r flex flex-col" style={{ borderColor: 'rgba(148,163,184,0.15)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="px-3 py-2.5 border-b border-slate-100">
          <div className="font-hud text-[10px] font-bold text-blue-600">PLATFORMS</div>
        </div>
        {PLATFORMS.map(p => {
          const Icon = p.icon
          const count = accounts.filter(a => a.platform === p.id).length
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className="flex items-center gap-2 px-3 py-3 border-l-[3px] text-left transition-all"
              style={{
                borderLeftColor: selectedPlatform === p.id ? p.color : 'transparent',
                background: selectedPlatform === p.id ? `${p.color}08` : 'transparent',
              }}
            >
              <Icon size={14} style={{ color: p.color }} />
              <div className="flex-1">
                <div className="text-[10px] font-bold font-hud" style={{ color: p.color }}>{p.label}</div>
                <div className="text-[9px] text-slate-400">{count} saved</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col gap-3 p-3 overflow-hidden">
        <HudCard title="ADD ACCOUNT" subtitle={`Link a ${PLATFORMS.find(p => p.id === selectedPlatform)?.label} account`} accent="blue" compact>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-hud text-slate-500 mb-1 block">LABEL / NICKNAME</label>
              <input className="input-hud" placeholder="My GitHub Account" value={label} onChange={e => setLabel(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-hud text-slate-500 mb-1 block">EMAIL</label>
              <input className="input-hud" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-hud text-slate-500 mb-1 block">URL / PROFILE LINK</label>
              <input className="input-hud" placeholder="https://github.com/username" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
            {selectedPlatform === 'github' && (
              <div>
                <label className="text-[10px] font-hud text-slate-500 mb-1 block">ACCESS TOKEN</label>
                <input className="input-hud" type="password" placeholder="ghp_xxxxxx" value={token} onChange={e => setToken(e.target.value)} />
              </div>
            )}
          </div>
          <button
            className={`mt-2 btn-bright-blue flex items-center gap-2 ${added ? 'opacity-70' : ''}`}
            onClick={handleAdd}
            disabled={!label.trim()}
          >
            {added ? <CheckCircle size={12} /> : <Plus size={12} />}
            {added ? 'SAVED!' : 'SAVE ACCOUNT'}
          </button>
        </HudCard>

        <HudCard title="SAVED ACCOUNTS" accent="gold" className="flex-1">
          <div className="space-y-2 panel-scroll" style={{ maxHeight: '280px' }}>
            {platformAccounts.length === 0 ? (
              <div className="text-[11px] text-slate-300 text-center py-4">
                No {PLATFORMS.find(p=>p.id===selectedPlatform)?.label} accounts saved
              </div>
            ) : platformAccounts.map(acc => {
              const pCfg = PLATFORMS.find(p => p.id === acc.platform)!
              return (
                <div
                  key={acc.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl"
                  style={{ background: `${pCfg.color}06`, border: `1px solid ${pCfg.color}20` }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-700">{acc.label}</div>
                    {acc.email && <div className="text-[10px] text-slate-400">{acc.email}</div>}
                    {acc.url && (
                      <a href={acc.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 truncate block hover:underline">
                        {acc.url}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge status={acc.verified ? 'verified' : 'pending'} />
                    <button onClick={() => removeAccount(acc.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </HudCard>
      </div>
    </div>
  )
}
