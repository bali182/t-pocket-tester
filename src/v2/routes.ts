import { ComponentType } from 'react'
import { HomeRoute } from './components/routes/HomeRoute'
import type { TranslationSchema } from './translations/translation'

type RouteConfig = {
  label: (t: TranslationSchema) => string
  path: string
  Component: ComponentType
}

export const routes: RouteConfig[] = [
  {
    label: (t) => t.navigation.home(),
    path: '/home',
    Component: HomeRoute,
  },
]

export const baseRoute = '/home'
