import { useAtom, useAtomValue, type Getter } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback } from 'react'
import { addComponent as addComponentPure } from '../operations/subProject/addComponent'
import { addHole as addHolePure } from '../operations/subProject/addHole'
import { addStitchLine as addStitchLinePure } from '../operations/subProject/addStitchLine'
import { cloneComponent as cloneComponentPure } from '../operations/subProject/cloneComponent'
import { cloneHole as cloneHolePure } from '../operations/subProject/cloneHole'
import { cloneStitchLine as cloneStitchLinePure } from '../operations/subProject/cloneStitchLine'
import { deleteComponent as deleteComponentPure } from '../operations/subProject/deleteComponent'
import { deleteHole as deleteHolePure } from '../operations/subProject/deleteHole'
import { deleteStitchLine as deleteStitchLinePure } from '../operations/subProject/deleteStitchLine'
import { moveComponent as moveComponentPure } from '../operations/subProject/moveComponent'
import { moveHole as moveHolePure } from '../operations/subProject/moveHole'
import { moveStitchLine as moveStitchLinePure } from '../operations/subProject/moveStitchLine'
import { updateComponent as updateComponentPure } from '../operations/subProject/updateComponent'
import { updateHole as updateHolePure } from '../operations/subProject/updateHole'
import { updateStitchLine as updateStitchLinePure } from '../operations/subProject/updateStitchLine'
import { createComponent } from '../operations/subProject/utils/createComponent'
import { createHole } from '../operations/subProject/utils/createHole'
import { createStitchLine } from '../operations/subProject/utils/createStitchLine'
import { getUnusedComponentName } from '../operations/subProject/utils/getUnusedComponentName'
import { getUnusedHoleName } from '../operations/subProject/utils/getUnusedHoleName'
import { getUnusedName } from '../operations/subProject/utils/getUnusedName'
import { ComponentSchema } from '../schemas/components'
import { HoleSchema } from '../schemas/hole'
import { StitchLineSchema } from '../schemas/stitching'
import { SubProjectSchema } from '../schemas/subProject'
import { lastTouchedComponentAtom } from '../state/lastTouchedComponentAtom'
import { computedSubProjectAtom, subProjectAtom } from '../state/subProjectAtom'
import { useTranslation } from '../translations/translation'
import { getUnusedStitchLineName } from '../utils/getUnusedStitchLineName'
import { id as idPure } from '../utils/id'
import { isDefined } from '../utils/isDefined'

