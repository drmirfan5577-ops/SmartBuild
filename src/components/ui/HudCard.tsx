import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface HudCardProps {
  className?: string
  children: React.ReactNode
  title?: string
  subtitle?: string
  accent?: 'cyan' | 'gold' | 'green' | 'red' | 'purple' | 'orange' | 'blue' | 'pink' | 'slate'
  compact?: boolean
}

const accentColors = {
  cyan: { border: '#06b6d4', bg: 'rgba(6,182,212,0.06)', label: '#0891b2', badge: 'rgba(6,182,212,0.1)', shadow: 'rgba(6,182,212,0.15)' },
  gold: { border: '#f59e0b', bg: 'rgba(245,158,11,0.06)', label: '#d97706', badge: 'rgba(245,158,11,0.1)', shadow: 'rgba(245,158,11,0.15)' },
  green: { border: '#10b981', bg: 'rgba(16,185,129,0.06)', label: '#059669', badge: 'rgba(16,185,129,0.1)', shadow: 'rgba(16,185,129,0.15)' },
  red: { border: '#ef4444', bg: 'rgba(239,68,68,0.06)', label: '#dc2626', badge: 'rgba(239,68,68,0.1)', shadow: 'rgba(239,68,68,0.15)' },
  purple: { border: '#8b5cf6', bg: 'rgba(139,92,246,0.06)', label: '#7c3aed', badge: 'rgba(139,92,246,0.1)', shadow: 'rgba(139,92,246,0.15)' },
  orange: { border: '#f97316', bg: 'rgba(249,115,22,0.06)', label: '#ea580c', badge: 'rgba(249,115,22,0.1)', shadow: 'rgba(249,115,22,0.15)' },
  blue: { border: '#3b82f6', bg: 'rgba(59,130,246,0.06)', label: '#2563eb', badge: 'rgba(59,130,246,0.1)', shadow: 'rgba(59,130,246,0.15)' },
  pink: { border: '#ec4899', bg: 'rgba(236,72,153,0.06)', label: '#db2777', badge: 'rgba(236,72,153,0.1)', shadow: 'rgba(236,72,153,0.15)' },
  slate: { border: '#64748b', bg: 'rgba(100,116,139,0.06)', label: '#475569', badge: 'rgba(100,116,139,0.1)', shadow: 'rgba(100,116,139,0.1)' },
}

export function HudCard({ className, children, title, subtitle, accent = 'blue', compact = false }: HudCardProps) {
  const colors = accentColors[accent]
  return (
    <div
      className={cn('rounded-2xl relative overflow-hidden', className)}
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: `1px solid ${colors.border}30`,
        boxShadow: `0 4px 20px ${colors.shadow}, 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)` }}
      />
      {(title || subtitle) && (
        <div
          className={cn('border-b', compact ? 'px-3 py-2.5' : 'px-4 py-3')}
          style={{ borderColor: `${colors.border}15`, background: colors.bg }}
        >
          {title && (
            <div className="font-hud text-[11px] font-bold" style={{ color: colors.label }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div className="text-[10px] text-slate-400 mt-0.5">{subtitle}</div>
          )}
        </div>
      )}
      <div className={compact ? 'p-3' : 'p-4'}>
        {children}
      </div>
    </div>
  )
}
