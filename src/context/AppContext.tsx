import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { useAppStore, type AppStore } from '@/stores/appStore'
import { supabase } from '@/lib/supabase'

export interface AuthUser {
  id: string
  email: string
  username: string
  avatar?: string
}

export interface AppContextValue extends AppStore {
  user: AuthUser | null
  authLoading: boolean
  login: (user: AuthUser) => void
  logout: () => Promise<void>
}

function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    username: user.user_metadata?.username || user.user_metadata?.full_name || user.email!.split('@')[0],
    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
  }
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useAppStore()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const login = (authUser: AuthUser) => setUser(authUser)

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  useEffect(() => {
    let mounted = true

    // Safety #1: Check existing session on page load/refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user) {
        setUser(mapSupabaseUser(session.user))
      }
      if (mounted) setAuthLoading(false)
    })

    // Safety #2: Listen to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(mapSupabaseUser(session.user))
          setAuthLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setAuthLoading(false)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(mapSupabaseUser(session.user))
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AppContext.Provider value={{ ...store, user, authLoading, login, logout }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
