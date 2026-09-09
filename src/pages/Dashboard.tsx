import React, { useState, useEffect } from 'react'
import {
  Zap, Upload, Layout, Cpu, Rocket, Clock, ArrowRight,
  BarChart3, Star, Globe, Sparkles, Plus, TrendingUp, Shield
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { NavSection } from '@/types'

const QUICK_ACTIONS = [
  { id: 'import', label: 'IMPORT PROJECT', icon: Upload, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.3)', desc: 'ZIP, HTML, paste code' },
  { id: 'templates', label: 'TEMPLATES', icon: Layout, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', glow: 'rgba(139,92,246,0.3)', desc: '50+ ready templates' },
  { id: 'process', label: 'BUILD & PROCESS', icon: Cpu, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: 'rgba(245,158,11,0.3)', desc: 'Compile & prepare' },
  { id: 'deploy', label: 'DEPLOY', icon: Rocket, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', glow: 'rgba(59,130,246,0.3)', desc: 'GitHub Pages + Expo' },
  { id: 'ai-secretary', label: 'AI SECRETARY', icon: Sparkles, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)', glow: 'rgba(236,72,153,0.3)', desc: 'Claude, GPT, Gemini' },
  { id: 'vault', label: 'SECURE VAULT', icon: Shield, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', glow: 'rgba(239,68,68,0.3)', desc: 'Links & credentials' },
]

const STATS = [
  { label: 'Projects', key: 'projects', icon: BarChart3, color: '#3b82f6' },
  { label: 'Deployed', key: 'deployed', icon: Rocket, color: '#10b981' },
  { label: 'Templates', key: 'templates', icon: Star, color: '#f59e0b' },
  { label: 'Accounts', key: 'accounts', icon: Globe, color: '#8b5cf6' },
]

export function Dashboard() {
  const { projects, accounts, navigate } = useApp()
  const [time, setTime] = useState(new Date())
  const [animIndex, setAnimIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setAnimIndex(i => (i + 1) % QUICK_ACTIONS.length), 2000)
    return () => clearInterval(t)
  }, [])

  const deployedCount = projects.filter(p => p.deployStatus === 'deployed').length
  const statsValues: Record<string, number> = {
    projects: projects.length,
    deployed: deployedCount,
    templates: 55,
    accounts: accounts.length,
  }

  const recentProjects = projects.slice(0, 5)

  return (
    <div className="h-full flex flex-col gap-3 p-3 overflow-y-auto panel-scroll">
      {/* Hero Header */}
      <div
        className="relative rounded-2xl overflow-hidden p-5 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 70%, #f5576c 100%)',
          backgroundSize: '200% 200%',
          animation: 'auroraShift 6s ease infinite',
          boxShadow: '0 8px 32px rgba(118,75,162,0.3), 0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {/* Sparkle particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-white/30 text-xs animate-twinkle"
              style={{
                left: `${10 + i * 9}%`,
                top: `${10 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              ✦
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center animate-glow-pulse">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <div className="font-hud text-lg font-black text-white leading-tight drop-shadow">E-SMART-WORLD</div>
              <div className="font-hud text-[9px] text-white/70">E.S wOrLd — Build. Deploy. Shine.</div>
            </div>
          </div>
          <div className="text-white/80 text-[11px]">
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="relative z-10 text-right hidden sm:block">
          <div className="font-hud text-3xl font-black text-white/90 drop-shadow">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="font-hud text-[10px] text-white/60">
            {time.toLocaleTimeString('en-US', { second: '2-digit' })} LIVE
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.key}
            className="rounded-2xl p-3 text-center"
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: `1px solid ${stat.color}20`,
              boxShadow: `0 4px 16px ${stat.color}12`,
            }}
          >
            <div className="text-xl font-black" style={{ color: stat.color }}>{statsValues[stat.key]}</div>
            <div className="font-hud text-[9px] text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <HudCard title="QUICK LAUNCH" accent="blue" compact>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={() => navigate(action.id as NavSection)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 group"
                style={{
                  background: i === animIndex ? `${action.color}12` : 'rgba(248,250,252,0.8)',
                  border: `1px solid ${action.color}${i === animIndex ? '40' : '20'}`,
                  boxShadow: i === animIndex ? `0 4px 16px ${action.glow}` : 'none',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: action.gradient, boxShadow: `0 4px 12px ${action.glow}` }}
                >
                  <Icon size={18} className="text-white" />
                </div>
                <div className="font-hud text-[9px] font-bold text-center leading-tight" style={{ color: action.color }}>
                  {action.label}
                </div>
                <div className="text-[8px] text-slate-400 text-center leading-tight">{action.desc}</div>
              </button>
            )
          })}
        </div>
      </HudCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Recent Projects */}
        <HudCard title="RECENT PROJECTS" accent="green" compact className="flex-1">
          {recentProjects.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Plus size={20} className="text-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-400 text-center">No projects yet.<br />Import your first project!</div>
              <button className="btn-bright-green text-[10px] flex items-center gap-1" onClick={() => navigate('import')}>
                <Upload size={11} /> IMPORT NOW
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentProjects.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate('process')}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-all hover:bg-slate-50 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Globe size={12} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-slate-700 truncate">{p.name}</div>
                    <StatusBadge status={(p.deployStatus || p.status) as any} />
                  </div>
                  <ArrowRight size={12} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
                </button>
              ))}
              {projects.length > 5 && (
                <div className="text-[10px] text-slate-400 text-center pt-1">+{projects.length - 5} more projects</div>
              )}
            </div>
          )}
        </HudCard>

        {/* Activity / Tips */}
        <HudCard title="GETTING STARTED" accent="purple" compact className="flex-1">
          <div className="space-y-2">
            {[
              { step: 1, label: 'Import your project', desc: 'ZIP, HTML, paste code, or use a template', nav: 'import', color: '#10b981' },
              { step: 2, label: 'Build & Process', desc: 'Detect framework, compile & validate', nav: 'process', color: '#f59e0b' },
              { step: 3, label: 'Deploy to GitHub', desc: 'Push to repo + enable GitHub Pages', nav: 'deploy', color: '#3b82f6' },
              { step: 4, label: 'Get QR Code', desc: 'Share your live site with a QR link', nav: 'qr-codes', color: '#ec4899' },
            ].map(s => (
              <button
                key={s.step}
                onClick={() => navigate(s.nav as NavSection)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all hover:bg-slate-50 group"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center font-hud text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: s.color }}
                >
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-slate-700">{s.label}</div>
                  <div className="text-[9px] text-slate-400">{s.desc}</div>
                </div>
                <ArrowRight size={11} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
              </button>
            ))}
          </div>
        </HudCard>
      </div>
    </div>
  )
}
