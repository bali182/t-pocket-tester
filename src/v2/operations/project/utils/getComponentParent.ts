import type { PanelSchema, RootPanelSchema } from '../../../schemas/components'
import type { ProjectSchema } from '../../../schemas/project'
import { hasComponentChildren } from './hasComponentChildren'

export const getComponentParent = (
  componentId: string,
  project: ProjectSchema,
): RootPanelSchema | PanelSchema | undefined => {
  return Object.values(project.components).find(
    (component): component is RootPanelSchema | PanelSchema =>
      hasComponentChildren(component) && component.children.includes(componentId),
  )
}
