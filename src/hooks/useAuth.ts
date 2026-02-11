import { getCurrentUser, isSupabaseConfigured, onAuthStateChange } from '@/lib/supabase'
import {
  resetPassword as authResetPassword,
  signIn as authSignIn,
  signInWithOAuth as authSignInWithOAuth,
  signOut as authSignOut,
  signUp as authSignUp,
} from '@/lib/supabase'
import { authLoadingAtom, currentUserAtom, isAuthenticatedAtom } from '@/store/authAtom'
import type { User } from '@supabase/supabase-js'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'

export function useAuth() {
  const [user, setUser] = useAtom(currentUserAtom)
  const setAuthLoading = useSetAtom(authLoadingAtom)
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 初始化时检查认证状态
  useEffect(() => {
    const initAuth = async () => {
      if (!isSupabaseConfigured()) {
        setAuthLoading(false)
        return
      }

      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setAuthLoading(false)
    }

    initAuth()

    // 监听认证状态变化
    const { unsubscribe } = onAuthStateChange((user: User | null) => {
      setUser(user)
    })

    return () => {
      unsubscribe()
    }
  }, [setUser, setAuthLoading])

  // 邮箱密码登录
  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)

      const result = await authSignIn(email, password)

      if (result.error) {
        setError(result.error.message)
      } else if (result.user) {
        setUser(result.user)
      }

      setLoading(false)
      return result
    },
    [setUser],
  )

  // 邮箱密码注册
  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    const result = await authSignUp(email, password)

    if (result.error) {
      setError(result.error.message)
    }

    setLoading(false)
    return result
  }, [])

  // OAuth 登录
  const signInWithOAuth = useCallback(async (provider: 'google' | 'github') => {
    setLoading(true)
    setError(null)

    const result = await authSignInWithOAuth(provider)

    if (result.error) {
      setError(result.error.message)
    }

    setLoading(false)
    return result
  }, [])

  // 退出登录
  const signOut = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await authSignOut()

    if (result.error) {
      setError(result.error.message)
    } else {
      setUser(null)
    }

    setLoading(false)
    return result
  }, [setUser])

  // 重置密码
  const resetPassword = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)

    const result = await authResetPassword(email)

    if (result.error) {
      setError(result.error.message)
    }

    setLoading(false)
    return result
  }, [])

  return {
    user,
    isAuthenticated,
    isConfigured: isSupabaseConfigured(),
    loading,
    error,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    resetPassword,
    clearError: () => setError(null),
  }
}
