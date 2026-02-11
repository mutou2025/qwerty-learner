import { useLayoutContext } from '@/components/Layout/context'
import UserMenu from '@/components/UserMenu'
import type { PropsWithChildren } from 'react'
import type React from 'react'
import IconPanelLeftClose from '~icons/lucide/panel-left-close'
import IconPanelLeftOpen from '~icons/lucide/panel-left-open'

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  const layoutContext = useLayoutContext()
  const isSidebarCollapsed = layoutContext?.isSidebarCollapsed ?? false
  const toggleSidebar = layoutContext?.toggleSidebar

  return (
    <header className="container z-20 mx-auto w-full px-10 py-6">
      <div className="flex w-full items-center justify-end">
        {toggleSidebar && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="mr-2 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={isSidebarCollapsed ? '展开导航栏' : '折叠导航栏'}
            title={isSidebarCollapsed ? '展开导航栏' : '折叠导航栏'}
          >
            {isSidebarCollapsed ? (
              <IconPanelLeftOpen className="h-5 w-5" />
            ) : (
              <IconPanelLeftClose className="h-5 w-5" />
            )}
          </button>
        )}
        <nav className="my-card on element flex w-auto content-center items-center justify-end space-x-3 rounded-xl bg-white p-4 transition-colors duration-300 dark:bg-gray-800">
          {children}
          <UserMenu />
        </nav>
      </div>
    </header>
  )
}

export default Header
