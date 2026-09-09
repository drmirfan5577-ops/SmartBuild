import React, { useState, useEffect, useRef } from 'react'
import {
  Rocket, Github, CheckCircle, ExternalLink, QrCode, Copy, Download,
  BookOpen, Package, PlayCircle, Upload, Shield, FileArchive,
  ChevronDown, ChevronRight, AlertTriangle, Globe, Smartphone, X,
  Search, Star, Eye, RefreshCw, GitBranch, GitFork, Clock, Zap,
  Smartphone as Phone, QrCode as QR, Archive, Layers
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { generateQRUrl, generateId } from '@/lib/utils'
import { deployToGitHub } from '@/lib/github'
import { DEFAULT_GITHUB_USER, DEFAULT_REPO_NAME } from '@/constants'

const DEPLOY_TABS = [
  { id: 'github', label: 'GitHub', icon: Github, color: '#10b981' },
  { id: 'repobrowser', label: 'Repo Browser', icon: Search, color: '#3b82f6' },
  { id: 'expo', label: 'Expo Go', icon: Smartphone, color: '#8b5cf6' },
  { id: 'apk', label: 'APK / PWA', icon: Phone, color: '#f97316' },
  { id: 'playstore', label: 'Play Store', icon: PlayCircle, color: '#f59e0b' },
  { id: 'backup', label: 'Export / Backup', icon: FileArchive, color: '#f97316' },
  { id: 'docs', label: 'Docs & Guides', icon: BookOpen, color: '#06b6d4' },
]

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  homepage: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
  private: boolean
  has_pages: boolean
  size: number
  topics: string[]
}

const PLAYSTORE_STEPS = [
  { step: 1, title: 'Google Play Console Setup', desc: 'Go to play.google.com/console → Create Developer Account → Pay $25 one-time fee', icon: '🔑' },
  { step: 2, title: 'Create New Application', desc: 'Dashboard → All Apps → Create app → Set default language, app name, and type', icon: '📱' },
  { step: 3, title: 'Store Listing', desc: 'Add title, short description (80 chars), full description (4000 chars), screenshots', icon: '🎨' },
  { step: 4, title: 'Content Rating', desc: 'Policy → App content → Content ratings → Fill questionnaire for your category', icon: '⭐' },
  { step: 5, title: 'Pricing & Distribution', desc: 'Set free or paid, select countries, agree to distribution agreement', icon: '💰' },
  { step: 6, title: 'Build APK/AAB', desc: 'expo: "eas build --platform android" or React Native: cd android && ./gradlew bundleRelease', icon: '🔨' },
  { step: 7, title: 'Sign Your App', desc: 'keytool -genkey -v -keystore my-app.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000', icon: '🔏' },
  { step: 8, title: 'Upload AAB to Play Store', desc: 'Production → Releases → Create new release → Upload .aab file → Add release notes', icon: '🚀' },
  { step: 9, title: 'Review & Publish', desc: 'Complete store listing → Submit → Usually 1-7 days → Track in Play Console', icon: '✅' },
]

const EXPO_STEPS = [
  { step: 1, title: 'Install Expo CLI', desc: 'npm install -g expo-cli eas-cli', icon: '📦' },
  { step: 2, title: 'Login to Expo', desc: 'expo login → Enter your expo.dev credentials', icon: '🔐' },
  { step: 3, title: 'Configure app.json', desc: 'Set name, slug, version, android.package (com.yourname.appname)', icon: '⚙️' },
  { step: 4, title: 'Setup EAS', desc: 'eas init → Follow prompts → Creates eas.json', icon: '🛠️' },
  { step: 5, title: 'Build for Expo Go', desc: 'expo start → Scan QR code with Expo Go on phone', icon: '📸' },
  { step: 6, title: 'Publish to Expo', desc: 'expo publish → Gets public URL: exp://exp.host/@username/slug', icon: '🌐' },
  { step: 7, title: 'Build Standalone APK', desc: 'eas build --platform android --profile preview → Get download URL', icon: '⚡' },
]

const GITHUB_DOCS = [
  { title: 'Create Personal Access Token', desc: 'GitHub → Settings → Developer settings → Personal access tokens → Generate new token → Select "repo" scope', icon: '🔑', color: '#10b981' },
  { title: 'Enable GitHub Pages', desc: 'Repo → Settings → Pages → Source: Deploy from branch → Branch: main → Folder: / (root) → Save', icon: '🌐', color: '#3b82f6' },
  { title: 'Custom Domain', desc: 'Pages settings → Custom domain → Enter domain → Add CNAME record pointing to username.github.io', icon: '🔗', color: '#f59e0b' },
  { title: 'Repository Structure', desc: 'Keep index.html at root for GitHub Pages. All assets referenced relatively. No server-side code.', icon: '📁', color: '#8b5cf6' },
]

