import React, { useState, useRef } from 'react'
import {
  Upload, ClipboardPaste, FolderOpen, Files, HardDrive, MessageCircle,
  Globe, Cloud, Sparkles, CheckCircle, X, FileText, AlertTriangle,
  Package, FileCode, ChevronRight
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { IMPORT_METHODS, AI_MODELS } from '@/constants'
import { generateId, detectProjectType, formatDate } from '@/lib/utils'
import { extractZip, detectFrameworkFromFiles } from '@/lib/zipExtractor'
import type { ImportMethod, Project } from '@/types'

const iconMap: Record<string, React.ElementType> = {
  ClipboardPaste, FolderOpen, Files, HardDrive, MessageCircle, Globe, Cloud, Sparkles
}

const methodColors: Record<ImportMethod, string> = {
  'paste-code': '#00e5ff',
  'local-storage': '#4ade80',
  'multi-file': '#c084fc',
  'internal-storage': '#ffc107',
  'whatsapp': '#4ade80',
  'url': '#fb923c',
  'cloud': '#00e5ff',
  'ai-modal': '#c084fc',
}

export function ImportPage() {
  const { addProject, navigate } = useApp()
  const [selectedMethod, setSelectedMethod] = useState<ImportMethod | null>(null)
  const [pasteContent, setPasteContent] = useState('')
  const [projectName, setProjectName] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [cloudOTP, setCloudOTP] = useState('')
  const [cloudVerified, setCloudVerified] = useState(false)
  const [selectedAI, setSelectedAI] = useState('')
  const [importing, setImporting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [extractProgress, setExtractProgress] = useState(0)
  const [extractedFiles, setExtractedFiles] = useState<any[]>([])
  const [extractedFramework, setExtractedFramework] = useState('')
  const [extractError, setExtractError] = useState('')
  const [multiFiles, setMultiFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async () => {
    if (!projectName.trim()) return
    setImporting(true)

    let content = pasteContent
    let files: Project['files'] = []

    if (selectedMethod === 'url') {
      content = `<!-- Imported from: ${urlInput} -->\n<html><head><title>${projectName}</title></head><body><h1>${projectName}</h1><p>Imported from: ${urlInput}</p></body></html>`
    } else if (selectedMethod === 'cloud') {
      content = `<!-- Cloud Import -->\n<html><head><title>${projectName}</title></head><body><h1>${projectName}</h1></body></html>`
    } else if (selectedMethod === 'ai-modal') {
      content = `<!-- Imported via ${selectedAI} -->\n<html><head><title>${projectName}</title></head><body><h1>${projectName}</h1></body></html>`
    }

    if (extractedFiles.length > 0) {
      files = extractedFiles.filter(f => !f.isDirectory).map(f => ({
        name: f.name,
        path: f.path,
        content: f.content,
        type: f.type,
        size: f.size,
      }))
      content = extractedFiles.find(f => f.name === 'index.html')?.content || content
    } else if (content) {
      files = [{ name: 'index.html', path: '/', content, type: 'text/html', size: content.length }]
    } else if (multiFiles.length > 0) {
      files = multiFiles.map(f => ({ name: f.name, path: f.name, content: '', type: f.type, size: f.size }))
    }

    await new Promise(r => setTimeout(r, 800))

    const project: Project = {
      id: generateId(),
      name: projectName,
      type: detectProjectType(content, projectName) as any,
      status: 'ready',
      deployStatus: 'idle',
      files,
      createdAt: formatDate(),
    }

    addProject(project)
    setSuccess(true)
    setImporting(false)
    setTimeout(() => navigate('process'), 1200)
  }

  const handleZipFile = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setExtractError('Only ZIP files are supported. Please select a .zip file.')
      return
    }
    setExtracting(true)
    setExtractError('')
    setExtractedFiles([])
    setExtractProgress(0)
    setProjectName(file.name.replace('.zip', ''))

    try {
      const files = await extractZip(file, (pct, name) => {
        setExtractProgress(pct)
      })
      const framework = detectFrameworkFromFiles(files)
      setExtractedFiles(files)
      setExtractedFramework(framework)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setExtractError(`ZIP extraction failed: ${msg}`)
    }
    setExtracting(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    if (file.name.endsWith('.zip')) {
      await handleZipFile(file)
    } else {
      setProjectName(file.name.replace(/\.(html|htm|js|ts|tsx|jsx|json)$/, ''))
      const reader = new FileReader()
      reader.onload = (ev) => setPasteContent(ev.target?.result as string || '')
      reader.readAsText(file)
    }
  }

  const handleMultiFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setMultiFiles(files)
    if (files.length > 0 && !projectName) {
      setProjectName('Multi-File Project')
    }
  }

  const renderMethodPanel = () => {
    if (!selectedMethod) return null
    const color = methodColors[selectedMethod]

    return (
      <div className="animate-fade-in h-full overflow-y-auto panel-scroll">
        <HudCard
          title={IMPORT_METHODS.find(m => m.id === selectedMethod)?.label || ''}
          accent="cyan"
          compact
        >
          <div className="space-y-3">
            {/* Project name */}
            <div>
              <label className="text-[10px] font-hud text-white/50 mb-1 block">PROJECT NAME</label>
              <input className="input-hud" placeholder="Enter project name..." value={projectName} onChange={e => setProjectName(e.target.value)} />
            </div>

            {/* Method panels */}
            {selectedMethod === 'paste-code' && (
              <div>
                <label className="text-[10px] font-hud text-white/50 mb-1 block">PASTE CODE / HTML</label>
                <textarea
                  className="input-hud resize-none font-mono text-[10px]"
                  rows={10}
                  placeholder="Paste your HTML, JavaScript, React code or any project code here..."
                  value={pasteContent}
                  onChange={e => setPasteContent(e.target.value)}
                />
                <div className="text-[9px] text-white/30 mt-1">{pasteContent.length} characters</div>
              </div>
            )}

            {selectedMethod === 'local-storage' && (
              <div className="space-y-2">
                <input ref={zipInputRef} type="file" accept=".zip" onChange={handleZipFile.bind(null, {name: ''} as any)} className="hidden" onChange={handleFileSelect} />
                <button
                  className="w-full flex items-center justify-center gap-2 py-4 rounded border-2 border-dashed transition-all"
                  style={{ borderColor: `${color}40`, background: `${color}05`, color }}
                  onClick={() => zipInputRef.current?.click()}
                >
                  <FolderOpen size={18} />
                  <div className="text-left">
                    <div className="font-hud text-[11px] font-bold">BROWSE ZIP FILES</div>
                    <div className="text-[10px] opacity-60">Only .zip files are shown and accepted</div>
                  </div>
                </button>

                {extracting && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-hud-cyan">Extracting ZIP...</span>
                      <span className="text-hud-gold">{extractProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${extractProgress}%`, background: 'linear-gradient(90deg,#00e5ff,#4ade80)' }} />
                    </div>
                  </div>
                )}

                {extractError && (
                  <div className="flex items-center gap-2 p-2 rounded text-[10px] text-hud-red" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
                    <AlertTriangle size={11} />{extractError}
                  </div>
                )}

                {extractedFiles.length > 0 && (
                  <div className="p-2.5 rounded border" style={{ background: 'rgba(74,222,128,0.06)', borderColor: 'rgba(74,222,128,0.2)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={12} className="text-hud-green" />
                      <div className="font-bold text-[11px] text-hud-green">ZIP Extracted Successfully</div>
                    </div>
                    <div className="text-[9px] text-white/50 mb-1.5">Framework detected: <span className="text-hud-cyan">{extractedFramework}</span></div>
                    <div className="text-[9px] text-white/50 mb-1.5">{extractedFiles.filter(f => !f.isDirectory).length} files extracted</div>
                    <div className="max-h-24 panel-scroll overflow-y-auto space-y-0.5">
                      {extractedFiles.filter(f => !f.isDirectory).slice(0, 20).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[9px] text-white/40">
                          <FileCode size={8} className="text-hud-cyan" />
                          {f.path}
                        </div>
                      ))}
                      {extractedFiles.filter(f => !f.isDirectory).length > 20 && (
                        <div className="text-[9px] text-white/30">...and {extractedFiles.filter(f => !f.isDirectory).length - 20} more files</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedMethod === 'multi-file' && (
              <div className="space-y-2">
                <input ref={folderInputRef} type="file" multiple onChange={handleMultiFileSelect} className="hidden" />
                <button
                  className="w-full flex items-center justify-center gap-2 py-4 rounded border-2 border-dashed transition-all"
                  style={{ borderColor: `${color}40`, background: `${color}05`, color }}
                  onClick={() => folderInputRef.current?.click()}
                >
                  <Files size={18} />
                  <div className="text-left">
                    <div className="font-hud text-[11px] font-bold">SELECT ALL PROJECT FILES</div>
                    <div className="text-[10px] opacity-60">Copy & paste all files at once</div>
                  </div>
                </button>
                {multiFiles.length > 0 && (
                  <div className="p-2 rounded border" style={{ background: 'rgba(192,132,252,0.06)', borderColor: 'rgba(192,132,252,0.2)' }}>
                    <div className="text-[10px] text-hud-purple mb-1">{multiFiles.length} files selected</div>
                    <div className="max-h-20 panel-scroll overflow-y-auto space-y-0.5">
                      {multiFiles.map((f, i) => (
                        <div key={i} className="text-[9px] text-white/40 flex items-center gap-1">
                          <FileText size={8} />{f.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-2 rounded text-[9px] text-white/30" style={{ background: 'rgba(192,132,252,0.04)', border: '1px dashed rgba(192,132,252,0.15)' }}>
                  Path sequences and directory structure auto-adjusted for all selected files.
                </div>
              </div>
            )}

            {selectedMethod === 'internal-storage' && (
              <div className="space-y-2">
                <input ref={fileInputRef} type="file" accept=".zip" onChange={handleFileSelect} className="hidden" />
                <button
                  className="w-full flex items-center justify-center gap-2 py-4 rounded border-2 border-dashed transition-all"
                  style={{ borderColor: `${color}40`, background: `${color}05`, color }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <HardDrive size={18} />
                  <div className="text-left">
                    <div className="font-hud text-[11px] font-bold">ACCESS DEVICE STORAGE</div>
                    <div className="text-[10px] opacity-60">Shows only ZIP files</div>
                  </div>
                </button>
                {extractedFiles.length > 0 && (
                  <div className="flex items-center gap-2 text-hud-green text-[10px]">
                    <CheckCircle size={11} /> {extractedFiles.filter(f => !f.isDirectory).length} files extracted
                  </div>
                )}
              </div>
            )}

            {selectedMethod === 'whatsapp' && (
              <div className="space-y-2">
                <div className="p-3 rounded" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)' }}>
                  <div className="text-hud-green font-bold text-[11px] mb-2">WhatsApp / Telegram Steps</div>
                  {['Open WhatsApp / Telegram on your device', 'Find the forwarded ZIP or project file', 'Tap Share → Open with browser / Save to Downloads', 'Come back here → Use "Browse ZIP Files" to open'].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-white/50 mb-1">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80' }}>{i + 1}</div>
                      {step}
                    </div>
                  ))}
                </div>
                <input ref={fileInputRef} type="file" accept=".zip" onChange={handleFileSelect} className="hidden" />
                <button className="w-full btn-primary flex items-center justify-center gap-2" onClick={() => fileInputRef.current?.click()}>
                  <FolderOpen size={13} /> OPEN FROM DOWNLOADS
                </button>
              </div>
            )}

            {selectedMethod === 'url' && (
              <div className="space-y-2">
                <label className="text-[10px] font-hud text-white/50 mb-1 block">PROJECT URL</label>
                <input className="input-hud" placeholder="https://example.com/project or GitHub raw link..." value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                <div className="text-[9px] text-white/30">Supports: Direct URLs, GitHub raw files, PWA links, CDN links</div>
              </div>
            )}

            {selectedMethod === 'cloud' && (
              <div className="space-y-2">
                {!cloudVerified ? (
                  <>
                    <label className="text-[10px] font-hud text-white/50 block">CLOUD STORAGE URL OR EMAIL</label>
                    <input className="input-hud" placeholder="Google Drive / Dropbox / OneDrive URL or email..." />
                    <div className="flex gap-2">
                      <input className="input-hud flex-1" placeholder="Enter OTP code (4-6 digits)..." value={cloudOTP} onChange={e => setCloudOTP(e.target.value)} maxLength={6} />
                      <button className="btn-primary flex-shrink-0" onClick={() => setCloudVerified(cloudOTP.length >= 4)}>VERIFY OTP</button>
                    </div>
                    <div className="text-[9px] text-white/30">OTP sent to your registered email for cloud access verification</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-hud-green text-[10px] mb-2"><CheckCircle size={11} /> Cloud Verified!</div>
                    <input className="input-hud" placeholder="Enter file path or URL from your cloud storage..." />
                  </>
                )}
              </div>
            )}

            {selectedMethod === 'ai-modal' && (
              <div className="space-y-2">
                <label className="text-[10px] font-hud text-white/50 block">SELECT AI MODEL</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {AI_MODELS.map(ai => (
                    <button key={ai.id} onClick={() => setSelectedAI(ai.label)}
                      className="p-2 rounded text-[10px] font-bold font-hud border transition-all"
                      style={{ borderColor: selectedAI === ai.label ? ai.color : `${ai.color}30`, background: selectedAI === ai.label ? `${ai.color}20` : `${ai.color}05`, color: ai.color }}>
                      {ai.label}
                    </button>
                  ))}
                </div>
                {selectedAI && (
                  <div className="space-y-1.5">
                    <input className="input-hud" placeholder={`${selectedAI} project URL or shared link...`} />
                    <textarea className="input-hud resize-none font-mono text-[10px]" rows={5} placeholder={`Or paste code generated by ${selectedAI} here...`} value={pasteContent} onChange={e => setPasteContent(e.target.value)} />
                  </div>
                )}
              </div>
            )}

            {/* Import button */}
            <button
              className={`w-full py-2.5 rounded font-hud text-xs font-bold flex items-center justify-center gap-2 transition-all ${success ? 'bg-hud-green/20 border border-hud-green text-hud-green' : 'btn-primary'}`}
              onClick={handleImport}
              disabled={importing || !projectName.trim()}
            >
              {importing ? <><div className="w-3 h-3 border-2 border-hud-cyan/40 border-t-hud-cyan rounded-full animate-spin" />PROCESSING...</> :
               success ? <><CheckCircle size={14} />IMPORTED! REDIRECTING...</> :
               <><Upload size={14} />IMPORT PROJECT</>}
            </button>
          </div>
        </HudCard>
      </div>
    )
  }

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      <div className="w-44 flex-shrink-0 border-r flex flex-col overflow-hidden" style={{ borderColor: 'rgba(0,229,255,0.1)', background: 'rgba(7,13,26,0.97)' }}>
        <div className="px-3 py-2 border-b border-white/5">
          <div className="font-hud text-[10px] font-bold text-hud-cyan">IMPORT METHOD</div>
        </div>
        <div className="flex-1 overflow-y-auto panel-scroll py-1">
          {IMPORT_METHODS.map(method => {
            const Icon = iconMap[method.icon]
            const isSelected = selectedMethod === method.id
            const color = methodColors[method.id as ImportMethod]
            return (
              <button key={method.id}
                onClick={() => { setSelectedMethod(method.id as ImportMethod); setSuccess(false); setPasteContent(''); setProjectName(''); setExtractedFiles([]); setExtractError('') }}
                className="w-full flex items-start gap-2 px-3 py-2.5 transition-all duration-200 text-left border-l-2"
                style={{ borderLeftColor: isSelected ? color : 'transparent', background: isSelected ? `${color}10` : 'transparent' }}
              >
                {Icon && <Icon size={13} className="flex-shrink-0 mt-0.5" style={{ color: isSelected ? color : '#94a3b8' }} />}
                <div>
                  <div className="text-[10px] font-bold font-hud" style={{ color: isSelected ? color : '#94a3b8' }}>{method.label}</div>
                  <div className="text-[9px] text-white/30 leading-tight mt-0.5">{method.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 p-3 overflow-hidden">
        {selectedMethod ? renderMethodPanel() : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Upload size={40} className="mx-auto mb-3 text-white/10" />
              <div className="font-hud text-sm text-white/30">SELECT AN IMPORT METHOD</div>
              <div className="text-[11px] text-white/20 mt-1 mb-4">8 ways to import your project</div>
              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                {IMPORT_METHODS.slice(0, 4).map(m => {
                  const Icon = iconMap[m.icon]
                  const color = methodColors[m.id as ImportMethod]
                  return (
                    <button key={m.id} onClick={() => setSelectedMethod(m.id as ImportMethod)}
                      className="flex items-center gap-2 p-2.5 rounded border text-left transition-all hover:scale-105"
                      style={{ borderColor: `${color}25`, background: `${color}08` }}>
                      {Icon && <Icon size={12} style={{ color }} />}
                      <span className="text-[9px] font-hud" style={{ color }}>{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
