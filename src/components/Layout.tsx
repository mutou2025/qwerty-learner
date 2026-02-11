import Footer from './Footer'
import { LayoutContext } from './Layout/context'
import Sidebar from './Sidebar'
import type React from 'react'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
  hideSidebar?: boolean
}

export default function Layout({ children, hideSidebar = false }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev)

  return (
    <LayoutContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      <div className="flex h-screen w-full">
        {/* 左侧边栏 */}
        {!hideSidebar && <Sidebar />}

        {/* 主内容区域 */}
        <main className="flex flex-1 flex-col overflow-auto pb-4">
          {children}
          <Footer />
        </main>
      </div>
    </LayoutContext.Provider>
  )
}
