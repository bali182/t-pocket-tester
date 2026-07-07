import type { ProjectSchema } from '../schemas/project'
import { getParent } from './getParent'
import { isDefined } from './isDefined'

export type MoveComponentDirection = 'up' | 'down'

export const moveComponentWithinParent = (
  componentId: string,
  direction: MoveComponentDirection,
  project: ProjectSchema,
): ProjectSchema => {
  const component = project.components[componentId]

  if (!isDefined(component) || component.type === 'root-panel') {
    return project
  }

  const parent = getParent(componentId, project)

  if (!isDefined(parent)) {
    return project
  }

  const currentIndex = parent.children.indexOf(componentId)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= parent.children.length) {
    return project
  }

  const children = parent.children.slice()
  const [movedChildId] = children.splice(currentIndex, 1)
  children.splice(targetIndex, 0, movedChildId)

  return {
    ...project,
    components: {
      ...project.components,
      [parent.id]: {
        ...parent,
        children,
      },
    },
  }
}
