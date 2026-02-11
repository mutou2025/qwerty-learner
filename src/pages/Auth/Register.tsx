import Layout from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import IconCheck from '~icons/tabler/check'
import IconLoader from '~icons/tabler/loader-2'
import IconLock from '~icons/tabler/lock'
import IconMail from '~icons/tabler/mail'

export default function Register() {
  const { signUp, loading, error, clearError, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return
    }

    const result = await signUp(email, password)
    if (!result.error) {
      setSuccess(true)
    }
  }

  if (!isConfigured) {
    return (
      <Layout hideSidebar>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
              注册
            </h1>
            <div className="rounded-lg bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              <p className="mb-2 font-medium">云同步功能未配置</p>
              <p className="text-sm">
                请在 <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">.env</code>{' '}
                文件中配置 Supabase 凭据
              </p>
            </div>
            <Link to="/" className="mt-6 block text-center text-indigo-500 hover:text-indigo-600">
              返回首页
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (success) {
    return (
      <Layout hideSidebar>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <IconCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">
              注册成功！
            </h1>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              我们已向 <span className="font-medium text-gray-800 dark:text-white">{email}</span>{' '}
              发送了一封验证邮件。 请查收邮件并点击验证链接完成注册。
            </p>
            <Link
              to="/login"
              className="block w-full rounded-lg bg-indigo-500 py-3 text-center font-medium text-white transition-colors hover:bg-indigo-600"
            >
              前往登录
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
            注册
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
                  placeholder="至少 6 位字符"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-indigo-800"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                确认密码
              </label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  required
                  minLength={6}
                  className={`w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:border-gray-600 dark:focus:ring-indigo-800'
                  }`}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-500">密码不匹配</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (confirmPassword !== '' && password !== confirmPassword)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 py-3 font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <IconLoader className="h-5 w-5 animate-spin" />}
              注册
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            已有账号？{' '}
            <Link to="/login" className="font-medium text-indigo-500 hover:text-indigo-600">
              立即登录
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
