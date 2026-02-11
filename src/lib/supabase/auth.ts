import { isSupabaseConfigured, supabase } from './client'
import noop from '@/utils/noop'
import type { AuthError, Session, User } from '@supabase/supabase-js'

export type AuthResult = {
  user: User | null
  session: Session | null
  error: AuthError | null
}

/**
 * 使用邮箱和密码注册
 */
export async function signUp(email: string, password: string): Promise<AuthResult> {
  if (!supabase) {
    return {
      user: null,
      session: null,
      error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError,
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return {
    user: data.user,
    session: data.session,
    error,
  }
}

/**
 * 使用邮箱和密码登录
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!supabase) {
    return {
      user: null,
      session: null,
      error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError,
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return {
    user: data.user,
    session: data.session,
    error,
  }
}

/**
 * 使用 OAuth 登录 (Google, GitHub 等)
 */
export async function signInWithOAuth(
  provider: 'google' | 'github',
): Promise<{ error: AuthError | null }> {
  if (!supabase) {
    return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError }
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { error }
}

/**
 * 退出登录
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  if (!supabase) {
    return { error: null }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * 获取当前用户
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) {
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * 获取当前会话
 */
export async function getSession(): Promise<Session | null> {
  if (!supabase) {
    return null
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!supabase) {
    return { unsubscribe: noop }
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user ?? null)
  })

  return { unsubscribe: () => subscription.unsubscribe() }
}

/**
 * 发送密码重置邮件
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  if (!supabase) {
    return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  return { error }
}

/**
 * 更新密码
 */
export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  if (!supabase) {
    return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  return { error }
}

export { isSupabaseConfigured }
