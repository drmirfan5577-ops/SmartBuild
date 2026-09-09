export const APP_NAME = 'E-SMART-WORLD'
export const APP_TAGLINE = 'E.S wOrLd'
export const APP_VERSION = 'v2.0.0'
export const APP_SUBDOMAIN = 'es-oneworld'
export const APP_URL = 'https://es-oneworld.onspace.app'

export const DEFAULT_GITHUB_USER = 'drmirfan5577'
export const DEFAULT_EMAIL = 'drmirfan5577@gmail.com'
export const DEFAULT_REPO_NAME = 'E-SMART-WORLD'

export const NAV_SECTIONS = [
  { id: 'home', label: 'DASHBOARD', icon: 'LayoutDashboard' },
  { id: 'import', label: 'IMPORT PROJECT', icon: 'Upload' },
  { id: 'templates', label: 'TEMPLATES', icon: 'LayoutTemplate' },
  { id: 'process', label: 'PROCESS & BUILD', icon: 'Cpu' },
  { id: 'editor', label: 'FILE EDITOR', icon: 'Code2' },
  { id: 'deploy', label: 'DEPLOY', icon: 'Rocket' },
  { id: 'portfolio', label: 'PORTFOLIO & QR', icon: 'QrCode' },
  { id: 'accounts', label: 'ACCOUNTS', icon: 'Link' },
  { id: 'ai-secretary', label: 'AI SECRETARY', icon: 'Bot' },
  { id: 'history', label: 'HISTORY', icon: 'History' },
  { id: 'admin', label: 'ADMIN PANEL', icon: 'Shield' },
  { id: 'about', label: 'ABOUT & LEGAL', icon: 'Info' },
  { id: 'settings', label: 'SETTINGS', icon: 'Settings' },
] as const

export const IMPORT_METHODS = [
  { id: 'paste-code', label: 'Paste Code / HTML', icon: 'ClipboardPaste', desc: 'Paste any HTML, code or project files directly' },
  { id: 'local-storage', label: 'Browse ZIP Files', icon: 'FolderOpen', desc: 'Access ZIP files from device storage' },
  { id: 'multi-file', label: 'Multi-File Paste', icon: 'Files', desc: 'Copy & paste all project files at once' },
  { id: 'internal-storage', label: 'Internal Storage', icon: 'HardDrive', desc: 'Import from device internal storage' },
  { id: 'whatsapp', label: 'WhatsApp / Apps', icon: 'MessageCircle', desc: 'Import files forwarded via messaging apps' },
  { id: 'url', label: 'URL / Website', icon: 'Globe', desc: 'Import project from a URL or WPA link' },
  { id: 'cloud', label: 'Cloud Storage', icon: 'Cloud', desc: 'Import from verified cloud storage (OTP secured)' },
  { id: 'ai-modal', label: 'AI Models', icon: 'Sparkles', desc: 'Import via Claude, Qwen, GenSpark, Perplexity' },
] as const

export const AI_MODELS = [
  { id: 'claude', label: 'Claude', color: '#ff7043' },
  { id: 'qwen', label: 'Q-wen', color: '#1976d2' },
  { id: 'gemini', label: 'Gemini', color: '#00bcd4' },
  { id: 'chatgpt', label: 'ChatGPT', color: '#4caf50' },
  { id: 'genspark', label: 'GenSpark', color: '#9c27b0' },
  { id: 'perplexity', label: 'Perplexity', color: '#ff5722' },
] as const

export const VAULT_CATEGORIES = [
  { id: 'link', label: 'Links', icon: 'Link2' },
  { id: 'note', label: 'Notes', icon: 'FileText' },
  { id: 'credential', label: 'Credentials', icon: 'Key' },
  { id: 'code', label: 'Code Snippets', icon: 'Code2' },
] as const
