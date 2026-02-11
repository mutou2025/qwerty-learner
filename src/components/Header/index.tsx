import logo from '@/assets/logo.svg'
import UserMenu from '@/components/UserMenu'
import type { PropsWithChildren } from 'react'
import type React from 'react'

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="container z-20 mx-auto w-full px-10 py-6">
      <div className="flex w-full flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
        <div className="flex items-center text-2xl font-bold text-indigo-500 lg:text-4xl">
          <img src={logo} className="mr-3 h-16 w-16" alt="Echo Learner Logo" />
          <h1 style={{ fontSize: 26 }}>
            <div style={{ fontSize: 26, color: 'rgba(99 102 241 / var(--tw-bg-opacity, 1)' }}>
              EchoLearner
            </div>

            <div style={{ fontSize: 15, color: 'rgba(91,108,255,0.78)' }}>
              听见
              <span style={{ fontSize: 20, fontWeight: 800, margin: '0 10px', lineHeight: 1 }}>
                &middot;
              </span>
              模仿
              <span style={{ fontSize: 20, fontWeight: 800, margin: '0 10px', lineHeight: 1 }}>
                &middot;
              </span>
              成为
            </div>
          </h1>
        </div>
        <nav className="my-card on element flex w-auto content-center items-center justify-end space-x-3 rounded-xl bg-white p-4 transition-colors duration-300 dark:bg-gray-800">
          {children}
          <UserMenu />
        </nav>
      </div>
    </header>
  )
}

export default Header
