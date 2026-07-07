import type { PanelSchema, RootPanelSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import { hasChildren } from './hasChildren'

export const getParent = (
  componentId: string,
  project: ProjectSchema,
): RootPanelSchema | PanelSchema | undefined => {
  return Object.values(project.components).find(
    (component): component is RootPanelSchema | PanelSchema =>
      hasChildren(component) && component.children.includes(componentId),
  )
}
