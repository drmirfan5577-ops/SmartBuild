import React, { useState } from 'react'
import { History, Trash2, Rocket, CheckCircle, Clock, AlertTriangle, Globe } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

export function HistoryPage() {
  const { projects, deleteProject, navigate, setCurrentProject } = useApp()
  const [filter, setFilter] = useState<'all' | 'deployed' | 'ready' | 'error'>('all')

  const filtered = projects.filter(p => {
    if (filter === 'all') return true
    if (filter === 'deployed') return p.deployStatus === 'deployed'
    if (filter === 'ready') return p.status === 'ready'
    if (filter === 'error') return p.status === 'error'
    return true
  })

  const stats = {
    total: projects.length,
    deployed: projects.filter(p => p.deployStatus === 'deployed').length,
    ready: projects.filter(p => p.status === 'ready').length,
    error: projects.filter(p => p.status === 'error').length,
  }

  const filterButtons = [
    { id: 'all', label: 'ALL', count: stats.total, color: '#3b82f6' },
    { id: 'deployed', label: 'DEPLOYED', count: stats.deployed, color: '#10b981' },
    { id: 'ready', label: 'READY', count: stats.ready, color: '#f59e0b' },
    { id: 'error', label: 'ERRORS', count: stats.error, color: '#ef4444' },
  ]

  return (
    <div className="h-full flex flex-col p-3 gap-3 overflow-hidden">
      <HudCard accent="blue" compact>
        <div className="flex items-center gap-2 flex-wrap">
          <History size={14} className="text-blue-500" />
          <span className="font-hud text-xs text-blue-600">PROJECT HISTORY</span>
          <div className="ml-auto flex gap-1.5 flex-wrap">
            {filterButtons.map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full font-hud text-[10px] font-bold border transition-all"
                style={{
                  borderColor: filter === btn.id ? btn.color : `${btn.color}30`,
                  color: filter === btn.id ? '#fff' : btn.color,
                  background: filter === btn.id ? btn.color : `${btn.color}08`,
                }}
              >
                {btn.label} ({btn.count})
              </button>
            ))}
          </div>
        </div>
      </HudCard>

      <div className="flex-1 overflow-y-auto panel-scroll space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <History size={40} className="text-slate-200 mb-3" />
            <div className="font-hud text-sm text-slate-400">NO PROJECTS FOUND</div>
            <div className="text-[11px] text-slate-300 mt-1">Import a project to see it here</div>
            <button className="btn-bright-blue mt-3" onClick={() => navigate('import')}>GO TO IMPORT</button>
          </div>
        ) : filtered.map(p => (
          <div
            key={p.id}
            className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:shadow-md"
            style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(203,213,225,0.4)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: p.deployStatus === 'deployed' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.08)' }}>
              {p.deployStatus === 'deployed' ? <Rocket size={14} className="text-emerald-600" /> :
               p.status === 'ready' ? <CheckCircle size={14} className="text-amber-500" /> :
               p.status === 'error' ? <AlertTriangle size={14} className="text-red-500" /> :
               <Clock size={14} className="text-slate-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-bold text-sm text-slate-700 truncate">{p.name}</div>
                <StatusBadge status={p.status as any} />
                <StatusBadge status={p.deployStatus as any} />
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {p.type.toUpperCase()} · {p.files.length} file(s) · {p.createdAt}
              </div>
              {p.downloadUrl && (
                <a href={p.downloadUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline truncate block flex items-center gap-1">
                  <Globe size={9} /> {p.downloadUrl}
                </a>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="btn-bright-blue py-1 px-2.5 text-[10px]" onClick={() => { setCurrentProject(p); navigate('process') }}>
                OPEN
              </button>
              {p.deployStatus === 'deployed' && (
                <button className="btn-bright-pink py-1 px-2.5 text-[10px] rounded-xl font-hud font-bold text-[10px] transition-all"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#fff', boxShadow: '0 2px 8px rgba(236,72,153,0.3)' }}
                  onClick={() => { setCurrentProject(p); navigate('qr-codes') }}>
                  QR
                </button>
              )}
              <button onClick={() => deleteProject(p.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-all">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