function generatePWAManifest(name: string, color: string): string {
  return JSON.stringify({
    name,
    short_name: name.substring(0, 12),
    start_url: '/',
    display: 'standalone',
    background_color: color || '#ffffff',
    theme_color: color || '#3b82f6',
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    description: `${name} - Built with E-SMART-WORLD`,
  }, null, 2)
}

function generateServiceWorker(): string {
  return `// E-SMART-WORLD PWA Service Worker
const CACHE_NAME = 'esw-pwa-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});`
}

export function DeployPage() {
  const { projects, currentProject, accounts, updateProject, navigate, settings } = useApp()
  const [selectedProjectId, setSelectedProjectId] = useState(currentProject?.id || '')
  const [githubToken, setGithubToken] = useState(settings.githubToken || '')
  const [githubUser, setGithubUser] = useState(settings.githubUser || DEFAULT_GITHUB_USER)
  const [repoName, setRepoName] = useState('')
  const [activeTab, setActiveTab] = useState<string>('github')
  const [deploying, setDeploying] = useState(false)
  const [deployLog, setDeployLog] = useState<string[]>([])
  const [deployProgress, setDeployProgress] = useState(0)
  const [deployed, setDeployed] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [deployError, setDeployError] = useState('')
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [validatingToken, setValidatingToken] = useState(false)
  // Live deploy status polling
  const [siteStatus, setSiteStatus] = useState<'checking' | 'live' | 'pending' | null>(null)
  const [pollingActive, setPollingActive] = useState(false)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Repo Browser
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [reposLoading, setReposLoading] = useState(false)
  const [reposError, setReposError] = useState('')
  const [repoSearch, setRepoSearch] = useState('')
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)

  // APK/PWA
  const [appName, setAppName] = useState('')
  const [appColor, setAppColor] = useState('#3b82f6')
  const [apkGenerated, setApkGenerated] = useState(false)
  const [apkDownloadUrl, setApkDownloadUrl] = useState('')

  const selected = projects.find(p => p.id === selectedProjectId) || currentProject

  useEffect(() => {
    if (selected) {
      setRepoName(selected.name.replace(/\s+/g, '-').toLowerCase())
      setAppName(selected.name)
      if (selected.deployStatus === 'deployed' && selected.downloadUrl) {
        setDeployed(true)
        setDeployedUrl(selected.downloadUrl)
        setRepoUrl(selected.repoUrl || '')
      }
    }
  }, [selected?.id])

  const validateToken = async () => {
    if (!githubToken.trim()) return
    setValidatingToken(true)
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' }
      })
      const data = await res.json()
      if (res.ok) { setTokenValid(true); setGithubUser(data.login) }
      else setTokenValid(false)
    } catch { setTokenValid(false) }
    setValidatingToken(false)
  }

  const loadRepos = async () => {
    if (!githubToken.trim()) { setReposError('Enter GitHub token first'); return }
    setReposLoading(true)
    setReposError('')
    try {
      const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
        headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' }
      })
      if (!res.ok) throw new Error('Failed to load repos')
      const data = await res.json()
      setRepos(data)
    } catch (err: any) {
      setReposError(err.message || 'Failed to load repositories')
    }
    setReposLoading(false)
  }

  const filteredRepos = repos.filter(r =>
    !repoSearch || r.name.toLowerCase().includes(repoSearch.toLowerCase())
  )

  const handleRealDeploy = async () => {
    if (!selected || !repoName.trim()) return
    setDeploying(true); setDeployLog([]); setDeployProgress(0); setDeployed(false); setDeployError('')
    updateProject(selected.id, { deployStatus: 'connecting' })
    const files = selected.files
      .filter(f => f.content && !f.content.startsWith('data:'))
      .map(f => ({ path: f.name === 'index.html' ? 'index.html' : f.path || f.name, content: f.content || '' }))
    if (files.length === 0) {
      files.push({ path: 'index.html', content: `<!DOCTYPE html><html><head><title>${selected.name}</title></head><body><h1>${selected.name}</h1></body></html>` })
    }
    const result = await deployToGitHub({
      token: githubToken, username: githubUser, repoName, projectName: selected.name, files,
      onProgress: (step, progress) => {
        setDeployProgress(progress)
        setDeployLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`])
        if (progress > 20) updateProject(selected.id, { deployStatus: 'pushing' })
      },
    })
    if (result.success) {
      setDeployedUrl(result.pagesUrl || '')
      setRepoUrl(result.repoUrl || '')
      updateProject(selected.id, { deployStatus: 'deployed', repoUrl: result.repoUrl, qrCode: generateQRUrl(result.pagesUrl || ''), downloadUrl: result.pagesUrl, githubUser })
      setDeployed(true)
    } else {
      setDeployError(result.error || 'Deployment failed')
      updateProject(selected.id, { deployStatus: 'error' })
    }
    setDeploying(false)
  }

  const handleSimulatedDeploy = async () => {
    if (!selected || !repoName.trim()) return
    setDeploying(true); setDeployLog([]); setDeployProgress(0); setDeployed(false); setDeployError('')
    updateProject(selected.id, { deployStatus: 'connecting' })
    const steps = ['Authenticating...', 'Creating repository...', 'Uploading files...', 'Setting up Pages...', 'Finalizing...', 'Done!']
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 700))
      const p = Math.round(((i + 1) / steps.length) * 100)
      setDeployProgress(p)
      setDeployLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[i]}`])
      if (i === 1) updateProject(selected.id, { deployStatus: 'pushing' })
    }
    const url = `https://${githubUser}.github.io/${repoName}`
    const repo = `https://github.com/${githubUser}/${repoName}`
    setDeployedUrl(url); setRepoUrl(repo)
    updateProject(selected.id, { deployStatus: 'deployed', repoUrl: repo, qrCode: generateQRUrl(url), downloadUrl: url, githubUser })
    setDeployed(true); setDeploying(false)
  }

  const generateAPK = async () => {
    if (!selected) return
    const code = selected.files[0]?.content || ''
    const manifestJson = generatePWAManifest(appName || selected.name, appColor)
    const sw = generateServiceWorker()
    const regScript = `
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('PWA ready'))
    .catch(err => console.error('SW error:', err));
}
</script>`
    const pwaCode = code.replace('</head>', `<link rel="manifest" href="/manifest.json"><meta name="theme-color" content="${appColor}"></head>`).replace('</body>', `${regScript}</body>`)
    const content = `E-SMART-WORLD PWA Package\n${'='.repeat(50)}\n\nFile: index.html\n${'-'.repeat(40)}\n${pwaCode}\n\nFile: manifest.json\n${'-'.repeat(40)}\n${manifestJson}\n\nFile: sw.js\n${'-'.repeat(40)}\n${sw}\n\nINSTALLATION INSTRUCTIONS:\n${'='.repeat(50)}\n1. Upload all files to your web server or GitHub Pages\n2. Access via HTTPS (required for PWA)\n3. Click "Add to Home Screen" on mobile\n4. App installs like a native app!`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    setApkDownloadUrl(url)
    setApkGenerated(true)
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  }

  const downloadAPK = () => {
    const a = document.createElement('a')
    a.href = apkDownloadUrl
    a.download = `${appName || 'app'}-pwa-package.txt`
    a.click()
  }

  const copyUrl = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const exportProject = () => {
    if (!selected) return
    const data = JSON.stringify({ project: selected, exportedAt: new Date().toISOString() }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${selected.name}-backup.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const exportSourceCode = () => {
    if (!selected || selected.files.length === 0) return
    const mainFile = selected.files[0]
    const blob = new Blob([mainFile.content || ''], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = mainFile.name; a.click()
    URL.revokeObjectURL(url)
  }

  // Start polling GitHub Pages URL until it goes live
  const startPolling = (url: string) => {
    if (!url || pollingRef.current) return
    setSiteStatus('pending')
    setPollingActive(true)
    let attempts = 0
    pollingRef.current = setInterval(() => {
      attempts++
      // Use no-cors fetch to probe the URL
      fetch(url, { mode: 'no-cors', cache: 'no-store' })
        .then(() => {
          setSiteStatus('live')
          setPollingActive(false)
          if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
        })
        .catch(() => {
          setSiteStatus(attempts > 3 ? 'checking' : 'pending')
        })
      if (attempts >= 24) {
        setPollingActive(false)
        setSiteStatus('pending')
        if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
      }
    }, 5000)
  }

  useEffect(() => {
    if (deployed && deployedUrl) {
      startPolling(deployedUrl)
    }
    return () => {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
    }
  }, [deployed, deployedUrl])

  const githubAccounts = accounts.filter(a => a.platform === 'github')

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* Left: project + platform */}
      <div
        className="w-44 flex-shrink-0 border-r flex flex-col"
        style={{ borderColor: 'rgba(148,163,184,0.2)', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)' }}
      >
        <div className="px-3 py-2.5 border-b border-slate-100">
          <div className="font-hud text-[10px] font-bold text-emerald-600">PROJECTS</div>
        </div>
        <div className="flex-1 overflow-y-auto panel-scroll py-1">
          {projects.length === 0 ? (
            <div className="p-3 text-[10px] text-slate-300 text-center">No projects yet</div>
          ) : projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className="w-full flex flex-col gap-1 px-3 py-2.5 text-left border-l-[3px] transition-all"
              style={{
                borderLeftColor: selectedProjectId === p.id ? '#10b981' : 'transparent',
                background: selectedProjectId === p.id ? 'rgba(16,185,129,0.06)' : 'transparent',
              }}
            >
              <div className="text-[10px] font-bold text-slate-700 truncate">{p.name}</div>
              <StatusBadge status={(p.deployStatus || 'idle') as any} />
            </button>
          ))}
        </div>

        <div className="border-t border-slate-100 p-1.5">
          <div className="font-hud text-[8px] text-slate-300 mb-1.5 px-1">PLATFORM</div>
          {DEPLOY_TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all mb-0.5"
                style={{
                  background: activeTab === tab.id ? `${tab.color}12` : 'transparent',
                  borderLeft: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                }}
              >
                <Icon size={11} style={{ color: activeTab === tab.id ? tab.color : '#94a3b8' }} />
                <span className="font-hud text-[9px] font-bold" style={{ color: activeTab === tab.id ? tab.color : '#94a3b8' }}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto panel-scroll">

        {/* GITHUB DEPLOY */}
        {activeTab === 'github' && (
          <>
            <HudCard title="GITHUB DEPLOYMENT CONFIG" accent="green" compact>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-hud text-slate-500 mb-1 block flex items-center gap-1">
                    GITHUB ACCESS TOKEN
                    {tokenValid === true && <CheckCircle size={10} className="text-emerald-500" />}
                    {tokenValid === false && <AlertTriangle size={10} className="text-red-500" />}
                  </label>
                  <div className="flex gap-2">
                    <input className="input-hud flex-1" type="password" value={githubToken}
                      onChange={e => { setGithubToken(e.target.value); setTokenValid(null) }} placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" />
                    <button className="btn-bright-green px-3 text-[10px] flex items-center gap-1 flex-shrink-0" onClick={validateToken} disabled={validatingToken || !githubToken}>
                      {validatingToken ? <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" /> : 'TEST'}
                    </button>
                  </div>
                  {tokenValid === true && <div className="text-[10px] text-emerald-600 mt-1">✓ Token valid — user: @{githubUser}</div>}
                  {tokenValid === false && <div className="text-[10px] text-red-500 mt-1">✗ Invalid token — check permissions (needs "repo" scope)</div>}
                  <div className="text-[9px] text-slate-400 mt-0.5">Get token: github.com → Settings → Developer settings → Personal access tokens → repo scope</div>
                </div>
                <div>
                  <label className="text-[10px] font-hud text-slate-500 mb-1 block">GITHUB USERNAME</label>
                  <input className="input-hud" value={githubUser} onChange={e => setGithubUser(e.target.value)} placeholder="username" />
                </div>
                <div>
                  <label className="text-[10px] font-hud text-slate-500 mb-1 block">REPOSITORY NAME</label>
                  <input className="input-hud" value={repoName} onChange={e => setRepoName(e.target.value)} placeholder="my-project" />
                </div>
              </div>
              {githubAccounts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <div className="text-[9px] text-slate-400 w-full mb-1">SAVED ACCOUNTS:</div>
                  {githubAccounts.map(acc => (
                    <button key={acc.id} onClick={() => setGithubUser(acc.email?.split('@')[0] || acc.label)}
                      className="text-[9px] px-2.5 py-1 rounded-full font-hud border border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all">
                      {acc.label}
                    </button>
                  ))}
                </div>
              )}
            </HudCard>

            <HudCard title="DEPLOY" accent="gold" compact>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    className="btn-bright-green flex items-center gap-2"
                    onClick={githubToken.trim() ? handleRealDeploy : handleSimulatedDeploy}
                    disabled={deploying || !repoName.trim() || !selected}
                  >
                    {deploying ? <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Rocket size={12} />}
                    {deploying ? 'DEPLOYING...' : githubToken ? '🚀 DEPLOY (REAL)' : '🎭 DEPLOY (DEMO)'}
                  </button>
                  {selected && <StatusBadge status={(selected.deployStatus || 'idle') as any} animate={deploying} />}
                  {!githubToken && <span className="text-[9px] text-slate-400">No token = demo mode</span>}
                </div>
                {deployError && (
                  <div className="flex items-center gap-2 p-2 rounded-xl text-[10px] text-red-600" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertTriangle size={12} /> {deployError}
                  </div>
                )}
                {deployProgress > 0 && (
                  <div>
                    <div className="h-2.5 rounded-full overflow-hidden mb-1 bg-emerald-50 border border-emerald-100">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${deployProgress}%`, background: 'linear-gradient(90deg,#10b981,#3b82f6)', boxShadow: '0 0 8px rgba(16,185,129,0.4)' }} />
                    </div>
                    <div className="text-[10px] text-slate-400">{deployProgress}%</div>
                  </div>
                )}
                <div className="panel-scroll max-h-20 font-mono text-[9px] space-y-0.5">
                  {deployLog.map((l, i) => (
                    <div key={i} className={i === deployLog.length - 1 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>{l}</div>
                  ))}
                </div>
              </div>
            </HudCard>

            {deployed && deployedUrl && (
              <HudCard title="✅ DEPLOYMENT COMPLETE" accent="green" compact>
                <div className="mb-3 flex items-center gap-2 p-2.5 rounded-xl" style={{ background: siteStatus === 'live' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${siteStatus === 'live' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${siteStatus === 'live' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="font-hud text-[10px] font-bold flex-1" style={{ color: siteStatus === 'live' ? '#059669' : '#d97706' }}>
                    {siteStatus === 'live' ? '✅ SITE IS LIVE & ACCESSIBLE!' : siteStatus === 'pending' ? '⏳ GitHub Pages activating (1-3 min)...' : '🔄 Checking deployment status...'}
                  </span>
                  {pollingActive && <RefreshCw size={11} className="text-slate-400 animate-spin" />}
                  {siteStatus === 'live' && <CheckCircle size={11} className="text-emerald-500" />}
                </div>
                <div className="space-y-2">
                  {[{ label: 'LIVE URL', url: deployedUrl }, { label: 'REPO URL', url: repoUrl }].map(({ label, url }) => url ? (
                    <div key={label}>
                      <div className="text-[9px] text-slate-400 mb-1">{label}</div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <span className="text-[10px] text-emerald-700 flex-1 truncate">{url}</span>
                        <button onClick={() => copyUrl(url)} className="text-slate-400 hover:text-emerald-600 transition-all">
                          {copiedUrl ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                        <a href={url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-600 transition-all"><ExternalLink size={12} /></a>
                      </div>
                    </div>
                  ) : null)}
                  <button className="btn-bright-blue text-[10px] flex items-center gap-1" onClick={() => navigate('qr-codes')}>
                    <QrCode size={11} /> VIEW QR CODE
                  </button>
                </div>
              </HudCard>
            )}

            <HudCard title="GITHUB QUICK GUIDE" accent="blue" compact>
              <div className="space-y-2">
                {GITHUB_DOCS.map((doc, i) => (
                  <div key={i} className="p-2.5 rounded-xl" style={{ background: `${doc.color}06`, border: `1px solid ${doc.color}20` }}>
                    <div className="flex items-start gap-2">
                      <span className="text-base">{doc.icon}</span>
                      <div>
                        <div className="font-bold text-[10px]" style={{ color: doc.color }}>{doc.title}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{doc.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </HudCard>
          </>
        )}

        {/* GITHUB REPO BROWSER */}
        {activeTab === 'repobrowser' && (
          <>
            <HudCard title="GITHUB REPOSITORY BROWSER" subtitle="Browse and manage your GitHub repositories" accent="blue" compact>
              <div className="flex gap-2 mb-3">
                <input
                  className="input-hud flex-1 text-[11px]"
                  type="password"
                  placeholder="GitHub Access Token (ghp_xxxxxx)"
                  value={githubToken}
                  onChange={e => setGithubToken(e.target.value)}
                />
                <button className="btn-bright-blue flex items-center gap-2 flex-shrink-0" onClick={loadRepos} disabled={reposLoading}>
                  {reposLoading ? <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <RefreshCw size={12} />}
                  LOAD
                </button>
              </div>

              {repos.length > 0 && (
                <div className="relative mb-2">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    className="input-hud pl-8 text-[11px]"
                    placeholder="Search repositories..."
                    value={repoSearch}
                    onChange={e => setRepoSearch(e.target.value)}
                  />
                </div>
              )}

              {reposError && (
                <div className="text-[10px] text-red-600 p-2 rounded-xl bg-red-50 border border-red-100 mb-2">{reposError}</div>
              )}

              <div className="text-[9px] text-slate-400 mb-1">{filteredRepos.length} repositories</div>
            </HudCard>

            {repos.length > 0 && (
              <div className="space-y-2">
                {filteredRepos.map(repo => (
                  <div
                    key={repo.id}
                    className="rounded-2xl p-3 border transition-all hover:shadow-md cursor-pointer"
                    style={{
                      background: selectedRepo?.id === repo.id ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.9)',
                      border: selectedRepo?.id === repo.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(203,213,225,0.4)',
                    }}
                    onClick={() => setSelectedRepo(selectedRepo?.id === repo.id ? null : repo)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <GitBranch size={13} className="text-slate-400 flex-shrink-0" />
                        <div>
                          <div className="font-hud text-[11px] font-bold text-slate-700">{repo.name}</div>
                          {repo.description && <div className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate">{repo.description}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {repo.private && <span className="badge-glow-gold">PRIVATE</span>}
                        {repo.has_pages && <span className="badge-glow-green">PAGES</span>}
                        {repo.language && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{repo.language}</span>
                        )}
                      </div>
                    </div>

                    {selectedRepo?.id === repo.id && (
                      <div className="mt-3 space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-[9px]">
                          <div className="flex items-center gap-1 text-amber-600"><Star size={10} /> {repo.stargazers_count}</div>
                          <div className="flex items-center gap-1 text-blue-600"><GitFork size={10} /> {repo.forks_count}</div>
                          <div className="flex items-center gap-1 text-slate-500"><Archive size={10} /> {Math.round(repo.size / 1024)}MB</div>
                        </div>
                        {repo.homepage && (
                          <a href={repo.homepage} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-[10px] text-blue-600 hover:underline">
                            <Globe size={10} /> {repo.homepage}
                          </a>
                        )}
                        <div className="flex gap-2 mt-2">
                          <a href={repo.html_url} target="_blank" rel="noreferrer"
                            className="btn-bright-blue text-[10px] flex items-center gap-1.5 no-underline">
                            <Github size={11} /> Open on GitHub
                          </a>
                          {repo.homepage && (
                            <a href={repo.homepage} target="_blank" rel="noreferrer"
                              className="btn-bright-green text-[10px] flex items-center gap-1.5 no-underline">
                              <Globe size={11} /> Live Site
                            </a>
                          )}
                          <button
                            onClick={() => {
                              setGithubUser(repo.full_name.split('/')[0])
                              setRepoName(repo.name)
                              setActiveTab('github')
                            }}
                            className="btn-bright-purple text-[10px] flex items-center gap-1.5"
                          >
                            <Rocket size={11} /> Deploy to this Repo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {repos.length === 0 && !reposLoading && !reposError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Github size={40} className="mx-auto mb-3 text-slate-200" />
                  <div className="font-hud text-sm text-slate-400">ENTER TOKEN AND CLICK LOAD</div>
                  <div className="text-[11px] text-slate-300 mt-1">Browse all your GitHub repositories</div>
                </div>
              </div>
            )}
          </>
        )}

        {/* APK/PWA GENERATOR */}
        {activeTab === 'apk' && (
          <>
            <HudCard title="APK / PWA DOWNLOAD GENERATOR" subtitle="Package your project as an installable Progressive Web App" accent="orange" compact>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] font-hud text-slate-500 mb-1 block">APP NAME</label>
                  <input className="input-hud" placeholder="My Awesome App" value={appName} onChange={e => setAppName(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-hud text-slate-500 mb-1 block">THEME COLOR</label>
                  <div className="flex gap-2">
                    <input type="color" value={appColor} onChange={e => setAppColor(e.target.value)}
                      className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer bg-white p-1" />
                    <input className="input-hud flex-1" value={appColor} onChange={e => setAppColor(e.target.value)} />
                  </div>
                </div>
              </div>
              <button
                className="btn-bright-orange w-full flex items-center justify-center gap-2 py-2.5"
                onClick={generateAPK}
                disabled={!selected}
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', boxShadow: '0 4px 15px rgba(249,115,22,0.4)' }}
              >
                <Zap size={14} /> GENERATE PWA PACKAGE
              </button>
            </HudCard>

            {apkGenerated && (
              <HudCard title="✅ PWA PACKAGE READY" accent="green" compact>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div className="font-hud text-[11px] font-bold text-emerald-700 mb-2">Package Contents:</div>
                    <div className="space-y-1 text-[10px] text-emerald-600">
                      <div>📄 index.html — Your app with PWA injection</div>
                      <div>📋 manifest.json — App metadata & icons config</div>
                      <div>⚙️ sw.js — Service Worker for offline support</div>
                      <div>📝 Installation instructions</div>
                    </div>
                  </div>
                  <button
                    className="btn-bright-green w-full flex items-center justify-center gap-2"
                    onClick={downloadAPK}
                  >
                    <Download size={13} /> DOWNLOAD PWA PACKAGE
                  </button>
                  <div className="text-[10px] text-slate-500 space-y-1">
                    <div className="font-bold text-slate-600">📱 Install on Android:</div>
                    <div>1. Upload files to your GitHub Pages or web server</div>
                    <div>2. Open the URL in Chrome on Android</div>
                    <div>3. Tap ⋮ menu → "Add to Home screen"</div>
                    <div>4. App installs like a native app!</div>
                  </div>
                  <div className="text-[10px] text-slate-500 space-y-1">
                    <div className="font-bold text-slate-600">🍎 Install on iPhone:</div>
                    <div>1. Open the URL in Safari on iPhone</div>
                    <div>2. Tap Share button → "Add to Home Screen"</div>
                    <div>3. App installs with custom icon!</div>
                  </div>
                  <div className="p-2 rounded-xl text-[9px] text-slate-500" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    💡 For a full native Android APK, use Expo + EAS Build (see Expo Go tab)
                  </div>
                </div>
              </HudCard>
            )}

            {!apkGenerated && (
              <HudCard title="PWA vs NATIVE APK" accent="cyan" compact>
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <div className="font-bold text-orange-600 mb-2">✅ PWA (This Tool)</div>
                    <div className="space-y-1 text-slate-600">
                      <div>• Works on any device</div>
                      <div>• No Play Store needed</div>
                      <div>• Instant install via browser</div>
                      <div>• Offline support</div>
                      <div>• Free to distribute</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div className="font-bold text-emerald-600 mb-2">📦 Native APK (Expo)</div>
                    <div className="space-y-1 text-slate-600">
                      <div>• Full device access</div>
                      <div>• Play Store listing</div>
                      <div>• Push notifications</div>
                      <div>• App Store presence</div>
                      <div>• Use Expo Go tab →</div>
                    </div>
                  </div>
                </div>
              </HudCard>
            )}
          </>
        )}

        {/* EXPO TAB */}
        {activeTab === 'expo' && (
          <div className="space-y-3">
            <HudCard title="EXPO GO DEPLOYMENT GUIDE" accent="purple" compact>
              <div className="text-[10px] text-slate-500 mb-3">Follow these steps to deploy your React Native app with Expo Go</div>
              <div className="space-y-2">
                {EXPO_STEPS.map((s, i) => (
                  <button key={i}
                    className="w-full text-left p-3 rounded-xl border transition-all"
                    style={{ background: expandedStep === i ? 'rgba(139,92,246,0.06)' : 'rgba(248,250,252,0.8)', borderColor: expandedStep === i ? 'rgba(139,92,246,0.3)' : 'rgba(203,213,225,0.4)' }}
                    onClick={() => setExpandedStep(expandedStep === i ? null : i)}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{s.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-[10px] text-purple-600">Step {s.step}: {s.title}</div>
                        {expandedStep === i && <div className="text-[10px] text-slate-500 mt-1.5 bg-slate-50 p-2 rounded-lg font-mono">{s.desc}</div>}
                      </div>
                      {expandedStep === i ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </HudCard>
          </div>
        )}

        {/* PLAY STORE TAB */}
        {activeTab === 'playstore' && (
          <div className="space-y-3">
            <HudCard title="GOOGLE PLAY STORE — COMPLETE GUIDE" accent="gold" compact>
              <div className="text-[10px] text-slate-500 mb-3">Step-by-step guide for publishing on Google Play Store with full ownership documentation</div>
              <div className="space-y-2">
                {PLAYSTORE_STEPS.map((s, i) => (
                  <button key={i}
                    className="w-full text-left p-3 rounded-xl border transition-all"
                    style={{ background: expandedStep === i + 100 ? 'rgba(245,158,11,0.06)' : 'rgba(248,250,252,0.8)', borderColor: expandedStep === i + 100 ? 'rgba(245,158,11,0.3)' : 'rgba(203,213,225,0.4)' }}
                    onClick={() => setExpandedStep(expandedStep === i + 100 ? null : i + 100)}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{s.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-[10px] text-amber-700">Step {s.step}: {s.title}</div>
                        {expandedStep === i + 100 && <div className="text-[10px] text-slate-500 mt-1.5 bg-slate-50 p-2 rounded-lg font-mono">{s.desc}</div>}
                      </div>
                      {expandedStep === i + 100 ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </HudCard>
            <HudCard title="APP OWNERSHIP CHECKLIST" accent="red" compact>
              <div className="space-y-1.5 text-[10px]">
                {['Keep your keystore file SAFE — losing it means you cannot update the app', 'Save keystore password, key alias, and key password in Secure Vault', 'Enable 2FA on your Google account', 'Set up a recovery email and phone number', 'Download and backup your app bundle (.aab) file', 'Document your app.json / package name for future reference', 'Set up Google Play App Signing (recommended)'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                    <Shield size={10} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </HudCard>
          </div>
        )}

        {/* BACKUP TAB */}
        {activeTab === 'backup' && (
          <HudCard title="EXPORT & BACKUP" accent="orange" compact>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Export Source Code', icon: Download, action: exportSourceCode, desc: 'Download main project file', color: '#3b82f6' },
                { label: 'Export Project JSON', icon: FileArchive, action: exportProject, desc: 'Full project backup with metadata', color: '#10b981' },
                { label: 'Export All Projects', icon: Package, action: () => {
                  const data = JSON.stringify({ projects, exportedAt: new Date().toISOString() }, null, 2)
                  const blob = new Blob([data], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url; a.download = 'all-projects-backup.json'; a.click()
                  URL.revokeObjectURL(url)
                }, desc: 'Backup all projects at once', color: '#f59e0b' },
                { label: 'Copy Source Code', icon: Copy, action: () => { if (selected?.files[0]) navigator.clipboard.writeText(selected.files[0].content || '') }, desc: 'Copy to clipboard', color: '#8b5cf6' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <button key={i} onClick={item.action}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all hover:scale-105"
                    style={{ borderColor: `${item.color}25`, background: `${item.color}06` }}>
                    <Icon size={20} style={{ color: item.color }} />
                    <div className="font-hud text-[10px] font-bold text-center" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[9px] text-slate-400 text-center">{item.desc}</div>
                  </button>
                )
              })}
            </div>
          </HudCard>
        )}

        {/* DOCS TAB */}
        {activeTab === 'docs' && (
          <HudCard title="DEPLOYMENT DOCUMENTATION" accent="cyan" compact>
            <div className="space-y-3 text-[10px] text-slate-600">
              {[
                { title: '🌐 GitHub Pages', color: '#3b82f6', items: ['Your site URL: https://USERNAME.github.io/REPO-NAME', 'Free hosting for public repos', 'Custom domains supported', 'Auto-deploy on every push', 'HTTPS included by default'] },
                { title: '📱 Expo Go', color: '#8b5cf6', items: ['Share via QR code instantly', 'Published URL: exp://exp.host/@user/slug', 'Works on iOS and Android', 'Build standalone APK with EAS'] },
                { title: '🏪 Play Store Requirements', color: '#f59e0b', items: ['$25 one-time developer fee', 'targetSdkVersion 33+ required', 'Privacy policy URL required', 'Screenshots: phone + tablet', 'Feature graphic: 1024x500px', 'App icon: 512x512px PNG'] },
                { title: '📦 PWA Install', color: '#f97316', items: ['Works on any modern browser', 'Install from browser URL bar', 'Offline support via Service Worker', 'No app store required', 'Perfect for HTML/JS projects'] },
              ].map(section => (
                <div key={section.title} className="p-3 rounded-xl" style={{ background: `${section.color}05`, border: `1px solid ${section.color}20` }}>
                  <div className="font-bold mb-2" style={{ color: section.color }}>{section.title}</div>
                  <div className="space-y-1">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: section.color }} />{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </HudCard>
        )}
      </div>
    </div>
  )
}
