import Layout from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import IconBrandGithub from '~icons/tabler/brand-github'
import IconBrandGoogle from '~icons/tabler/brand-google'
import IconLoader from '~icons/tabler/loader-2'
import IconLock from '~icons/tabler/lock'
import IconMail from '~icons/tabler/mail'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithOAuth, loading, error, clearError, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn(email, password)
    if (!result.error) {
      navigate('/')
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    await signInWithOAuth(provider)
  }

  if (!isConfigured) {
    return (
      <Layout hideSidebar>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
              登录
            </h1>
            <div className="rounded-lg bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              <p className="mb-2 font-medium">云同步功能未配置</p>
              <p className="text-sm">
                请在 <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">.env</code>{' '}
                文件中配置 Supabase 凭据：
              </p>
              <pre className="mt-2 text-left text-xs">
                {`VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key`}
              </pre>
            </div>
            <Link to="/" className="mt-6 block text-center text-indigo-500 hover:text-indigo-600">
              返回首页
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout hideSidebar>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
            登录
          </h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
              <button
                onClick={clearError}
                className="ml-2 text-red-800 hover:underline dark:text-red-300"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                邮箱
              </label>
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-indigo-800"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                密码
              </label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-indigo-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 py-3 font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <IconLoader className="h-5 w-5 animate-spin" />}
              登录
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">或</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <IconBrandGoogle className="h-5 w-5" />
              使用 Google 登录
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <IconBrandGithub className="h-5 w-5" />
              使用 GitHub 登录
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            还没有账号？{' '}
            <Link to="/register" className="font-medium text-indigo-500 hover:text-indigo-600">
              立即注册
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
