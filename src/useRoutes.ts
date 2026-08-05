import { ComponentType, useMemo } from 'react'
import { ProjectsRoute } from './components/routes/ProjectsRoute'
import { SubProjectRoute } from './components/routes/SubProjectRoute'
import { useTranslation } from './translations/translation'

type RouteConfig = {
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
        path: '/projects',
        Component: ProjectsRoute,
      },
      {
        path: '/projects/:projectId',
        Component: SubProjectRoute,
      },
      {
        path: '/projects/:projectId/:subProjectId',
        // TODO
        Component: undefined!,
      },
    ]
  }, [t])
  return { routes, baseRoute: '/projects' }
}
