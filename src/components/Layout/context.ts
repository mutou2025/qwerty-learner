import { createContext, useContext } from 'react'

export interface LayoutContextValue {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const LayoutContext = createContext<LayoutContextValue | null>(null)

export function useLayoutContext() {
  return useContext(LayoutContext)
}
