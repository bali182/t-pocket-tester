import type { FC, PropsWithChildren } from 'react'
import { BrowserRouter, HashRouter } from 'react-router'

import { isElectron } from '../platform/isElectron'

type AppRouterProps = PropsWithChildren

export const AppRouter: FC<AppRouterProps> = ({ children }) => {
  if (isElectron()) {
    return <HashRouter useTransitions={false}>{children}</HashRouter>
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL} useTransitions={false}>
      {children}
    </BrowserRouter>
  )
}
