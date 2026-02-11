import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarItemProps {
  to: string
  icon: ReactNode
  label: string
}

export default function SidebarItem({ to, icon, label }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
          isActive
            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
        }`
      }
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  )
}
