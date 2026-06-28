import { ComponentType } from 'react'
import { HomeRoute } from './components/routes/HomeRoute'

type RouteConfig = {
  label: string
  path: string
  Component: ComponentType
}

export const routes: RouteConfig[] = [
  {
    label: 'Kezdőlap',
    path: '/home',
    Component: HomeRoute,
  },
]

export const baseRoute = '/home'
