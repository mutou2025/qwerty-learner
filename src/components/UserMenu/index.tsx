import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import IconLogin from '~icons/tabler/login'
import IconUser from '~icons/tabler/user'

/**
 * 用户菜单组件
 * 显示在 Header 右侧
 * - 未登录: 显示登录按钮
 * - 已登录: 显示用户头像
 */
export default function UserMenu() {
  const { user, isAuthenticated, isConfigured } = useAuth()

  // 未配置 Supabase 时不显示
  if (!isConfigured) {
    return null
  }

  // 未登录显示登录按钮
  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
      >
        <IconLogin className="h-4 w-4" />
        <span className="hidden sm:inline">登录</span>
      </Link>
    )
  }

  // 已登录显示用户头像
  return (
    <Link
      to="/profile"
      className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-indigo-100 transition-transform hover:scale-105 dark:bg-indigo-900/30"
      title={user?.email || '个人中心'}
    >
      {user?.user_metadata?.avatar_url ? (
        <img
          src={user.user_metadata.avatar_url}
          alt="头像"
          className="h-full w-full object-cover"
        />
      ) : (
        <IconUser className="h-5 w-5 text-indigo-500" />
      )}
    </Link>
  )
}
