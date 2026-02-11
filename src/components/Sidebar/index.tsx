import SidebarItem from './SidebarItem'
import logo from '@/assets/logo.svg'
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

export const brandStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 10px',
  borderRadius: 14,
}

export const brandIconStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  padding: '4px 0',
  borderRadius: 12,
  display: 'grid',
  placeItems: 'center',
  color: '#5b6cff',

  // background: 'rgba(91, 108, 255, 0.10)',
  // border: '1px solid rgba(91, 108, 255, 0.14)',
}

export const brandTextStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 1.1,
}

export const brandTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: '0.2px',
  color: 'rgba(25, 28, 35, 0.92)',
}

export const brandSubStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  color: 'rgba(25, 28, 35, 0.5)',
}

export default function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Logo */}
      <div className="px-5 py-6">
        <NavLink to="/" className="flex items-center gap-2.5">
          {/* <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
            ECHO
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Learner</span> */}

          <div style={brandIconStyle} aria-hidden>
            <img
              src={logo}
              style={{ width: '100%', height: '100%', display: 'block' }}
              alt="Echo Learner Logo"
            />
            {/* <Icon icon="lucide:audio-lines" width={22} height={22} /> */}
          </div>

          <div style={brandTextStyle}>
            {/* 中文名：建议用“回声学苑 / 回声学堂 / 回声口语”其一 */}
            <div style={brandTitleStyle}>ECHO&nbsp;Learner</div>
            <div style={brandSubStyle}>
              <span className="font-bold text-gray-500 dark:text-gray-400">精听实验室</span>{' '}
            </div>
          </div>
        </NavLink>
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 space-y-1 px-3">
        <SidebarItem to="/" icon={<IconHome />} label="主页" />
        <SidebarItem to="/gallery" icon={<IconChartBar />} label="词库" />
        <SidebarItem to="/analysis" icon={<IconChartLine />} label="学习统计" />
        <SidebarItem to="/error-book" icon={<IconBook />} label="错题本" />
        <SidebarItem to="/dictation" icon={<IconArticle />} label="听写" />
        <SidebarItem to="/speaking" icon={<IconMicrophone />} label="口语跟读" />
        <SidebarItem to="/my-dictionary" icon={<IconBooks />} label="个人词库" />
        <SidebarItem to="/review" icon={<IconCalendar />} label="练习计划" />
        <SidebarItem to="/profile" icon={<IconUser />} label="个人资料" />
      </nav>
    </aside>
  )
}
