import { useAtom, useAtomValue, type Getter } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback } from 'react'
import { addComponent as addComponentPure } from '../operations/project/addComponent'
import { addHole as addHolePure } from '../operations/project/addHole'
import { addStitchLine as addStitchLinePure } from '../operations/project/addStitchLine'
import { cloneComponent as cloneComponentPure } from '../operations/project/cloneComponent'
import { cloneHole as cloneHolePure } from '../operations/project/cloneHole'
import { cloneStitchLine as cloneStitchLinePure } from '../operations/project/cloneStitchLine'
import { deleteComponent as deleteComponentPure } from '../operations/project/deleteComponent'
import { deleteHole as deleteHolePure } from '../operations/project/deleteHole'
import { deleteStitchLine as deleteStitchLinePure } from '../operations/project/deleteStitchLine'
import { moveComponent as moveComponentPure } from '../operations/project/moveComponent'
import { moveHole as moveHolePure } from '../operations/project/moveHole'
import { moveStitchLine as moveStitchLinePure } from '../operations/project/moveStitchLine'
import { updateComponent as updateComponentPure } from '../operations/project/updateComponent'
import { updateHole as updateHolePure } from '../operations/project/updateHole'
import { updateStitchLine as updateStitchLinePure } from '../operations/project/updateStitchLine'
import { createComponent } from '../operations/project/utils/createComponent'
import { createHole } from '../operations/project/utils/createHole'
import { createStitchLine } from '../operations/project/utils/createStitchLine'
import { getUnusedComponentName } from '../operations/project/utils/getUnusedComponentName'
import { getUnusedHoleName } from '../operations/project/utils/getUnusedHoleName'
import { getUnusedName } from '../operations/project/utils/getUnusedName'
import { ComponentSchema } from '../schemas/components'
import { HoleSchema } from '../schemas/hole'
import { ProjectSchema } from '../schemas/project'
import { StitchLineSchema } from '../schemas/stitching'
import { lastTouchedComponentAtom } from '../state/lastTouchedComponentAtom'
import { computedProjectAtom, projectAtom } from '../state/projectAtom'
import { useTranslation } from '../translations/translation'
import { getUnusedStitchLineName } from '../utils/getUnusedStitchLineName'
import { id as idPure } from '../utils/id'
import { isDefined } from '../utils/isDefined'

export const useProject = () => {
  const [project, setProject] = useAtom(projectAtom)
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
          color: project.editingSettings.addBaseColorByDefault ? project.componentSettings.baseColor : undefined,
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

  const addStitchLineToComponent = useAtomCallback(
    useCallback(
      (get, set, componentId: string, stitchLineType: StitchLineSchema['type']): StitchLineSchema => {
        const project = getRequiredProject(get)
        const stitchLine = createStitchLine(
          stitchLineType,
          { targetId: componentId, targetType: 'component' },
          stitchLineId(),
          getUnusedStitchLineName(project, t),
        )
        set(projectAtom, addStitchLinePure(project, { stitchLine }))
        return stitchLine
      },
      [stitchLineId, t],
    ),
  )

  const addStitchLineToHole = useAtomCallback(
    useCallback(
      (get, set, holeId: string): StitchLineSchema => {
        const project = getRequiredProject(get)
        const stitchLine = createStitchLine(
          'component-bounds-stitch-line',
          { targetId: holeId, targetType: 'hole' },
          stitchLineId(),
          getUnusedStitchLineName(project, t),
        )

        set(projectAtom, addStitchLinePure(project, { stitchLine }))
        return stitchLine
      },
      [stitchLineId, t],
    ),
  )

  const addHole = useAtomCallback((get, set, componentId: string): HoleSchema => {
    const project = getRequiredProject(get)
    const hole = createHole({
      componentId,
      id: idPure(),
      name: getUnusedHoleName(project, t),
    })
    set(projectAtom, addHolePure(project, { hole }))
    return hole
  })

  const cloneComponent = useAtomCallback(
    useCallback(
      (get, set, sourceComponentId: string): void => {
        const project = getRequiredProject(get)
        const cloneResult = cloneComponentPure(project, {
          componentId: sourceComponentId,
          getUnusedId: componentId,
          getUnusedName: getUnusedName,
        })

        if (!isDefined(cloneResult)) {
          return
        }

        set(projectAtom, cloneResult.project)
        set(lastTouchedComponentAtom, { projectId: project.id, componentId: cloneResult.clonedRootId })
      },
      [componentId],
    ),
  )

  const deleteComponent = useAtomCallback(
    useCallback((get, set, componentId: string): void => {
      const project = getRequiredProject(get)
      set(projectAtom, deleteComponentPure(project, { componentId }))
    }, []),
  )

  const cloneHole = useAtomCallback(
    useCallback((get, set, holeId: string): void => {
      const project = getRequiredProject(get)
      set(projectAtom, cloneHolePure(project, { holeId, getUnusedId: idPure, getUnusedName }))
    }, []),
  )

  const deleteHole = useAtomCallback(
    useCallback((get, set, holeId: string): void => {
      const project = getRequiredProject(get)
      set(projectAtom, deleteHolePure(project, { holeId }))
    }, []),
  )

  const cloneStitchLine = useAtomCallback(
    useCallback(
      (get, set, sourceStitchLineId: string): void => {
        const project = getRequiredProject(get)
        const withClonedStitchLine = cloneStitchLinePure(project, {
          stitchLineId: sourceStitchLineId,
          getUnusedId: stitchLineId,
          getUnusedName,
        })
        set(projectAtom, withClonedStitchLine)
      },
      [stitchLineId],
    ),
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
      set(projectAtom, moveComponentPure(project, { beforeComponentId: beforeCompId, componentId, targetParentId }))
    }, []),
  )

  const moveHole = useAtomCallback(
    useCallback((get, set, holeId: string, targetComponentId: string): void => {
      const project = getRequiredProject(get)
      set(projectAtom, moveHolePure(project, { holeId, targetComponentId }))
    }, []),
  )

  const moveStitchLineToComponent = useAtomCallback(
    useCallback((get, set, stitchLineId: string, componentId: string): void => {
      const project = getRequiredProject(get)
      set(projectAtom, moveStitchLinePure(project, { stitchLineId, targetId: componentId, targetType: 'component' }))
    }, []),
  )

  const moveStitchLineToHole = useAtomCallback(
    useCallback((get, set, stitchLineId: string, holeId: string): void => {
      const project = getRequiredProject(get)
      set(projectAtom, moveStitchLinePure(project, { stitchLineId, targetId: holeId, targetType: 'hole' }))
    }, []),
  )

  const updateComponent = useAtomCallback(
    useCallback((get, set, component: ComponentSchema): void => {
      const project = getRequiredProject(get)
      set(projectAtom, updateComponentPure(project, { component }))
      set(lastTouchedComponentAtom, { projectId: project.id, componentId: component.id })
    }, []),
  )

  const updateHole = useAtomCallback(
    useCallback((get, set, hole: HoleSchema): void => {
      const project = getRequiredProject(get)
      set(projectAtom, updateHolePure(project, { hole }))
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
    addHole,
    addStitchLineToComponent,
    addStitchLineToHole,
    cloneComponent,
    cloneHole,
    cloneStitchLine,
    deleteComponent,
    deleteHole,
    deleteStitchLine,
    moveComponent,
    moveHole,
    moveStitchLineToComponent,
    moveStitchLineToHole,
    updateComponent,
    updateHole,
    touchComponent,
    setProject,
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
