import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import IconCloud from '~icons/tabler/cloud'
import IconCloudOff from '~icons/tabler/cloud-off'
import IconCrown from '~icons/tabler/crown'
import IconDownload from '~icons/tabler/download'
import IconLoader from '~icons/tabler/loader-2'
import IconLock from '~icons/tabler/lock'
import IconLogout from '~icons/tabler/logout'
import IconMail from '~icons/tabler/mail'
import IconRefresh from '~icons/tabler/refresh'
import IconSettings from '~icons/tabler/settings'
import IconUser from '~icons/tabler/user'

type TabType = 'profile' | 'login' | 'membership'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isConfigured, signOut, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleRefreshMembership = async () => {
    setIsRefreshing(true)
    // 模拟刷新
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'profile', label: '个人资料' },
    { id: 'login', label: '登录设置' },
    { id: 'membership', label: '会员设置' },
  ]

  // 未配置 Supabase
  if (!isConfigured) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <IconCloudOff className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">
              云同步未启用
            </h1>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              云同步功能需要配置 Supabase。您的学习数据目前仅保存在本地。
            </p>
            <Link to="/" className="mt-6 block text-center text-indigo-500 hover:text-indigo-600">
              返回首页
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // 未登录
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <IconUser className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
            <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">
              登录以同步数据
            </h1>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              登录后，您的学习进度将自动同步到云端，可在多设备间无缝切换。
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full rounded-lg bg-indigo-500 py-3 text-center font-medium text-white transition-colors hover:bg-indigo-600"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="block w-full rounded-lg border border-gray-300 bg-white py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                注册新账号
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // 已登录
  return (
    <Layout>
      <Header>
        <div className="flex items-center gap-2">
          <IconSettings className="h-5 w-5 text-indigo-500" />
          <span className="font-medium text-gray-800 dark:text-white">个人资料 & 设置</span>
        </div>
      </Header>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto w-[65%]">
          {/* Tab 导航 */}
          <div className="mb-6 flex overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 个人资料 Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* 用户信息卡片 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="头像"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <IconUser className="h-8 w-8 text-indigo-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {user?.user_metadata?.full_name || user?.user_metadata?.name || '用户'}
                    </h2>
                    <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <IconMail className="h-4 w-4" />
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* 同步状态 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <IconCloud className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">云同步</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">数据自动同步到云端</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    已启用
                  </span>
                </div>
              </div>

              {/* 快捷入口 */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  to="/analysis"
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <span className="text-gray-700 dark:text-white">学习统计</span>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  to="/error-book"
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <span className="text-gray-700 dark:text-white">错题本</span>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>
          )}

          {/* 登录设置 Tab */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              {/* 账号信息 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-800 dark:text-white">
                  <IconMail className="h-5 w-5" />
                  账号信息
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-gray-500 dark:text-gray-400">
                      邮箱
                    </label>
                    <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-gray-700 dark:bg-gray-700 dark:text-white">
                      {user?.email}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-500 dark:text-gray-400">
                      注册时间
                    </label>
                    <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-gray-700 dark:bg-gray-700 dark:text-white">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('zh-CN')
                        : '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 安全设置 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-800 dark:text-white">
                  <IconLock className="h-5 w-5" />
                  安全设置
                </h3>
                <button className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-left text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                  修改密码
                </button>
              </div>

              {/* 退出登录 */}
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
              >
                {loading ? (
                  <IconLoader className="h-5 w-5 animate-spin" />
                ) : (
                  <IconLogout className="h-5 w-5" />
                )}
                退出登录
              </button>
            </div>
          )}

          {/* 会员设置 Tab */}
          {activeTab === 'membership' && (
            <div className="space-y-6">
              {/* 会员中心卡片 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                      <IconCrown className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">会员中心</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        管理您的会员状态和订阅
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefreshMembership}
                      disabled={isRefreshing}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <IconRefresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      刷新会员状态
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">未激活</span>
                  </div>
                </div>
              </div>

              {/* 会员状态 */}
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <IconCrown className="h-10 w-10 text-gray-300 dark:text-gray-500" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
                  您还不是会员
                </h3>
                <p className="mb-6 text-gray-500 dark:text-gray-400">
                  升级到会员，享受更多功能和特权
                </p>
                <button className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-500">
                  <IconDownload className="h-5 w-5" />
                  升级到会员
                </button>
              </div>

              {/* 会员特权说明 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 font-medium text-gray-800 dark:text-white">会员特权</h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      ✓
                    </span>
                    无限个人词库
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      ✓
                    </span>
                    高级学习统计报告
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      ✓
                    </span>
                    数据导出功能
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      ✓
                    </span>
                    去除广告
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
