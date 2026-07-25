import { ProjectSchema } from '../../schemas/project'
import { isDefined } from '../../utils/isDefined'
import { getComponentDescendants } from './utils/getComponentDescendants'
import { hasComponentChildren } from './utils/hasComponentChildren'

export type DeleteComponentParams = {
  componentId: string
}

export const deleteComponent = (project: ProjectSchema, { componentId }: DeleteComponentParams): ProjectSchema => {
  const component = project.components[componentId]

  if (!isDefined(component) || component.type === 'root-panel') {
    return project
  }

  const deletedIds = new Set([componentId, ...getComponentDescendants(component, project)])

  return {
    ...project,
    components: Object.fromEntries(
      Object.entries(project.components)
        .filter(([id]) => !deletedIds.has(id))
        .map((tuple) => {
          const [id, component] = tuple
          if (!hasComponentChildren(component) || !component.children.some((child) => deletedIds.has(child))) {
            return tuple
          }
          return [id, { ...component, children: component.children.filter((child) => !deletedIds.has(child)) }]
        }),
    ),
  }
}
