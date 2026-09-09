import { useState, useCallback } from 'react'
import type { NavSection, Project, SavedAccount, VaultEntry, AppSettings, AIMessage } from '@/types'
import { loadFromStorage, saveToStorage, STORAGE_KEYS, generateId, formatDate } from '@/lib/utils'
import { DEFAULT_GITHUB_USER, DEFAULT_REPO_NAME } from '@/constants'

const defaultSettings: AppSettings = {
  lockType: '4digit',
  lockCode: '1234',
  githubToken: '',
  githubUser: DEFAULT_GITHUB_USER,
  defaultRepo: DEFAULT_REPO_NAME,
  theme: 'dark',
}

export function useAppStore() {
  const [activeSection, setActiveSection] = useState<NavSection>('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage(STORAGE_KEYS.projects, []))
  const [accounts, setAccounts] = useState<SavedAccount[]>(() => loadFromStorage(STORAGE_KEYS.accounts, [
    {
      id: 'default-github',
      platform: 'github',
      label: 'GitHub (Default)',
      email: 'drmirfan5577@gmail.com',
      url: 'https://github.com/drmirfan5577',
      token: '',
      verified: false,
    }
  ]))
  const [vault, setVault] = useState<VaultEntry[]>(() => loadFromStorage(STORAGE_KEYS.vault, []))
  const [settings, setSettings] = useState<AppSettings>(() => loadFromStorage(STORAGE_KEYS.settings, defaultSettings))
  const [vaultUnlocked, setVaultUnlocked] = useState(false)
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(() => loadFromStorage(STORAGE_KEYS.aiMessages, []))
  const [aiOpen, setAiOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  const navigate = useCallback((section: NavSection) => {
    setActiveSection(section)
  }, [])

  const addProject = useCallback((project: Project) => {
    setProjects(prev => {
      const updated = [project, ...prev]
      saveToStorage(STORAGE_KEYS.projects, updated)
      return updated
    })
    setCurrentProject(project)
  }, [])

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p)
      saveToStorage(STORAGE_KEYS.projects, updated)
      return updated
    })
    setCurrentProject(prev => prev?.id === id ? { ...prev, ...updates } : prev)
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id)
      saveToStorage(STORAGE_KEYS.projects, updated)
      return updated
    })
    if (currentProject?.id === id) setCurrentProject(null)
  }, [currentProject])

  const addAccount = useCallback((account: Omit<SavedAccount, 'id'>) => {
    const newAcc: SavedAccount = { ...account, id: generateId() }
    setAccounts(prev => {
      const updated = [...prev, newAcc]
      saveToStorage(STORAGE_KEYS.accounts, updated)
      return updated
    })
  }, [])

  const removeAccount = useCallback((id: string) => {
    setAccounts(prev => {
      const updated = prev.filter(a => a.id !== id)
      saveToStorage(STORAGE_KEYS.accounts, updated)
      return updated
    })
  }, [])

  const addVaultEntry = useCallback((entry: Omit<VaultEntry, 'id' | 'createdAt'>) => {
    const newEntry: VaultEntry = { ...entry, id: generateId(), createdAt: formatDate() }
    setVault(prev => {
      const updated = [newEntry, ...prev]
      saveToStorage(STORAGE_KEYS.vault, updated)
      return updated
    })
  }, [])

  const deleteVaultEntry = useCallback((id: string) => {
    setVault(prev => {
      const updated = prev.filter(v => v.id !== id)
      saveToStorage(STORAGE_KEYS.vault, updated)
      return updated
    })
  }, [])

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...updates }
      saveToStorage(STORAGE_KEYS.settings, updated)
      return updated
    })
  }, [])

  const addAiMessage = useCallback((msg: Omit<AIMessage, 'id' | 'timestamp'>) => {
    const newMsg: AIMessage = { ...msg, id: generateId(), timestamp: new Date().toISOString() }
    setAiMessages(prev => {
      const updated = [...prev, newMsg]
      saveToStorage(STORAGE_KEYS.aiMessages, updated)
      return updated
    })
    return newMsg
  }, [])

  const clearAiMessages = useCallback(() => {
    setAiMessages([])
    saveToStorage(STORAGE_KEYS.aiMessages, [])
  }, [])

  return {
    activeSection, setActiveSection, navigate,
    sidebarOpen, setSidebarOpen,
    projects, addProject, updateProject, deleteProject,
    accounts, addAccount, removeAccount,
    vault, addVaultEntry, deleteVaultEntry,
    settings, updateSettings,
    vaultUnlocked, setVaultUnlocked,
    aiMessages, addAiMessage, clearAiMessages,
    aiOpen, setAiOpen,
    currentProject, setCurrentProject,
  }
}

export type AppStore = ReturnType<typeof useAppStore>
