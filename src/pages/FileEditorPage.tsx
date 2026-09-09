import React, { useState, useRef, useEffect } from 'react'
import {
  Code2, Eye, Save, Copy, CheckCircle, FolderOpen, FileCode,
  ChevronRight, ChevronDown, Columns, Monitor, Tablet, Smartphone,
  Maximize2, Minimize2, RefreshCw, Zap
} from 'lucide-react'
import { useApp } from '@/context/AppContext'

interface FileNode {
  name: string
  path: string
  content: string
  type: string
  isDirectory?: boolean
}

const LANGUAGE_COLORS: Record<string, string> = {
  html: '#f97316', htm: '#f97316', css: '#3b82f6',
  js: '#f59e0b', jsx: '#f59e0b', ts: '#06b6d4', tsx: '#06b6d4',
  json: '#10b981', md: '#8b5cf6', svg: '#ef4444', txt: '#94a3b8', sh: '#10b981',
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'full'
type EditorLayout = 'code-only' | 'split-h' | 'split-v' | 'preview-only'

const VIEWPORT_SIZES: Record<ViewportSize, { width: string; label: string; icon: React.ElementType }> = {
  mobile: { width: '375px', label: '📱 Mobile', icon: Smartphone },
  tablet: { width: '768px', label: '📟 Tablet', icon: Tablet },
  desktop: { width: '1280px', label: '🖥 Desktop', icon: Monitor },
  full: { width: '100%', label: 'Full', icon: Maximize2 },
}

export function FileEditorPage() {
  const { projects, currentProject, updateProject } = useApp()
  const [selectedProject, setSelectedProject] = useState(currentProject?.id || '')
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [layout, setLayout] = useState<EditorLayout>('split-h')
  const [viewport, setViewport] = useState<ViewportSize>('desktop')
  const [expanded, setExpanded] = useState(false)
  const [treeExpanded, setTreeExpanded] = useState(true)
  const [previewKey, setPreviewKey] = useState(0)
  const [livePreview, setLivePreview] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const project = projects.find(p => p.id === selectedProject) || currentProject

  const openFile = (file: FileNode) => {
    setSelectedFile(file)
    setEditContent(file.content || '')
    setSaved(false)
  }

  const saveFile = () => {
    if (!project || !selectedFile) return
    const updatedFiles = project.files.map(f =>
      f.path === selectedFile.path && f.name === selectedFile.name
        ? { ...f, content: editContent }
        : f
    )
    updateProject(project.id, { files: updatedFiles })
    setSaved(true)
    setSelectedFile(prev => prev ? { ...prev, content: editContent } : prev)
    setTimeout(() => setSaved(false), 2000)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(editContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const refreshPreview = () => setPreviewKey(k => k + 1)

  const ext = selectedFile?.name.split('.').pop()?.toLowerCase() || 'txt'
  const langColor = LANGUAGE_COLORS[ext] || '#94a3b8'
  const lineCount = editContent.split('\n').length
  const isHtml = ['html', 'htm'].includes(ext)
  const previewContent = livePreview ? editContent : (selectedFile?.content || '')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newContent = editContent.substring(0, start) + '  ' + editContent.substring(end)
      setEditContent(newContent)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      saveFile()
    }
  }

  const CodeEditor = (
    <div className="flex-1 overflow-hidden relative flex flex-col">
      {/* Line numbers + editor */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 w-10 overflow-hidden font-mono text-[10px] text-right pr-2 pt-3 select-none z-10"
          style={{ background: 'rgba(241,245,249,0.95)', borderRight: '1px solid rgba(203,213,225,0.4)', color: '#94a3b8', lineHeight: '1.6', minHeight: '100%' }}
        >
          {editContent.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <textarea
          ref={textareaRef}
          className="absolute inset-0 font-mono text-[11px] outline-none resize-none panel-scroll"
          style={{
            left: '40px',
            background: '#f8fafc',
            color: '#1e293b',
            padding: '12px 12px 12px 8px',
            lineHeight: '1.6',
            tabSize: 2,
            caretColor: langColor,
          }}
          value={editContent}
          onChange={e => { setEditContent(e.target.value); setSaved(false) }}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
      </div>
    </div>
  )

  const PreviewPane = (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ background: '#f1f5f9' }}>
      {/* Viewport controls */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 flex-shrink-0 border-b"
        style={{ borderColor: 'rgba(148,163,184,0.2)', background: 'rgba(255,255,255,0.95)' }}
      >
        <div className="flex gap-1">
          {(Object.entries(VIEWPORT_SIZES) as [ViewportSize, typeof VIEWPORT_SIZES[ViewportSize]][]).map(([key, cfg]) => {
            const Icon = cfg.icon
            return (
              <button
                key={key}
                onClick={() => setViewport(key)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-hud font-bold border transition-all"
                style={{
                  borderColor: viewport === key ? '#3b82f6' : 'rgba(203,213,225,0.4)',
                  background: viewport === key ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: viewport === key ? '#2563eb' : '#94a3b8',
                }}
              >
                <Icon size={10} />
                {cfg.label}
              </button>
            )
          })}
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setLivePreview(!livePreview)}
          className="text-[9px] font-hud px-2 py-1 rounded-lg border transition-all flex items-center gap-1"
          style={{
            borderColor: livePreview ? 'rgba(16,185,129,0.4)' : 'rgba(203,213,225,0.4)',
            background: livePreview ? 'rgba(16,185,129,0.1)' : 'transparent',
            color: livePreview ? '#059669' : '#94a3b8',
          }}
        >
          <Zap size={9} />
          {livePreview ? 'LIVE' : 'STATIC'}
        </button>
        <button onClick={refreshPreview} className="p-1 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
          <RefreshCw size={11} />
        </button>
      </div>
      <div
        className="flex-1 overflow-auto flex items-start justify-center p-2"
        style={{ background: 'linear-gradient(135deg, #e2e8f0, #f1f5f9)' }}
      >
        {isHtml ? (
          <iframe
            ref={iframeRef}
            key={livePreview ? `live-${editContent.slice(0,50)}` : `static-${previewKey}`}
            srcDoc={previewContent}
            className="border-0 rounded-xl shadow-xl transition-all duration-300"
            style={{ width: VIEWPORT_SIZES[viewport].width, height: '100%', minHeight: '400px', maxWidth: '100%', background: '#fff' }}
            sandbox="allow-scripts"
            title="Live Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Eye size={32} className="mx-auto mb-3 text-slate-300" />
              <div className="font-hud text-xs text-slate-400">HTML/HTM files only for live preview</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={`h-full flex overflow-hidden ${expanded ? 'fixed inset-0 z-40' : ''}`}
      style={expanded ? { background: 'rgba(248,250,252,0.99)' } : {}}>
      {/* Left: file tree */}
      <div
        className="w-52 flex-shrink-0 border-r flex flex-col"
        style={{ borderColor: 'rgba(148,163,184,0.2)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}
      >
        <div className="px-3 py-2.5 border-b border-slate-100">
          <div className="font-hud text-[9px] text-slate-400 mb-1.5">SELECT PROJECT</div>
          <select className="input-hud text-[10px] py-1" value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setSelectedFile(null) }}>
            <option value="">-- Select Project --</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto panel-scroll py-1">
          {project && (
            <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 transition-all" onClick={() => setTreeExpanded(!treeExpanded)}>
              {treeExpanded ? <ChevronDown size={11} className="text-slate-400" /> : <ChevronRight size={11} className="text-slate-400" />}
              <FolderOpen size={11} className="text-amber-500" />
              <span className="font-hud text-[10px] text-slate-600 truncate">{project.name}</span>
            </button>
          )}
          {treeExpanded && project?.files.map((file, i) => {
            const fileExt = file.name.split('.').pop()?.toLowerCase() || 'txt'
            const fileColor = LANGUAGE_COLORS[fileExt] || '#94a3b8'
            const isSelected = selectedFile?.path === file.path && selectedFile?.name === file.name
            return (
              <button
                key={i}
                onClick={() => openFile(file as FileNode)}
                className="w-full flex items-center gap-2 pl-7 pr-3 py-1.5 border-l-[3px] text-left transition-all hover:bg-slate-50"
                style={{
                  borderLeftColor: isSelected ? fileColor : 'transparent',
                  background: isSelected ? `${fileColor}08` : 'transparent',
                }}
              >
                <FileCode size={10} style={{ color: fileColor, flexShrink: 0 }} />
                <span className="text-[10px] truncate" style={{ color: isSelected ? fileColor : '#64748b' }}>{file.name}</span>
              </button>
            )
          })}
          {!project && (
            <div className="px-3 py-4 text-[10px] text-slate-300 text-center">Select a project to browse files</div>
          )}
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedFile ? (
          <>
            {/* Toolbar */}
            <div
              className="flex items-center justify-between px-3 py-2 flex-shrink-0 border-b"
              style={{ borderColor: 'rgba(148,163,184,0.15)', background: 'rgba(255,255,255,0.95)' }}
            >
              <div className="flex items-center gap-2">
                <FileCode size={13} style={{ color: langColor }} />
                <span className="font-hud text-[11px] font-bold" style={{ color: langColor }}>{selectedFile.name}</span>
                <span className="text-[9px] text-slate-400">{lineCount} lines · {editContent.length} chars</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Layout controls */}
                <div className="hidden sm:flex border rounded-xl overflow-hidden" style={{ borderColor: 'rgba(203,213,225,0.5)' }}>
                  {([
                    { id: 'code-only', icon: Code2, title: 'Code only' },
                    { id: 'split-h', icon: Columns, title: 'Split horizontal' },
                    { id: 'preview-only', icon: Eye, title: 'Preview only' },
                  ] as const).map(opt => {
                    const Icon = opt.icon
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setLayout(opt.id)}
                        title={opt.title}
                        className="px-2 py-1 transition-all border-r last:border-r-0"
                        style={{
                          borderColor: 'rgba(203,213,225,0.4)',
                          background: layout === opt.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                          color: layout === opt.id ? '#2563eb' : '#94a3b8',
                        }}
                      >
                        <Icon size={11} />
                      </button>
                    )
                  })}
                </div>
                <button onClick={copyCode} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-200 transition-all">
                  {copied ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
                <button
                  onClick={saveFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-hud text-[10px] font-bold transition-all"
                  style={saved
                    ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', color: '#059669' }
                    : { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#2563eb' }
                  }
                >
                  {saved ? <><CheckCircle size={11} /> SAVED</> : <><Save size={11} /> SAVE</>}
                </button>
                <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-all">
                  {expanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </button>
              </div>
            </div>

            {/* Editor/Preview area based on layout */}
            <div className={`flex-1 overflow-hidden ${layout === 'split-h' ? 'flex flex-row' : layout === 'split-v' ? 'flex flex-col' : 'flex'}`}>
              {(layout === 'code-only' || layout === 'split-h' || layout === 'split-v') && CodeEditor}
              {layout === 'split-h' && (
                <div className="w-px flex-shrink-0" style={{ background: 'rgba(203,213,225,0.5)' }} />
              )}
              {(layout === 'preview-only' || layout === 'split-h' || layout === 'split-v') && PreviewPane}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Code2 size={28} className="text-blue-300" />
              </div>
              <div className="font-hud text-sm font-bold text-slate-500 mb-1">FILE PREVIEW EDITOR</div>
              <div className="text-[11px] text-slate-400 mb-4">Select a project and file from the left panel</div>
              <div className="space-y-1.5 text-left max-w-xs mx-auto">
                {[
                  '✓ Syntax editor with line numbers',
                  '✓ Live HTML preview (updates as you type)',
                  '✓ Split-screen code + preview mode',
                  '✓ Mobile/Tablet/Desktop viewport simulator',
                  '✓ Ctrl+S to save, Tab for indentation',
                ].map((tip, i) => (
                  <div key={i} className="text-[10px] text-slate-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
