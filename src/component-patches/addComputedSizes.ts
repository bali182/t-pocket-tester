import { updateProjectComponents } from '../operations/subProject/utils/updateProjectComponents'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'

export const addComputedSizes = (
  subProject: SubProjectSchema,
  computedProject: ComputedSubProjectSchema,
): SubProjectSchema => {
  if (!subProject.editingSettings.addComputedSizesToAutoSized) {
    return subProject
  }

  return updateProjectComponents(subProject, computedProject, (_id, component, computedComponent) => {
    switch (component.type) {
      case 'root-panel':
        return component
      case 'panel':
      case 'pocket-cluster': {
        const width = component.autoWidth ? computedComponent.boundingRect.width.toNumber() : component.width
        const height = component.autoHeight ? computedComponent.boundingRect.height.toNumber() : component.height

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
