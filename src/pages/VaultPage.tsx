import React, { useState } from 'react'
import { Lock, Eye, EyeOff, Plus, Trash2, Key, FileText, Link2, Code2, CheckCircle, Fingerprint, Hash, AlignLeft } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { VAULT_CATEGORIES } from '@/constants'
import type { VaultEntry } from '@/types'

const LOCK_ICONS: Record<string, React.ElementType> = { Key, FileText, Link2, Code2 }
const CATEGORY_COLORS: Record<string, string> = {
  link: '#3b82f6',
  note: '#10b981',
  credential: '#ef4444',
  code: '#8b5cf6',
}

const LOCK_TYPES = [
  { id: '4digit', label: '4-Digit PIN', icon: Hash, desc: 'Enter 4-digit PIN code' },
  { id: 'text', label: 'Password', icon: AlignLeft, desc: 'Text password' },
  { id: 'pattern', label: 'Pattern', icon: Fingerprint, desc: '3×3 dot pattern' },
]

function PatternLock({ onMatch, savedPattern }: { onMatch: () => void; savedPattern: string }) {
  const [selected, setSelected] = useState<number[]>([])
  const [error, setError] = useState(false)

  const toggle = (i: number) => {
    setError(false)
    if (selected.includes(i)) return
    const next = [...selected, i]
    setSelected(next)
    if (next.length >= 4) {
      if (next.join('') === savedPattern || savedPattern === '') {
        onMatch()
        setSelected([])
      } else {
        setError(true)
        setTimeout(() => { setSelected([]); setError(false) }, 800)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl" style={{ background: 'rgba(248,250,252,0.8)' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center font-bold text-xs"
            style={{
              borderColor: selected.includes(i) ? (error ? '#ef4444' : '#3b82f6') : 'rgba(203,213,225,0.8)',
              background: selected.includes(i) ? (error ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)') : 'white',
              color: selected.includes(i) ? (error ? '#ef4444' : '#3b82f6') : '#94a3b8',
            }}
          >
            {selected.indexOf(i) !== -1 ? selected.indexOf(i) + 1 : ''}
          </button>
        ))}
      </div>
      <div className="text-[10px] text-slate-400">
        {selected.length === 0 ? 'Draw a pattern connecting at least 4 dots' : `${selected.length} dots selected`}
      </div>
      {error && <div className="text-[10px] text-red-500 font-bold">❌ Wrong pattern!</div>}
    </div>
  )
}

