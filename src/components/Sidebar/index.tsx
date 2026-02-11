import SidebarItem from './SidebarItem'
import logo from '@/assets/logo.svg'
import { useLayoutContext } from '@/components/Layout/context'
import { NavLink } from 'react-router-dom'
// import IconArticle from '~icons/tabler/article'
// import IconBook from '~icons/tabler/book'
// import IconBooks from '~icons/tabler/books'
// import IconCalendar from '~icons/tabler/calendar'
// import IconChartBar from '~icons/tabler/chart-bar'
// import IconChartLine from '~icons/tabler/chart-line'
// import IconHome from '~icons/tabler/home'
// import IconMicrophone from '~icons/tabler/microphone'
// import IconUser from '~icons/tabler/user'
// 听写
import IconArticle from '~icons/lucide/audio-lines'
// 学习统计
import IconChartLine from '~icons/lucide/bar-chart-3'
// 错题本
import IconBook from '~icons/lucide/book-x'
// 个人词库
import IconBooks from '~icons/lucide/bookmark'
// 练习计划
import IconCalendar from '~icons/lucide/calendar-check-2'
// 主页
import IconHome from '~icons/lucide/home'
// 词库
import IconChartBar from '~icons/lucide/library'
// 口语跟练
import IconMicrophone from '~icons/lucide/mic'
// 个人资料
import IconUser from '~icons/lucide/user'

export default function Sidebar() {
  const layoutContext = useLayoutContext()
  const collapsed = layoutContext?.isSidebarCollapsed ?? false

  return (
    <aside
      className={`flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
        collapsed ? 'w-[82px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`py-6 ${collapsed ? 'px-3' : 'px-4'}`}>
        <NavLink
          to="/"
          className={`group flex rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-colors hover:border-indigo-200 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800 ${
            collapsed ? 'justify-center p-3' : 'items-center gap-3 p-3'
          }`}
          title={collapsed ? 'Echo Learner 精听实验室' : undefined}
        >
          <div
            className={`grid place-items-center rounded-xl bg-white/80 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 ${
              collapsed ? 'h-10 w-10 p-1.5' : 'h-11 w-11 p-2'
            }`}
            aria-hidden
          >
            <img
              src={logo}
              style={{ width: '100%', height: '100%', display: 'block' }}
              alt="Echo Learner Logo"
            />
          </div>

          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[15px] font-semibold tracking-[0.15px] text-gray-900 dark:text-gray-100">
                ECHO Learner
              </div>
              <div className="mt-1 text-[12px] font-medium text-gray-500 dark:text-gray-400">
                精听实验室
              </div>
              <div className="mt-1.5 text-[12px] font-semibold tracking-[0.3px] text-indigo-600 dark:text-indigo-300">
                听见·模仿·成为
              </div>
            </div>
          )}
        </NavLink>
      </div>

      {/* 菜单列表 */}
      <nav className={`flex-1 space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
        <SidebarItem to="/" icon={<IconHome />} label="主页" collapsed={collapsed} />
        <SidebarItem to="/gallery" icon={<IconChartBar />} label="词库" collapsed={collapsed} />
        <SidebarItem
          to="/analysis"
          icon={<IconChartLine />}
          label="学习统计"
          collapsed={collapsed}
        />
        <SidebarItem to="/error-book" icon={<IconBook />} label="错题本" collapsed={collapsed} />
        <SidebarItem to="/dictation" icon={<IconArticle />} label="听写" collapsed={collapsed} />
        <SidebarItem
          to="/speaking"
          icon={<IconMicrophone />}
          label="口语跟读"
          collapsed={collapsed}
        />
        <SidebarItem
          to="/my-dictionary"
          icon={<IconBooks />}
          label="个人词库"
          collapsed={collapsed}
        />
        <SidebarItem to="/review" icon={<IconCalendar />} label="练习计划" collapsed={collapsed} />
        <SidebarItem to="/profile" icon={<IconUser />} label="个人资料" collapsed={collapsed} />
      </nav>
    </aside>
  )
}
