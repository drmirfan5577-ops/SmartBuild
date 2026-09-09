export type NavSection =
  | 'home'
  | 'import'
  | 'templates'
  | 'process'
  | 'editor'
  | 'deploy'
  | 'portfolio'
  | 'qr-codes'
  | 'accounts'
  | 'vault'
  | 'ai-secretary'
  | 'history'
  | 'settings'
  | 'admin'
  | 'about'

export type ImportMethod =
  | 'paste-code'
  | 'local-storage'
  | 'multi-file'
  | 'internal-storage'
  | 'whatsapp'
  | 'url'
  | 'cloud'
  | 'ai-modal'

export type ProjectType = 'html' | 'react-native' | 'zip' | 'react' | 'vue' | 'angular' | 'unknown'

export type ProcessStatus = 'idle' | 'analyzing' | 'processing' | 'ready' | 'error'

export type DeployStatus = 'idle' | 'connecting' | 'pushing' | 'deployed' | 'error'

export interface Project {
  id: string
  name: string
  type: ProjectType
  status: ProcessStatus
  deployStatus: DeployStatus
  files: ProjectFile[]
  createdAt: string
  repoUrl?: string
  qrCode?: string
  downloadUrl?: string
  githubUser?: string
}

export interface ProjectFile {
  name: string
  path: string
  content?: string
  size?: number
  type: string
}

export interface SavedAccount {
  id: string
  platform: 'github' | 'expo' | 'cloud' | 'ai'
  label: string
  url?: string
  email?: string
  token?: string
  verified: boolean
}

export interface VaultEntry {
  id: string
  title: string
  content: string
  category: 'link' | 'note' | 'credential' | 'code'
  createdAt: string
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type LockType = '4digit' | 'pattern' | 'text' | 'none'

export interface AppSettings {
  lockType: LockType
  lockCode: string
  githubToken: string
  githubUser: string
  defaultRepo: string
  theme: string
}
