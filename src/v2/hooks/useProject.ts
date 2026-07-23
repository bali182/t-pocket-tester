import { useAtomValue, type Getter } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback } from 'react'
import { LEATHER_BASE_COLOR } from '../constants/drawing'
import { addComponent as addComponentPure } from '../operations/project/addComponent'
import { addStitchLine as addStitchLinePure } from '../operations/project/addStitchLine'
import { cloneComponent as cloneComponentPure } from '../operations/project/cloneComponent'
import { deleteComponent as deleteComponentPure } from '../operations/project/deleteComponent'
import { deleteStitchLine as deleteStitchLinePure } from '../operations/project/deleteStitchLine'
import { updateComponent as updateComponentPure } from '../operations/project/updateComponent'
import { updateStitchLine as updateStitchLinePure } from '../operations/project/updateStitchLine'
import { createComponent } from '../operations/project/utils/createComponent'
import { createStitchLine } from '../operations/project/utils/createStitchLine'
import { getComponentNestingLevel } from '../operations/project/utils/getComponentNestingLevel'
import { getNextUnusedClonedComponentName } from '../operations/project/utils/getNextUnusedClonedComponentName'
import { getUnusedComponentName } from '../operations/project/utils/getUnusedComponentName'
import { resolveComponentMove } from '../operations/project/utils/resolveComponentMove'
import type { ComponentSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import { StitchLineSchema } from '../schemas/stitching'
import { lastTouchedComponentAtom } from '../state/lastTouchedComponentAtom'
import { computedProjectAtom, projectAtom } from '../state/projectAtom'
import { useTranslation } from '../translations/translation'
import { getComponentColor } from '../utils/getComponentColor'
import { getUnusedStitchLineName } from '../utils/getUnusedStitchLineName'
import { id as idPure } from '../utils/id'
import { isDefined } from '../utils/isDefined'

export const useProject = () => {
  const project = useAtomValue(projectAtom)
  const computedProject = useAtomValue(computedProjectAtom)
  const t = useTranslation()

  if (!isDefined(project) || !isDefined(computedProject)) {
    throw new Error('useProject requires an opened project')
  }

  // In the future if this becomes a problem, do a uniqueness-check before assigning an id.
  const componentId = useCallback(() => idPure(), [])
  const stitchLineId = useCallback(() => idPure(), [])

  const addComponent = useAtomCallback(
    useCallback(
      (get, set, parentId: string, type: ComponentSchema['type']): ComponentSchema => {
        const project = getRequiredProject(get)
        const component = createComponent({
          type,
          color: getComponentColor(LEATHER_BASE_COLOR, getComponentNestingLevel(parentId, project) + 1),
          id: componentId(),
          name: getUnusedComponentName(type, project, t),
        })
        set(projectAtom, addComponentPure(project, { parentId, component }))
        set(lastTouchedComponentAtom, { projectId: project.id, componentId: component.id })
        return component
      },
      [componentId, t],
    ),
  )

  const addStitchLine = useAtomCallback(
    useCallback(
      (get, set, componentId: string, stitchLineType: StitchLineSchema['type']): StitchLineSchema => {
        const project = getRequiredProject(get)
        const stitchLine = createStitchLine({
          componentId,
          type: stitchLineType,
          id: stitchLineId(),
          name: getUnusedStitchLineName(project, project.components[componentId], t),
        })
        set(projectAtom, addStitchLinePure(project, { stitchLine }))
        return stitchLine
      },
      [stitchLineId, t],
    ),
  )

  const cloneComponent = useAtomCallback(
    useCallback((get, set, sourceComponentId: string): void => {
      const project = getRequiredProject(get)
      const cloneResult = cloneComponentPure(project, {
        componentId: sourceComponentId,
        getUnusedId: componentId,
        getUnusedName: getNextUnusedClonedComponentName,
      })

      if (!isDefined(cloneResult)) {
        return
      }

      set(projectAtom, cloneResult.project)
      set(lastTouchedComponentAtom, { projectId: project.id, componentId: cloneResult.clonedRootId })
    }, [componentId]),
  )

  const deleteComponent = useAtomCallback(
    useCallback((get, set, componentId: string): void => {
      const project = getRequiredProject(get)
      set(projectAtom, deleteComponentPure(project, { componentId }))
    }, []),
  )

  const deleteStitchLine = useAtomCallback(
    useCallback((get, set, stitchLineId: string): void => {
      const project = getRequiredProject(get)
      set(projectAtom, deleteStitchLinePure(project, { stitchLineId }))
    }, []),
  )

  const moveComponent = useAtomCallback(
    useCallback((get, set, componentId: string, targetParentId: string, beforeCompId: string | undefined): void => {
      const project = getRequiredProject(get)
      const resolvedMove = resolveComponentMove(project, componentId, targetParentId, beforeCompId)

      if (!isDefined(resolvedMove)) {
        return
      }

      const { beforeComponentId, movedComponent, sourceParent, targetParent } = resolvedMove

      const sourceChildren = sourceParent.children.filter((childId) => childId !== movedComponent.id)
      const targetChildren = sourceParent.id === targetParent.id ? sourceChildren : targetParent.children

      const targetIndex = isDefined(beforeComponentId)
        ? targetChildren.indexOf(beforeComponentId)
        : targetChildren.length

      if (targetIndex < 0) {
        return
      }

      const updatedTargetChildren = [
        ...targetChildren.slice(0, targetIndex),
        movedComponent.id,
        ...targetChildren.slice(targetIndex),
      ]

      set(projectAtom, {
        ...project,
        components: {
          ...project.components,
          [sourceParent.id]: {
            ...sourceParent,
            children: sourceChildren,
          },
          [targetParent.id]: {
            ...targetParent,
            children: updatedTargetChildren,
          },
        },
      })
    }, []),
  )

  const updateComponent = useAtomCallback(
    useCallback((get, set, component: ComponentSchema): void => {
      const project = getRequiredProject(get)
      set(projectAtom, updateComponentPure(project, { component }))
      set(lastTouchedComponentAtom, { projectId: project.id, componentId: component.id })
    }, []),
  )

  const updateStitchLine = useAtomCallback(
    useCallback((get, set, stitchLine: StitchLineSchema): void => {
      const project = getRequiredProject(get)
      set(projectAtom, updateStitchLinePure(project, { stitchLine }))
    }, []),
  )

  const touchComponent = useAtomCallback(
    useCallback((get, set, componentId: string): void => {
      const project = getRequiredProject(get)

      if (!isDefined(project.components[componentId])) {
        return
      }

      set(lastTouchedComponentAtom, { projectId: project.id, componentId })
    }, []),
  )

  return {
    project,
    computedProject,
    addComponent,
    addStitchLine,
    cloneComponent,
    deleteComponent,
    deleteStitchLine,
    moveComponent,
    updateComponent,
    touchComponent,
    updateStitchLine,
  }
}

const getRequiredProject = (get: Getter): ProjectSchema => {
  const project = get(projectAtom)

  if (!isDefined(project)) {
    throw new Error('An opened project is required')
  }

  return project
}
