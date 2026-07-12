import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import { updateProjectComponents } from '../utils/updateProjectComponents'

export const addComputedSizes = (project: ProjectSchema, computedProject: ComputedProjectSchema): ProjectSchema => {
  return updateProjectComponents(project, computedProject, (_id, component, computedComponent) => {
    switch (component.type) {
      case 'root-panel':
        return component
      case 'panel':
      case 'pocket-cluster': {
        const width = component.autoWidth ? computedComponent.boundingRect.width : component.width
        const height = component.autoHeight ? computedComponent.boundingRect.height : component.height

        if (width === component.width && height === component.height) {
          return component
        }

        return {
          ...component,
          width,
          height,
        }
      }
    }
  })
}
