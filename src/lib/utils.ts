import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export function formatTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false })
}

export function formatDate(): string {
  return new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function generateQRUrl(text: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}&bgcolor=070d1a&color=00e5ff&margin=10`
}

export function detectProjectType(content: string, filename: string): import('@/types').ProjectType {
  if (filename.endsWith('.zip')) return 'zip'
  if (content.includes('react-native') || content.includes('expo')) return 'react-native'
  if (content.includes('<!DOCTYPE html') || content.includes('<html')) return 'html'
  if (content.includes('"react"') && content.includes('jsx')) return 'react'
  if (content.includes('angular')) return 'angular'
  if (content.includes('vue')) return 'vue'
  return 'html'
}

export function simulateProcessing(steps: string[], onStep: (step: string, progress: number) => void): Promise<void> {
  return new Promise((resolve) => {
    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        onStep(steps[i], Math.round(((i + 1) / steps.length) * 100))
        i++
      } else {
        clearInterval(interval)
        resolve()
      }
    }, 600)
  })
}

export const STORAGE_KEYS = {
  projects: 'esw_projects',
  accounts: 'esw_accounts',
  vault: 'esw_vault',
  settings: 'esw_settings',
  vaultLocked: 'esw_vault_locked',
  aiMessages: 'esw_ai_messages',
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage save error:', e)
  }
}
