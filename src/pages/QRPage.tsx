import React, { useState } from 'react'
import { QrCode, Copy, ExternalLink, Download, CheckCircle, Globe } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { generateQRUrl } from '@/lib/utils'
import type { Project } from '@/types'

export function QRPage() {
  const { projects } = useApp()
  const [selected, setSelected] = useState<Project | null>(projects.find(p => p.deployStatus === 'deployed') || null)
  const [customUrl, setCustomUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const deployedProjects = projects.filter(p => p.deployStatus === 'deployed')
  const activeUrl = selected?.downloadUrl || customUrl

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* Left */}
      <div
        className="w-44 flex-shrink-0 border-r flex flex-col"
        style={{ borderColor: 'rgba(148,163,184,0.15)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}
      >
        <div className="px-3 py-2.5 border-b border-slate-100">
          <div className="font-hud text-[10px] font-bold text-pink-600">DEPLOYED</div>
        </div>
        <div className="flex-1 overflow-y-auto panel-scroll py-1">
          {deployedProjects.length === 0 ? (
            <div className="p-3 text-[10px] text-slate-300 text-center">No deployed projects yet</div>
          ) : deployedProjects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="w-full flex flex-col gap-1 px-3 py-2.5 text-left border-l-[3px] transition-all"
              style={{
                borderLeftColor: selected?.id === p.id ? '#ec4899' : 'transparent',
                background: selected?.id === p.id ? 'rgba(236,72,153,0.06)' : 'transparent',
              }}
            >
              <div className="text-[10px] font-bold text-slate-700 truncate">{p.name}</div>
              <div className="text-[9px] text-emerald-600 truncate">{p.downloadUrl}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
        <HudCard title="GENERATE QR CODE" accent="pink" compact>
          <div className="flex gap-2 items-center">
            <input
              className="input-hud flex-1"
              placeholder="Enter any URL to generate QR code..."
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
            />
            {deployedProjects.length > 0 && (
              <div className="text-[10px] text-slate-400 whitespace-nowrap">or select left</div>
            )}
          </div>
        </HudCard>

        {activeUrl ? (
          <div className="flex gap-3 flex-1 overflow-hidden">
            <HudCard title="QR CODE" accent="pink" className="flex-shrink-0">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="p-3 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.06))', border: '1px solid rgba(236,72,153,0.2)' }}
                >
                  <img
                    src={generateQRUrl(activeUrl)}
                    alt="QR Code"
                    className="w-36 h-36 sm:w-48 sm:h-48 rounded-xl"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <div className="font-hud text-[9px] text-pink-600 text-center">SCAN TO ACCESS PROJECT</div>
              </div>
            </HudCard>

            <div className="flex-1 flex flex-col gap-3">
              <HudCard title="DEPLOYMENT LINKS" accent="blue" compact>
                <div className="space-y-2">
                  <div>
                    <div className="text-[10px] text-slate-400 mb-1">LIVE URL</div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <Globe size={11} className="text-blue-400 flex-shrink-0" />
                      <span className="text-[10px] text-blue-700 flex-1 truncate">{activeUrl}</span>
                      <button onClick={() => copyToClipboard(activeUrl)} className="text-slate-400 hover:text-blue-600 transition-all">
                        {copied ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                      <a href={activeUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-all">
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {selected?.repoUrl && (
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">GITHUB REPO</div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <span className="text-[10px] text-emerald-700 flex-1 truncate">{selected.repoUrl}</span>
                        <button onClick={() => copyToClipboard(selected.repoUrl!)} className="text-slate-400 hover:text-emerald-600 transition-all">
                          <Copy size={12} />
                        </button>
                        <a href={selected.repoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-600 transition-all">
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </HudCard>

              <HudCard title="DOWNLOAD OPTIONS" accent="green" compact>
                <div className="grid grid-cols-2 gap-2">
                  <a href={generateQRUrl(activeUrl)} download="qrcode.png"
                    className="btn-bright-blue flex items-center justify-center gap-1 text-center py-2 no-underline">
                    <Download size={11} /> QR PNG
                  </a>
                  <button onClick={() => copyToClipboard(generateQRUrl(activeUrl))}
                    className="btn-bright-gold flex items-center justify-center gap-1">
                    <Copy size={11} /> QR LINK
                  </button>
                </div>
              </HudCard>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <QrCode size={48} className="mx-auto mb-3 text-slate-200" />
              <div className="font-hud text-sm text-slate-400">ENTER A URL OR SELECT A DEPLOYED PROJECT</div>
              <div className="text-[11px] text-slate-300 mt-1">Generate instant QR codes for any link</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
