import { ComponentType, useMemo } from 'react'
import { ProjectRoute } from './components/routes/ProjectRoute'
import { ProjectsRoute } from './components/routes/ProjectsRoute'
import { useTranslation } from './translations/translation'

type RouteConfig = {
  label: string
  path: string
  Component: ComponentType
}

type UseRoutesOutput = {
  routes: RouteConfig[]
  baseRoute: string
}

export const useRoutes = (): UseRoutesOutput => {
  const t = useTranslation()
  const routes = useMemo<RouteConfig[]>(() => {
    return [
      {
        label: t.navigation.home,
        path: '/projects',
        Component: ProjectsRoute,
      },
      {
        label: t.navigation.project,
        path: '/projects/:projectId',
        Component: ProjectRoute,
      },
    ]
  }, [t])
  return { routes, baseRoute: '/projects' }
}
