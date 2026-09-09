import React, { useState, useRef } from 'react'
import {
  QrCode, Globe, Github, Share2, Download, Copy, CheckCircle,
  ExternalLink, Rocket, Code2, Calendar, Star, Eye, RefreshCw,
  Link, User, Smartphone, Monitor, Package
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'

function generateQR(url: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&color=3b82f6&bgcolor=FFFFFF&margin=10`
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function PortfolioPage() {
  const { projects, user } = useApp() as any
  const [activeView, setActiveView] = useState<'portfolio' | 'qr' | 'share'>('portfolio')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [qrSize, setQrSize] = useState(200)
  const [portfolioTitle, setPortfolioTitle] = useState(`${(user as any)?.username || 'My'} Projects`)
  const [portfolioDesc, setPortfolioDesc] = useState('Built with E-SMART-WORLD')

  const deployedProjects = projects.filter((p: any) => p.deployStatus === 'deployed' && p.downloadUrl)

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedUrl(id)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  // Generate a shareable portfolio HTML page
  const generatePortfolioHTML = () => {
    const projectCards = deployedProjects.map((p: any) => `
      <div class="card">
        <div class="card-icon">${p.type === 'html' ? '🌐' : p.type === 'react-native' ? '📱' : '📦'}</div>
        <h3>${p.name}</h3>
        <p>${p.type?.toUpperCase()} Project</p>
        <div class="links">
          ${p.downloadUrl ? `<a href="${p.downloadUrl}" target="_blank" class="btn-live">🚀 Live Site</a>` : ''}
          ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank" class="btn-repo">📦 Repository</a>` : ''}
        </div>
        ${p.downloadUrl ? `<img src="${generateQR(p.downloadUrl)}" alt="QR Code" class="qr"/>` : ''}
      </div>`).join('')

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${portfolioTitle}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #eff6ff, #f0fdf4, #fdf4ff); min-height: 100vh; padding: 40px 20px; }
  .header { text-align: center; margin-bottom: 40px; }
  .logo { font-size: 48px; margin-bottom: 16px; }
  h1 { font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .subtitle { color: #64748b; margin-top: 8px; }
  .badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(59,130,246,0.1); color: #2563eb; border: 1px solid rgba(59,130,246,0.2); border-radius: 100px; padding: 4px 12px; font-size: 11px; font-weight: 600; margin-top: 12px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; max-width: 1000px; margin: 0 auto; }
  .card { background: rgba(255,255,255,0.95); border-radius: 20px; padding: 24px; box-shadow: 0 8px 32px rgba(59,130,246,0.1); border: 1px solid rgba(255,255,255,0.9); text-align: center; }
  .card-icon { font-size: 40px; margin-bottom: 12px; }
  h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
  p { font-size: 12px; color: #64748b; margin-bottom: 16px; }
  .links { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
  .btn-live { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 600; }
  .btn-repo { background: rgba(30,41,59,0.1); color: #1e293b; text-decoration: none; padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 600; }
  .qr { width: 120px; height: 120px; border-radius: 12px; border: 2px solid rgba(59,130,246,0.2); }
  .footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 11px; }
  @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } h1 { font-size: 22px; } }
</style>
</head>
<body>
<div class="header">
  <div class="logo">🥭</div>
  <h1>${portfolioTitle}</h1>
  <p class="subtitle">${portfolioDesc}</p>
  <div class="badge">⚡ Built with E-SMART-WORLD</div>
</div>
<div class="grid">
${projectCards || '<p style="text-align:center;color:#94a3b8;grid-column:1/-1;padding:40px">No deployed projects yet</p>'}
</div>
<div class="footer">
  Generated by E-SMART-WORLD · ${new Date().toLocaleDateString()}
</div>
</body>
</html>`
  }

  const downloadPortfolio = () => {
    const html = generatePortfolioHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'portfolio.html'; a.click()
    URL.revokeObjectURL(url)
  }

  const selectedProj = projects.find((p: any) => p.id === selectedProject)

  return (
    <div className="h-full overflow-y-auto panel-scroll p-3 space-y-3">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(203,213,225,0.3)' }}>
        {[
          { id: 'portfolio', label: '🎨 Portfolio', icon: Monitor },
          { id: 'qr', label: '📱 QR Codes', icon: QrCode },
          { id: 'share', label: '🔗 Share & Export', icon: Share2 },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-hud text-[10px] font-bold transition-all"
              style={{
                background: activeView === tab.id ? 'rgba(255,255,255,0.95)' : 'transparent',
                color: activeView === tab.id ? '#3b82f6' : '#94a3b8',
                boxShadow: activeView === tab.id ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Icon size={11} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* PORTFOLIO VIEW */}
      {activeView === 'portfolio' && (
        <>
          <HudCard title="PORTFOLIO SETTINGS" accent="blue" compact>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-hud text-slate-500 mb-1 block">PORTFOLIO TITLE</label>
                <input className="input-hud text-[11px]" value={portfolioTitle} onChange={e => setPortfolioTitle(e.target.value)} placeholder="My Projects" />
              </div>
              <div>
                <label className="text-[10px] font-hud text-slate-500 mb-1 block">TAGLINE</label>
                <input className="input-hud text-[11px]" value={portfolioDesc} onChange={e => setPortfolioDesc(e.target.value)} placeholder="Built with E-SMART-WORLD" />
              </div>
            </div>
          </HudCard>

          <HudCard title={`MY PROJECTS (${deployedProjects.length} deployed)`} subtitle="Your deployed projects with live links" accent="green" compact>
            {deployedProjects.length === 0 ? (
              <div className="text-center py-8">
                <Rocket size={32} className="mx-auto mb-3 text-slate-200" />
                <div className="font-hud text-[11px] text-slate-400">No deployed projects yet</div>
                <div className="text-[10px] text-slate-300 mt-1">Deploy a project from the Deploy section</div>
              </div>
            ) : (
              <div className="space-y-2">
                {deployedProjects.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl border transition-all"
                    style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(203,213,225,0.3)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: 'rgba(59,130,246,0.08)' }}>
                          {p.type === 'html' ? '🌐' : p.type === 'react-native' ? '📱' : '📦'}
                        </div>
                        <div>
                          <div className="font-hud text-[11px] font-bold text-slate-700">{p.name}</div>
                          <div className="text-[9px] text-slate-400">{p.type?.toUpperCase()} · {formatRelativeTime(p.createdAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] px-2 py-0.5 rounded-full font-hud font-bold" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>LIVE</span>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {p.downloadUrl && (
                        <>
                          <a href={p.downloadUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-xl font-hud font-bold transition-all no-underline"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <Globe size={10} /> Live Site
                          </a>
                          <button onClick={() => copyText(p.downloadUrl, `live-${p.id}`)}
                            className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-xl font-hud font-bold transition-all"
                            style={{ background: 'rgba(59,130,246,0.08)', color: '#2563eb', border: '1px solid rgba(59,130,246,0.15)' }}>
                            {copiedUrl === `live-${p.id}` ? <CheckCircle size={10} /> : <Copy size={10} />} Copy URL
                          </button>
                        </>
                      )}
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-xl font-hud font-bold transition-all no-underline"
                          style={{ background: 'rgba(30,41,59,0.06)', color: '#334155', border: '1px solid rgba(30,41,59,0.1)' }}>
                          <Github size={10} /> Repo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </HudCard>
        </>
      )}

      {/* QR CODES VIEW */}
      {activeView === 'qr' && (
        <>
          <HudCard title="QR CODE GENERATOR" subtitle="Scan to open any deployed project" accent="pink" compact>
            <div>
              <label className="text-[10px] font-hud text-slate-500 mb-1 block">SELECT PROJECT</label>
              <select className="input-hud text-[11px]" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                <option value="">-- Select a project --</option>
                {projects.filter((p: any) => p.downloadUrl).map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.downloadUrl?.substring(0, 30)}...)</option>
                ))}
              </select>
            </div>
            {selectedProj?.downloadUrl && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <div className="p-4 rounded-2xl bg-white shadow-lg border border-blue-50">
                  <img
                    src={generateQR(selectedProj.downloadUrl)}
                    alt="QR Code"
                    style={{ width: qrSize, height: qrSize }}
                    className="rounded-xl"
                  />
                </div>
                <div className="text-center">
                  <div className="font-hud text-[11px] font-bold text-slate-700 mb-1">{selectedProj.name}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-xs">{selectedProj.downloadUrl}</div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-hud text-slate-500">SIZE:</label>
                  <input type="range" min={100} max={400} step={50} value={qrSize} onChange={e => setQrSize(Number(e.target.value))} className="w-28" />
                  <span className="text-[10px] text-slate-400">{qrSize}px</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = generateQR(selectedProj.downloadUrl)
                      a.download = `qr-${selectedProj.name}.png`
                      a.click()
                    }}
                    className="btn-bright-blue flex items-center gap-1.5"
                  >
                    <Download size={12} /> Download QR
                  </button>
                  <button
                    onClick={() => copyText(selectedProj.downloadUrl, 'qr-url')}
                    className="btn-ghost-bright flex items-center gap-1.5"
                  >
                    {copiedUrl === 'qr-url' ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    Copy URL
                  </button>
                  <a href={selectedProj.downloadUrl} target="_blank" rel="noreferrer"
                    className="btn-bright-green flex items-center gap-1.5 no-underline">
                    <ExternalLink size={12} /> Open
                  </a>
                </div>
              </div>
            )}
            {!selectedProject && (
              <div className="text-center py-8">
                <QrCode size={40} className="mx-auto mb-3 text-pink-200" />
                <div className="font-hud text-[11px] text-slate-400">Select a deployed project</div>
              </div>
            )}
          </HudCard>

          {/* All QR codes grid */}
          {deployedProjects.length > 0 && (
            <HudCard title="ALL QR CODES" accent="purple" compact>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {deployedProjects.map((p: any) => (
                  <div key={p.id} className="flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-100 gap-2">
                    <img src={generateQR(p.downloadUrl)} alt="QR" className="w-20 h-20 rounded-lg" />
                    <div className="font-hud text-[9px] font-bold text-slate-600 text-center truncate w-full">{p.name}</div>
                    <button onClick={() => copyText(p.downloadUrl, `all-${p.id}`)}
                      className="text-[9px] text-blue-500 hover:text-blue-700 transition-all">
                      {copiedUrl === `all-${p.id}` ? '✓ Copied' : 'Copy URL'}
                    </button>
                  </div>
                ))}
              </div>
            </HudCard>
          )}
        </>
      )}

      {/* SHARE & EXPORT VIEW */}
      {activeView === 'share' && (
        <>
          <HudCard title="PORTFOLIO PAGE GENERATOR" subtitle="Create a shareable portfolio webpage" accent="blue" compact>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-blue-100 bg-blue-50/50 text-center">
                <Package size={24} className="text-blue-500" />
                <div className="font-hud text-[10px] font-bold text-blue-700">{deployedProjects.length} Projects</div>
                <div className="text-[9px] text-slate-400">Ready to showcase</div>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-purple-100 bg-purple-50/50 text-center">
                <QrCode size={24} className="text-purple-500" />
                <div className="font-hud text-[10px] font-bold text-purple-700">QR Codes</div>
                <div className="text-[9px] text-slate-400">Auto-generated</div>
              </div>
            </div>
            <button onClick={downloadPortfolio} className="w-full btn-bright-blue flex items-center justify-center gap-2 py-2.5">
              <Download size={13} /> DOWNLOAD PORTFOLIO HTML
            </button>
            <div className="mt-2 text-[10px] text-slate-400 text-center">
              A beautiful standalone HTML page with all your projects, QR codes, and live links
            </div>
          </HudCard>

          <HudCard title="SHARE INDIVIDUAL PROJECTS" accent="green" compact>
            {deployedProjects.length === 0 ? (
              <div className="text-center py-6 text-[11px] text-slate-300">No deployed projects to share</div>
            ) : (
              <div className="space-y-2">
                {deployedProjects.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(203,213,225,0.3)' }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe size={12} className="text-emerald-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-hud text-[10px] font-bold text-slate-700 truncate">{p.name}</div>
                        <div className="text-[9px] text-slate-400 truncate">{p.downloadUrl}</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => copyText(p.downloadUrl, `share-${p.id}`)}
                        className="p-1.5 rounded-lg border border-blue-100 text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        {copiedUrl === `share-${p.id}` ? <CheckCircle size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      </button>
                      <a href={p.downloadUrl} target="_blank" rel="noreferrer"
                        className="p-1.5 rounded-lg border border-emerald-100 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </HudCard>
        </>
      )}
    </div>
  )
}