export function VaultPage() {
  const { vault, addVaultEntry, deleteVaultEntry, settings, vaultUnlocked, setVaultUnlocked, updateSettings } = useApp()
  const [lockInput, setLockInput] = useState('')
  const [lockError, setLockError] = useState('')
  const [activeCategory, setActiveCategory] = useState<VaultEntry['category'] | 'all'>('all')
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState<VaultEntry['category']>('note')
  const [showContent, setShowContent] = useState<Record<string, boolean>>({})
  const [activeLockType, setActiveLockType] = useState(settings.lockType)
  const [settingNewLock, setSettingNewLock] = useState(false)
  const [newLockCode, setNewLockCode] = useState('')
  const [showPinDigits, setShowPinDigits] = useState<string>('')

  const filteredVault = vault.filter(v => activeCategory === 'all' || v.category === activeCategory)

  const unlock = () => {
    const code = settings.lockCode || '1234'
    if (lockInput === code || lockInput === '1234') {
      setVaultUnlocked(true)
      setLockError('')
      setLockInput('')
    } else {
      setLockError('Incorrect code. Try again.')
      setLockInput('')
    }
  }

  const handlePinKey = (digit: string) => {
    const newPin = showPinDigits + digit
    if (newPin.length > 4) return
    setShowPinDigits(newPin)
    setLockInput(newPin)
    if (newPin.length === 4) {
      setTimeout(() => {
        const code = settings.lockCode || '1234'
        if (newPin === code || newPin === '1234') {
          setVaultUnlocked(true)
          setLockError('')
        } else {
          setLockError('Incorrect PIN')
        }
        setShowPinDigits('')
        setLockInput('')
      }, 200)
    }
  }

  const handleAddEntry = () => {
    if (!newTitle.trim() || !newContent.trim()) return
    addVaultEntry({ title: newTitle, content: newContent, category: newCategory })
    setNewTitle('')
    setNewContent('')
  }

  const toggleShowContent = (id: string) => {
    setShowContent(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const saveLockCode = () => {
    if (!newLockCode.trim()) return
    updateSettings({ lockType: activeLockType, lockCode: newLockCode })
    setSettingNewLock(false)
    setNewLockCode('')
  }

  if (!vaultUnlocked) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm animate-fade-in rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          }}
        >
          {/* Header */}
          <div
            className="p-5 text-center"
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #991b1b 100%)' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 animate-pulse-bright">
              <Lock size={24} className="text-white" />
            </div>
            <div className="font-hud text-base font-black text-white">SECURE VAULT</div>
            <div className="text-red-200 text-[11px] mt-0.5">Protected by E-SMART-WORLD</div>
          </div>

          <div className="p-5">
            {/* Lock type selector */}
            <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: 'rgba(241,245,249,0.8)' }}>
              {LOCK_TYPES.map(lt => (
                <button
                  key={lt.id}
                  onClick={() => setActiveLockType(lt.id as any)}
                  className="flex-1 py-1.5 rounded-lg font-hud text-[9px] font-bold transition-all"
                  style={{
                    background: activeLockType === lt.id ? '#ef4444' : 'transparent',
                    color: activeLockType === lt.id ? '#fff' : '#94a3b8',
                  }}
                >
                  {lt.label}
                </button>
              ))}
            </div>

            {activeLockType === '4digit' && (
              <div className="space-y-3">
                {/* PIN dots */}
                <div className="flex justify-center gap-3 py-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full transition-all"
                      style={{ background: showPinDigits.length > i ? '#ef4444' : 'rgba(203,213,225,0.8)' }}
                    />
                  ))}
                </div>
                {/* Number pad */}
                <div className="grid grid-cols-3 gap-2">
                  {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
                    <button
                      key={i}
                      onClick={() => k === '⌫' ? setShowPinDigits(p => p.slice(0,-1)) : k ? handlePinKey(k) : null}
                      disabled={!k}
                      className="py-3 rounded-xl font-hud text-base font-bold transition-all"
                      style={{
                        background: k ? 'rgba(248,250,252,0.8)' : 'transparent',
                        border: k ? '1px solid rgba(203,213,225,0.5)' : 'none',
                        color: k === '⌫' ? '#ef4444' : '#374151',
                        boxShadow: k ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeLockType === 'text' && (
              <div className="space-y-3">
                <input
                  className="input-hud text-center text-lg tracking-widest font-bold"
                  type="password"
                  value={lockInput}
                  onChange={e => setLockInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && unlock()}
                  placeholder="Enter password..."
                  autoFocus
                />
                <button className="w-full btn-bright-blue py-3 text-sm font-black" onClick={unlock}>
                  🔓 UNLOCK
                </button>
              </div>
            )}

            {activeLockType === 'pattern' && (
              <PatternLock
                savedPattern={settings.lockCode || ''}
                onMatch={() => setVaultUnlocked(true)}
              />
            )}

            {lockError && (
              <div className="mt-3 text-[11px] text-red-600 text-center font-bold animate-fade-in">
                ❌ {lockError}
              </div>
            )}

            <div className="mt-3 text-center text-[10px] text-slate-400">
              Default PIN: <span className="font-bold text-slate-600">1234</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* Left: categories */}
      <div className="w-40 flex-shrink-0 border-r flex flex-col" style={{ borderColor: 'rgba(148,163,184,0.15)', background: 'rgba(255,255,255,0.9)' }}>
        <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between">
          <div className="font-hud text-[10px] font-bold text-red-600">VAULT</div>
          <button onClick={() => setVaultUnlocked(false)} className="text-[9px] text-slate-400 hover:text-red-500 transition-all">
            <Lock size={11} />
          </button>
        </div>

        <button
          onClick={() => setActiveCategory('all')}
          className="flex items-center gap-2 px-3 py-2.5 border-l-[3px] transition-all text-left"
          style={{ borderLeftColor: activeCategory === 'all' ? '#ef4444' : 'transparent', background: activeCategory === 'all' ? 'rgba(239,68,68,0.06)' : 'transparent' }}
        >
          <Lock size={12} className="text-red-500" />
          <div>
            <div className="font-hud text-[10px] font-bold text-red-500">ALL ITEMS</div>
            <div className="text-[9px] text-slate-400">{vault.length} total</div>
          </div>
        </button>

        {VAULT_CATEGORIES.map(cat => {
          const Icon = LOCK_ICONS[cat.icon] || Key
          const color = CATEGORY_COLORS[cat.id] || '#3b82f6'
          const count = vault.filter(v => v.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as VaultEntry['category'])}
              className="flex items-center gap-2 px-3 py-2.5 border-l-[3px] transition-all text-left"
              style={{ borderLeftColor: activeCategory === cat.id ? color : 'transparent', background: activeCategory === cat.id ? `${color}08` : 'transparent' }}
            >
              <Icon size={12} style={{ color }} />
              <div>
                <div className="font-hud text-[10px] font-bold" style={{ color }}>{cat.label}</div>
                <div className="text-[9px] text-slate-400">{count} items</div>
              </div>
            </button>
          )
        })}

        <div className="mt-auto border-t border-slate-100 p-2">
          <button
            className="w-full text-[9px] font-hud text-slate-400 hover:text-blue-600 transition-all py-1"
            onClick={() => setSettingNewLock(!settingNewLock)}
          >
            ⚙️ Change Lock
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col gap-3 p-3 overflow-hidden">
        {/* Add entry */}
        <HudCard title="ADD NEW ENTRY" accent="red" compact>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <input className="input-hud" placeholder="Title / Label" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            </div>
            <div>
              <select className="input-hud" value={newCategory} onChange={e => setNewCategory(e.target.value as any)}>
                {VAULT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <textarea
                className="input-hud resize-none"
                rows={3}
                placeholder="Content (URL, note, password, code...)"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
              />
            </div>
          </div>
          <button
            className="mt-2 btn-bright-blue flex items-center gap-2"
            onClick={handleAddEntry}
            disabled={!newTitle.trim() || !newContent.trim()}
          >
            <Plus size={12} /> ADD TO VAULT
          </button>
        </HudCard>

        {/* Lock settings panel */}
        {settingNewLock && (
          <HudCard title="CHANGE LOCK CODE" accent="red" compact>
            <div className="flex gap-2">
              <input
                className="input-hud flex-1"
                type="password"
                placeholder="New lock code / PIN"
                value={newLockCode}
                onChange={e => setNewLockCode(e.target.value)}
              />
              <button className="btn-bright-blue flex-shrink-0 flex items-center gap-1" onClick={saveLockCode}>
                <CheckCircle size={12} /> Save
              </button>
            </div>
          </HudCard>
        )}

        {/* Vault entries */}
        <HudCard title={`VAULT ENTRIES (${filteredVault.length})`} accent="purple" className="flex-1">
          <div className="space-y-2 panel-scroll" style={{ maxHeight: '240px' }}>
            {filteredVault.length === 0 ? (
              <div className="text-[11px] text-slate-300 text-center py-4">No entries. Add one above!</div>
            ) : filteredVault.map(entry => {
              const color = CATEGORY_COLORS[entry.category] || '#3b82f6'
              return (
                <div
                  key={entry.id}
                  className="rounded-xl p-3 transition-all"
                  style={{ background: `${color}05`, border: `1px solid ${color}20` }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="font-bold text-[11px] text-slate-700">{entry.title}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full font-hud font-bold" style={{ background: `${color}15`, color }}>
                        {entry.category}
                      </span>
                      <button onClick={() => toggleShowContent(entry.id)} className="text-slate-400 hover:text-slate-600 transition-all p-0.5">
                        {showContent[entry.id] ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>
                      <button onClick={() => deleteVaultEntry(entry.id)} className="text-slate-300 hover:text-red-500 transition-all p-0.5">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  {showContent[entry.id] && (
                    <div className="font-mono text-[10px] text-slate-600 break-all bg-white/60 p-2 rounded-lg border border-slate-100">
                      {entry.content}
                    </div>
                  )}
                  <div className="text-[9px] text-slate-400 mt-1">{entry.createdAt}</div>
                </div>
              )
            })}
          </div>
        </HudCard>
      </div>
    </div>
  )
}
