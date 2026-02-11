import type { User } from '@supabase/supabase-js'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// 当前登录用户
export const currentUserAtom = atom<User | null>(null)

// 认证加载状态
export const authLoadingAtom = atom<boolean>(true)

// 是否已登录
export const isAuthenticatedAtom = atom((get) => !!get(currentUserAtom))

// 用户偏好设置 (本地存储)
export const userPreferencesAtom = atomWithStorage<{
  syncEnabled: boolean
  lastSyncAt: string | null
}>('user-preferences', {
  syncEnabled: true,
  lastSyncAt: null,
})
