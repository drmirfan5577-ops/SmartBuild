import React, { useState } from 'react'
import {
  Cpu, Play, CheckCircle, FileCode, Package, Sparkles, Wand2,
  RefreshCw, Copy, Zap, ArrowRight, Layers, Star, X, Eye
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { simulateProcessing, generateId, formatDate } from '@/lib/utils'
import type { Project } from '@/types'

const PROCESS_STEPS = [
  'Scanning project structure...',
  'Detecting framework & dependencies...',
  'Resolving file paths & sequences...',
  'Adjusting import references...',
  'Compiling build configuration...',
  'Validating output bundle...',
  'Generating project manifest...',
  'Build complete!',
]

const PROJECT_TYPES = [
  { id: 'html', label: 'HTML / CSS / JS', icon: FileCode, color: '#f97316' },
  { id: 'react', label: 'React App', icon: Package, color: '#3b82f6' },
  { id: 'react-native', label: 'React Native / Expo', icon: Cpu, color: '#8b5cf6' },
  { id: 'zip', label: 'ZIP Package', icon: Package, color: '#f59e0b' },
]

// Variation configs
const VARIATION_THEMES = [
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    colors: { primary: '#1e3a5f', accent: '#38bdf8', bg: '#0f172a', text: '#f1f5f9', surface: '#1e293b' },
    font: 'Inter',
    style: 'Modern dark professional',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    colors: { primary: '#14532d', accent: '#4ade80', bg: '#f0fdf4', text: '#052e16', surface: '#dcfce7' },
    font: 'Georgia',
    style: 'Natural organic',
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    colors: { primary: '#4c1d95', accent: '#c084fc', bg: '#faf5ff', text: '#2e1065', surface: '#ede9fe' },
    font: 'Helvetica Neue',
    style: 'Elegant luxury',
  },
  {
    id: 'fiery-red',
    name: 'Fiery Red',
    colors: { primary: '#7f1d1d', accent: '#f87171', bg: '#fff1f2', text: '#450a0a', surface: '#fee2e2' },
    font: 'Arial Black',
    style: 'Bold energetic',
  },
  {
    id: 'golden-sunset',
    name: 'Golden Sunset',
    colors: { primary: '#78350f', accent: '#fbbf24', bg: '#fffbeb', text: '#451a03', surface: '#fef3c7' },
    font: 'Trebuchet MS',
    style: 'Warm premium',
  },
]