export const useSubProject = () => {
  const [subProject, setSubProject] = useAtom(subProjectAtom)
  const computedSubProject = useAtomValue(computedSubProjectAtom)
  const t = useTranslation()

  if (!isDefined(subProject) || !isDefined(computedSubProject)) {
    throw new Error('useProject requires an opened project')
  }

  // In the future if this becomes a problem, do a uniqueness-check before assigning an id.
  const componentId = useCallback(() => idPure(), [])
  const stitchLineId = useCallback(() => idPure(), [])

  const addComponent = useAtomCallback(
    useCallback(
      (get, set, parentId: string, type: ComponentSchema['type']): ComponentSchema => {
        const subProject = getRequiredSubProject(get)
        const component = createComponent({
          type,
          color: subProject.editingSettings.addBaseColorByDefault ? subProject.componentSettings.baseColor : undefined,
          id: componentId(),
          name: getUnusedComponentName(type, subProject, t),
        })
        set(subProjectAtom, addComponentPure(subProject, { parentId, component }))
        set(lastTouchedComponentAtom, { projectId: subProject.id, componentId: component.id })
        return component
      },
      [componentId, t],
    ),
  )

  const addStitchLineToComponent = useAtomCallback(
    useCallback(
      (get, set, componentId: string, stitchLineType: StitchLineSchema['type']): StitchLineSchema => {
        const subProject = getRequiredSubProject(get)
        const stitchLine = createStitchLine(
          stitchLineType,
          { targetId: componentId, targetType: 'component' },
          stitchLineId(),
          getUnusedStitchLineName(subProject, t),
        )
        set(subProjectAtom, addStitchLinePure(subProject, { stitchLine }))
        return stitchLine
      },
      [stitchLineId, t],
    ),
  )

  const addStitchLineToHole = useAtomCallback(
    useCallback(
      (get, set, holeId: string): StitchLineSchema => {
        const subProject = getRequiredSubProject(get)
        const stitchLine = createStitchLine(
          'component-bounds-stitch-line',
          { targetId: holeId, targetType: 'hole' },
          stitchLineId(),
          getUnusedStitchLineName(subProject, t),
        )

        set(subProjectAtom, addStitchLinePure(subProject, { stitchLine }))
        return stitchLine
      },
      [stitchLineId, t],
    ),
  )

  const addHole = useAtomCallback((get, set, componentId: string): HoleSchema => {
    const subProject = getRequiredSubProject(get)
    const hole = createHole({
      componentId,
      id: idPure(),
      name: getUnusedHoleName(subProject, t),
    })
    set(subProjectAtom, addHolePure(subProject, { hole }))
    return hole
  })

  const cloneComponent = useAtomCallback(
    useCallback(
      (get, set, sourceComponentId: string): void => {
        const subProject = getRequiredSubProject(get)
        const cloneResult = cloneComponentPure(subProject, {
          componentId: sourceComponentId,
          getUnusedId: componentId,
          getUnusedName: getUnusedName,
        })

        if (!isDefined(cloneResult)) {
          return
        }

        set(subProjectAtom, cloneResult.subProject)
        set(lastTouchedComponentAtom, { projectId: subProject.id, componentId: cloneResult.clonedRootId })
      },
      [componentId],
    ),
  )

  const deleteComponent = useAtomCallback(
    useCallback((get, set, componentId: string): void => {
      const subProject = getRequiredSubProject(get)
      set(subProjectAtom, deleteComponentPure(subProject, { componentId }))
    }, []),
  )

  const cloneHole = useAtomCallback(
    useCallback((get, set, holeId: string): void => {
      const subProject = getRequiredSubProject(get)
      set(subProjectAtom, cloneHolePure(subProject, { holeId, getUnusedId: idPure, getUnusedName }))
    }, []),
  )

  const deleteHole = useAtomCallback(
    useCallback((get, set, holeId: string): void => {
      const subProject = getRequiredSubProject(get)
      set(subProjectAtom, deleteHolePure(subProject, { holeId }))
    }, []),
  )

  const cloneStitchLine = useAtomCallback(
    useCallback(
      (get, set, sourceStitchLineId: string): void => {
        const subProject = getRequiredSubProject(get)
        const withClonedStitchLine = cloneStitchLinePure(subProject, {
          stitchLineId: sourceStitchLineId,
          getUnusedId: stitchLineId,
          getUnusedName,
        })
        set(subProjectAtom, withClonedStitchLine)
      },
      [stitchLineId],
    ),
  )

  const deleteStitchLine = useAtomCallback(
    useCallback((get, set, stitchLineId: string): void => {
      const subProject = getRequiredSubProject(get)
      set(subProjectAtom, deleteStitchLinePure(subProject, { stitchLineId }))
    }, []),
  )

  const moveComponent = useAtomCallback(
    useCallback((get, set, componentId: string, targetParentId: string, beforeCompId: string | undefined): void => {
      const subProject = getRequiredSubProject(get)
      set(
        subProjectAtom,
        moveComponentPure(subProject, { beforeComponentId: beforeCompId, componentId, targetParentId }),
      )
    }, []),
  )

  const moveHole = useAtomCallback(
    useCallback((get, set, holeId: string, targetComponentId: string): void => {
      const subProject = getRequiredSubProject(get)
      set(subProjectAtom, moveHolePure(subProject, { holeId, targetComponentId }))
    }, []),
  )

  const moveStitchLineToComponent = useAtomCallback(
    useCallback((get, set, stitchLineId: string, componentId: string): void => {
      const subProject = getRequiredSubProject(get)
      set(
        subProjectAtom,
        moveStitchLinePure(subProject, { stitchLineId, targetId: componentId, targetType: 'component' }),
      )
    }, []),
  )

  const moveStitchLineToHole = useAtomCallback(
    useCallback((get, set, stitchLineId: string, holeId: string): void => {
      const subProject = getRequiredSubProject(get)
      set(subProjectAtom, moveStitchLinePure(subProject, { stitchLineId, targetId: holeId, targetType: 'hole' }))
    }, []),
  )

  const updateComponent = useAtomCallback(
    useCallback((get, set, component: ComponentSchema): void => {
      const subProject = getRequiredSubProject(get)
      set(subProjectAtom, updateComponentPure(subProject, { component }))
      set(lastTouchedComponentAtom, { projectId: subProject.id, componentId: component.id })
    }, []),
  )

  const updateHole = useAtomCallback(
    useCallback((get, set, hole: HoleSchema): void => {
      const subProject = getRequiredSubProject(get)
      set(subProjectAtom, updateHolePure(subProject, { hole }))
    }, []),
  )

  const updateStitchLine = useAtomCallback(
    useCallback((get, set, stitchLine: StitchLineSchema): void => {
      const subProject = getRequiredSubProject(get)
      set(subProjectAtom, updateStitchLinePure(subProject, { stitchLine }))
    }, []),
  )

  const touchComponent = useAtomCallback(
    useCallback((get, set, componentId: string): void => {
      const subProject = getRequiredSubProject(get)

      if (!isDefined(subProject.components[componentId])) {
        return
      }

      set(lastTouchedComponentAtom, { projectId: subProject.id, componentId })
    }, []),
  )

  return {
    subProject,
    computedSubProject,
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
    setSubProject,
    updateStitchLine,
  }
}

const getRequiredSubProject = (get: Getter): SubProjectSchema => {
  const subProject = get(subProjectAtom)

  if (!isDefined(subProject)) {
    throw new Error('An opened project is required')
  }

  return subProject
}
