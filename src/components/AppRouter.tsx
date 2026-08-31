import type { FC, PropsWithChildren } from 'react'
import { BrowserRouter, HashRouter } from 'react-router'

type AppRouterProps = PropsWithChildren

const isElectron = import.meta.env.VITE_IS_ELECTRON === 'true'

export const AppRouter: FC<AppRouterProps> = ({ children }) => {
  if (isElectron) {
    return <HashRouter>{children}</HashRouter>
  }

  return <BrowserRouter basename={import.meta.env.BASE_URL}>{children}</BrowserRouter>
}