function applyThemeVariation(
  code: string,
  theme: typeof VARIATION_THEMES[0],
  variationNum: number
): string {
  let result = code

  // Inject theme CSS variables
  const themeCSS = `
    :root {
      --primary: ${theme.colors.primary};
      --accent: ${theme.colors.accent};
      --bg: ${theme.colors.bg};
      --text: ${theme.colors.text};
      --surface: ${theme.colors.surface};
      --font: '${theme.font}', sans-serif;
    }
  `
  // Replace common colors
  result = result
    .replace(/#0f172a/gi, theme.colors.bg)
    .replace(/#1e293b/gi, theme.colors.surface)
    .replace(/#38bdf8/gi, theme.colors.accent)
    .replace(/#f1f5f9/gi, theme.colors.text)
    .replace(/background:#fff/gi, `background:${theme.colors.bg}`)

  // Add theme vars before </head> or at start
  if (result.includes('<head>')) {
    result = result.replace('<head>', `<head>\n<style>${themeCSS}</style>`)
  }

  // Add variation watermark
  if (result.includes('</body>')) {
    result = result.replace('</body>', `
<div style="position:fixed;bottom:8px;right:8px;font-size:9px;color:${theme.colors.accent};opacity:0.5;font-family:monospace;">
  Variation ${variationNum}: ${theme.name}
</div>
</body>`)
  }

  return result
}

export function ProcessPage() {
  const { projects, currentProject, updateProject, addProject, navigate } = useApp()
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState(currentProject?.id || '')
  const [activeTab, setActiveTab] = useState<'build' | 'variations' | 'preview'>('build')
  const [generatingVariations, setGeneratingVariations] = useState(false)
  const [variations, setVariations] = useState<{ id: string; name: string; theme: typeof VARIATION_THEMES[0]; project: Project; copied: boolean }[]>([])
  const [previewVariation, setPreviewVariation] = useState<(typeof variations)[0] | null>(null)
  const [varProgress, setVarProgress] = useState(0)
  const [variationCount, setVariationCount] = useState(5)

  const selected = projects.find(p => p.id === selectedProjectId) || currentProject

  const startProcessing = async () => {
    if (!selected) return
    setProcessing(true)
    setLogs([])
    setProgress(0)
    updateProject(selected.id, { status: 'analyzing' })

    await simulateProcessing(PROCESS_STEPS, (step, prog) => {
      setCurrentStep(step)
      setProgress(prog)
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`])
      if (prog > 30) updateProject(selected.id, { status: 'processing' })
    })

    updateProject(selected.id, { status: 'ready' })
    setProcessing(false)
    setCurrentStep('✓ Build Successful')
  }

  const generateVariations = async () => {
    if (!selected) return
    setGeneratingVariations(true)
    setVariations([])
    setVarProgress(0)

    const mainCode = selected.files[0]?.content || `<!DOCTYPE html><html><head><title>${selected.name}</title></head><body><h1>${selected.name}</h1></body></html>`
    const selectedThemes = VARIATION_THEMES.slice(0, variationCount)
    const newVariations: typeof variations = []

    for (let i = 0; i < selectedThemes.length; i++) {
      await new Promise(r => setTimeout(r, 600))
      setVarProgress(Math.round(((i + 1) / selectedThemes.length) * 100))

      const theme = selectedThemes[i]
      const varCode = applyThemeVariation(mainCode, theme, i + 1)
      const varProject: Project = {
        id: generateId(),
        name: `${selected.name} — ${theme.name}`,
        type: selected.type,
        status: 'ready',
        deployStatus: 'idle',
        files: [{ name: 'index.html', path: '/', content: varCode, type: 'text/html', size: varCode.length }],
        createdAt: formatDate(),
      }
      newVariations.push({ id: varProject.id, name: varProject.name, theme, project: varProject, copied: false })
    }

    setVariations(newVariations)
    setGeneratingVariations(false)
    setActiveTab('variations')
  }

  const importVariation = (v: typeof variations[0]) => {
    addProject(v.project)
  }

  const importAllVariations = () => {
    variations.forEach(v => addProject(v.project))
    navigate('deploy')
  }

  const copyVariationCode = (v: typeof variations[0]) => {
    navigator.clipboard.writeText(v.project.files[0]?.content || '')
    setVariations(prev => prev.map(x => x.id === v.id ? { ...x, copied: true } : x))
    setTimeout(() => setVariations(prev => prev.map(x => x.id === v.id ? { ...x, copied: false } : x)), 2000)
  }

  const tabs = [
    { id: 'build', label: 'BUILD', icon: Cpu },
    { id: 'variations', label: `VARIATIONS ${variations.length > 0 ? `(${variations.length})` : ''}`, icon: Layers },
    { id: 'preview', label: 'LIVE PREVIEW', icon: Eye },
  ]

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* Left: project selector */}
      <div
        className="w-48 flex-shrink-0 border-r flex flex-col"
        style={{ borderColor: 'rgba(148,163,184,0.2)', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)' }}
      >
        <div className="px-3 py-2.5 border-b border-slate-100">
          <div className="font-hud text-[10px] font-bold text-blue-600">PROJECTS</div>
        </div>
        <div className="flex-1 overflow-y-auto panel-scroll py-1">
          {projects.length === 0 ? (
            <div className="p-3 text-[10px] text-slate-400 text-center">No projects imported yet</div>
          ) : projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className="w-full flex items-start gap-2 px-3 py-2.5 text-left border-l-[3px] transition-all"
              style={{
                borderLeftColor: selectedProjectId === p.id ? '#3b82f6' : 'transparent',
                background: selectedProjectId === p.id ? 'rgba(59,130,246,0.06)' : 'transparent',
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-slate-700 truncate">{p.name}</div>
                <div className="mt-0.5"><StatusBadge status={p.status as any} /></div>
              </div>
            </button>
          ))}
        </div>

        {/* Type selector */}
        <div className="border-t border-slate-100 p-2">
          <div className="font-hud text-[9px] text-slate-400 mb-1">DETECT AS</div>
          {PROJECT_TYPES.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-slate-50 transition-all">
                <Icon size={10} style={{ color: t.color }} />
                <span className="text-[9px]" style={{ color: t.color }}>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-slate-200 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.9)' }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm transition-all border-b-2"
                style={{
                  borderBottomColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
                  background: activeTab === tab.id ? 'rgba(59,130,246,0.06)' : 'transparent',
                  color: activeTab === tab.id ? '#2563eb' : '#64748b',
                }}
              >
                <Icon size={13} />
                <span className="font-hud text-[10px] font-bold">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* BUILD TAB */}
        {activeTab === 'build' && (
          <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto panel-scroll">
            {selected ? (
              <>
                <HudCard title="PROJECT INFO" accent="blue" compact>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-bold text-sm text-slate-800">{selected.name}</div>
                      <div className="text-[10px] text-slate-400">{selected.type.toUpperCase()} · {selected.files.length} file(s) · {selected.createdAt}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={selected.status as any} animate={processing} />
                      <button className="btn-bright-blue flex items-center gap-2" onClick={startProcessing} disabled={processing}>
                        {processing ? <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Play size={12} />}
                        {processing ? 'PROCESSING...' : 'START BUILD'}
                      </button>
                      {selected.status === 'ready' && !processing && (
                        <button className="btn-bright-green flex items-center gap-2" onClick={() => navigate('deploy')}>
                          DEPLOY <CheckCircle size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </HudCard>

                {(processing || progress > 0) && (
                  <HudCard title="BUILD PROGRESS" accent="gold" compact>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] text-amber-700 font-hud">{currentStep}</div>
                        <div className="font-hud text-sm font-bold text-amber-600">{progress}%</div>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden bg-amber-50 border border-amber-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                            boxShadow: '0 0 8px rgba(245,158,11,0.4)',
                          }}
                        />
                      </div>
                    </div>
                  </HudCard>
                )}

                <HudCard title="BUILD LOG" accent="green" className="flex-1">
                  <div className="panel-scroll font-mono text-[10px] space-y-0.5" style={{ maxHeight: '150px' }}>
                    {logs.length === 0 ? (
                      <div className="text-slate-300">Awaiting build start...</div>
                    ) : logs.map((log, i) => (
                      <div key={i} className={i === logs.length - 1 ? 'text-emerald-600 font-bold' : 'text-slate-500'}>{log}</div>
                    ))}
                    {selected.status === 'ready' && logs.length > 0 && (
                      <div className="text-emerald-600 flex items-center gap-1 pt-1 font-bold">
                        <CheckCircle size={10} /> BUILD SUCCESSFUL — Ready to Deploy
                      </div>
                    )}
                  </div>
                </HudCard>

                <HudCard title="PROJECT FILES" accent="purple" compact>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.files.map((f, i) => (
                      <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]"
                        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#7c3aed' }}>
                        <FileCode size={9} />
                        {f.name}
                      </div>
                    ))}
                  </div>
                </HudCard>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Cpu size={40} className="mx-auto mb-3 text-slate-200" />
                  <div className="font-hud text-sm text-slate-400">NO PROJECT SELECTED</div>
                  <div className="text-[11px] text-slate-300 mt-1">Import a project first</div>
                  <button className="btn-bright-blue mt-3" onClick={() => navigate('import')}>GO TO IMPORT</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VARIATIONS TAB */}
        {activeTab === 'variations' && (
          <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto panel-scroll">
            <HudCard title="VARIATIONS & MULTIPLICATION ENGINE" subtitle="AI-powered automatic color scheme, font & layout variations" accent="purple" compact>
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <label className="text-[10px] font-hud text-slate-500 mb-1 block">NUMBER OF VARIATIONS</label>
                  <div className="flex gap-1">
                    {[3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setVariationCount(n)}
                        className="px-3 py-1.5 rounded-lg font-hud text-[10px] font-bold border transition-all"
                        style={{
                          borderColor: variationCount === n ? '#8b5cf6' : 'rgba(148,163,184,0.3)',
                          background: variationCount === n ? 'rgba(139,92,246,0.1)' : 'transparent',
                          color: variationCount === n ? '#7c3aed' : '#94a3b8',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    className="btn-bright-purple flex items-center gap-2"
                    onClick={generateVariations}
                    disabled={generatingVariations || !selected}
                  >
                    {generatingVariations ? (
                      <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : <Sparkles size={13} />}
                    {generatingVariations ? `GENERATING... ${varProgress}%` : '✨ GENERATE VARIATIONS'}
                  </button>
                  {variations.length > 0 && (
                    <button className="btn-bright-green flex items-center gap-2" onClick={importAllVariations}>
                      <Zap size={12} /> IMPORT ALL & DEPLOY
                    </button>
                  )}
                </div>
              </div>

              {generatingVariations && (
                <div className="mt-3">
                  <div className="h-2 rounded-full overflow-hidden bg-purple-50 border border-purple-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${varProgress}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }}
                    />
                  </div>
                </div>
              )}
            </HudCard>

            {/* Variation cards */}
            {variations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {variations.map((v, i) => (
                  <div
                    key={v.id}
                    className="rounded-2xl overflow-hidden border border-white/80 transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      boxShadow: `0 4px 16px ${v.theme.colors.accent}25`,
                    }}
                  >
                    {/* Color preview strip */}
                    <div
                      className="h-10 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${v.theme.colors.bg}, ${v.theme.colors.surface})` }}
                    >
                      <div
                        className="px-3 py-1 rounded-full text-[10px] font-bold"
                        style={{ background: v.theme.colors.primary, color: v.theme.colors.accent }}
                      >
                        {v.theme.name}
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-hud text-[11px] font-bold text-slate-700">Variation {i + 1}</div>
                          <div className="text-[10px] text-slate-400">{v.theme.style}</div>
                        </div>
                        <div className="flex gap-1">
                          {['primary', 'accent', 'bg'].map((key) => (
                            <div key={key} className="w-4 h-4 rounded-full border border-white/80 shadow-sm"
                              style={{ background: v.theme.colors[key as keyof typeof v.theme.colors] }} />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 mb-2 text-[9px]">
                        <div className="p-1.5 rounded-lg" style={{ background: `${v.theme.colors.accent}15`, color: '#64748b' }}>
                          🎨 Font: {v.theme.font}
                        </div>
                        <div className="p-1.5 rounded-lg" style={{ background: `${v.theme.colors.accent}15`, color: '#64748b' }}>
                          📐 Style: {v.theme.style}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => importVariation(v)}
                          className="flex-1 py-1.5 rounded-xl font-hud text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                          style={{ background: v.theme.colors.primary, color: v.theme.colors.accent }}
                        >
                          <Zap size={10} /> USE
                        </button>
                        <button
                          onClick={() => copyVariationCode(v)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 transition-all"
                        >
                          {v.copied ? <CheckCircle size={11} className="text-emerald-500" /> : <Copy size={11} />}
                        </button>
                        <button
                          onClick={() => setPreviewVariation(v)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 transition-all"
                        >
                          <Eye size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {variations.length === 0 && !generatingVariations && (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="text-center">
                  <Layers size={48} className="mx-auto mb-3 text-purple-200" />
                  <div className="font-hud text-sm text-slate-400">VARIATIONS ENGINE</div>
                  <div className="text-[11px] text-slate-300 mt-1 mb-3">Select a project and generate {variationCount} automatic variations</div>
                  <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-[10px] text-slate-500">
                    <div className="p-2 rounded-xl bg-white/60 border border-purple-100">🎨 Different color schemes</div>
                    <div className="p-2 rounded-xl bg-white/60 border border-purple-100">✍️ New font families</div>
                    <div className="p-2 rounded-xl bg-white/60 border border-purple-100">📐 Layout adjustments</div>
                    <div className="p-2 rounded-xl bg-white/60 border border-purple-100">🚀 Deploy independently</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIVE PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {selected && selected.files[0]?.content ? (
              <>
                <div
                  className="flex items-center justify-between px-3 py-2 border-b border-slate-100 flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                >
                  <div className="font-hud text-[10px] font-bold text-slate-600">LIVE PREVIEW — {selected.name}</div>
                  <div className="flex gap-1">
                    {[{ label: '📱 Mobile', w: '375px' }, { label: '📟 Tablet', w: '768px' }, { label: '🖥 Desktop', w: '100%' }].map(v => (
                      <button
                        key={v.label}
                        onClick={() => {
                          const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
                          if (iframe) iframe.style.width = v.w
                        }}
                        className="text-[9px] font-hud px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all"
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-auto bg-slate-100 flex justify-center pt-2">
                  <iframe
                    id="preview-iframe"
                    srcDoc={selected.files[0]?.content}
                    className="border-0 rounded-xl shadow-lg transition-all duration-300"
                    style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                    sandbox="allow-scripts"
                    title="Live Preview"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Eye size={40} className="mx-auto mb-3 text-slate-200" />
                  <div className="font-hud text-sm text-slate-400">NO PREVIEW AVAILABLE</div>
                  <div className="text-[11px] text-slate-300 mt-1">Select a project with HTML content</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Variation preview modal */}
      {previewVariation && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPreviewVariation(null)}>
          <div
            className="w-full max-w-3xl max-h-[80vh] flex flex-col rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="font-hud text-[11px] font-bold text-slate-700">PREVIEW: {previewVariation.name}</div>
              <button onClick={() => setPreviewVariation(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                srcDoc={previewVariation.project.files[0]?.content}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
                title="Variation Preview"
                style={{ minHeight: '400px' }}
              />
            </div>
            <div className="flex gap-2 p-3 border-t border-slate-100">
              <button
                className="btn-bright-purple flex items-center gap-2 flex-1 justify-center"
                onClick={() => { importVariation(previewVariation); setPreviewVariation(null) }}
              >
                <Zap size={12} /> IMPORT THIS VARIATION
              </button>
              <button
                className="btn-ghost-bright flex items-center gap-2"
                onClick={() => setPreviewVariation(null)}
              >
                <X size={12} /> CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
