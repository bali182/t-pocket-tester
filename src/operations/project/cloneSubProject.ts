import type { HoleSchema } from '../../schemas/hole'
import type { ProjectSchema } from '../../schemas/project'
import type { StitchLineSchema } from '../../schemas/stitching'
import type { SubProjectSchema } from '../../schemas/subProject'
import { isDefined } from '../../utils/isDefined'
import { cloneComponentTree } from '../subProject/cloneComponent'

export type CloneSubProjectParams = {
  getUnusedId: () => string
  rootName: string
  subProject: SubProjectSchema
}

export const cloneSubProject = (
  project: ProjectSchema,
  { getUnusedId, rootName, subProject: sourceSubProject }: CloneSubProjectParams,
): ProjectSchema => {
  const sourceRootPanel = sourceSubProject.components[sourceSubProject.root]

  if (!isDefined(sourceRootPanel) || sourceRootPanel.type !== 'root-panel') {
    return project
  }

  const componentCloneResult = cloneComponentTree(sourceSubProject, {
    componentId: sourceSubProject.root,
    getUnusedId,
    getClonedName: (component) => (component.id === sourceSubProject.root ? rootName : component.name),
  })

  if (!isDefined(componentCloneResult)) {
    return project
  }

  const clonedHoleIdBySourceHoleId = Object.fromEntries(sourceSubProject.holes.map((hole) => [hole.id, getUnusedId()]))
  const clonedHoles: HoleSchema[] = []

  for (const hole of sourceSubProject.holes) {
    const componentId = componentCloneResult.clonedComponentIdBySourceComponentId[hole.componentId]

    if (!isDefined(componentId)) {
      return project
    }

    clonedHoles.push({
      ...hole,
      componentId,
      id: clonedHoleIdBySourceHoleId[hole.id],
    })
  }

  const clonedStitchLines: StitchLineSchema[] = []

  for (const stitchLine of sourceSubProject.stitchLines) {
    const targetId =
      stitchLine.targetType === 'component'
        ? componentCloneResult.clonedComponentIdBySourceComponentId[stitchLine.targetId]
        : clonedHoleIdBySourceHoleId[stitchLine.targetId]

    if (!isDefined(targetId)) {
      return project
    }

    clonedStitchLines.push({
      ...stitchLine,
      id: getUnusedId(),
      targetId,
    })
  }

  const clonedRootId = componentCloneResult.clonedComponentIdBySourceComponentId[sourceSubProject.root]

  if (!isDefined(clonedRootId)) {
    return project
  }

  const clonedSubProject: SubProjectSchema = {
    components: componentCloneResult.clonedComponents,
    holes: clonedHoles,
    id: getUnusedId(),
    root: clonedRootId,
    stitchLines: clonedStitchLines,
  }

  return {
    ...project,
    subProjects: [...project.subProjects, clonedSubProject],
  }
}
