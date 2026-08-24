import type { Getter } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback, useMemo } from 'react'

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
import type { ComponentSchema } from '../schemas/components'
import type { HoleSchema } from '../schemas/hole'
import type { ProjectSchema } from '../schemas/project'
import type { StitchLineSchema } from '../schemas/stitching'
import type { SubProjectSchema } from '../schemas/subProject'
import { projectAtomFamily, subProjectAtomFamily, type SubProjectAtomReferenceSchema } from '../state/projectAtoms'
import { useTranslation } from '../translations/translation'
import { getUnusedStitchLineName } from '../utils/getUnusedStitchLineName'
import { id } from '../utils/id'
import { isDefined } from '../utils/isDefined'
import { useOptionalProject } from './useOptionalProject'
import { useOptionalSubProject } from './useOptionalSubProject'

export type UseSubProjectOperationsOutput = {
  addComponent: (parentId: string, type: ComponentSchema['type']) => ComponentSchema
  addHole: (componentId: string) => HoleSchema
  addStitchLineToComponent: (componentId: string, type: StitchLineSchema['type']) => StitchLineSchema
  addStitchLineToHole: (holeId: string) => StitchLineSchema
  cloneComponent: (componentId: string) => void
  cloneHole: (holeId: string) => void
  cloneStitchLine: (stitchLineId: string) => void
  deleteComponent: (componentId: string) => void
  deleteHole: (holeId: string) => void
  deleteStitchLine: (stitchLineId: string) => void
  moveComponent: (componentId: string, targetParentId: string, beforeComponentId: string | undefined) => void
  moveHole: (holeId: string, targetComponentId: string) => void
  moveStitchLineToComponent: (stitchLineId: string, componentId: string) => void
  moveStitchLineToHole: (stitchLineId: string, holeId: string) => void
  updateComponent: (component: ComponentSchema) => void
  updateHole: (hole: HoleSchema) => void
  updateStitchLine: (stitchLine: StitchLineSchema) => void
}

export const useSubProjectOperations = (): UseSubProjectOperationsOutput => {
  const { project } = useOptionalProject()
  const { subProject } = useOptionalSubProject()
  const t = useTranslation()

  const reference = useMemo<SubProjectAtomReferenceSchema>(
    () => ({
      projectId: project?.id,
      subProjectId: subProject?.id,
    }),
    [project?.id, subProject?.id],
  )

  const addComponent = useAtomCallback(
    useCallback(
      (get, set, parentId: string, type: ComponentSchema['type']): ComponentSchema => {
        const [project, subProject] = ensureProject(get, reference)
        const component = createComponent({
          type,
          color: project.editingSettings.addBaseColorByDefault ? project.componentSettings.baseColor : undefined,
          id: id(),
          name: getUnusedComponentName(type, subProject, t),
        })
        set(subProjectAtomFamily(reference), addComponentPure(subProject, { parentId, component }))
        return component
      },
      [reference, t],
    ),
  )

  const addStitchLineToComponent = useAtomCallback(
    useCallback(
      (get, set, componentId: string, type: StitchLineSchema['type']): StitchLineSchema => {
        const [, subProject] = ensureProject(get, reference)
        const stitchLine = createStitchLine(
          type,
          { targetId: componentId, targetType: 'component' },
          id(),
          getUnusedStitchLineName(subProject, t),
        )
        set(subProjectAtomFamily(reference), addStitchLinePure(subProject, { stitchLine }))
        return stitchLine
      },
      [reference, t],
    ),
  )

  const addStitchLineToHole = useAtomCallback(
    useCallback(
      (get, set, holeId: string): StitchLineSchema => {
        const [, subProject] = ensureProject(get, reference)
        const stitchLine = createStitchLine(
          'component-bounds-stitch-line',
          { targetId: holeId, targetType: 'hole' },
          id(),
          getUnusedStitchLineName(subProject, t),
        )
        set(subProjectAtomFamily(reference), addStitchLinePure(subProject, { stitchLine }))
        return stitchLine
      },
      [reference, t],
    ),
  )

  const addHole = useAtomCallback(
    useCallback(
      (get, set, componentId: string): HoleSchema => {
        const [, subProject] = ensureProject(get, reference)
        const hole = createHole({
          componentId,
          id: id(),
          name: getUnusedHoleName(subProject, t),
        })
        set(subProjectAtomFamily(reference), addHolePure(subProject, { hole }))
        return hole
      },
      [reference, t],
    ),
  )

  const cloneComponent = useAtomCallback(
    useCallback(
      (get, set, componentId: string): void => {
        const [, subProject] = ensureProject(get, reference)
        const clonedSubProject = cloneComponentPure(subProject, {
          componentId,
          ids: {
            component: id,
            hole: id,
            stitchLine: id,
          },
          names: {
            component: getUnusedName,
            hole: getUnusedName,
            stitchLine: getUnusedName,
          },
          settings: {
            cloneHoles: true,
            cloneStitchLines: true,
            cloneComponentTree: true,
          },
        })
        set(subProjectAtomFamily(reference), clonedSubProject)
      },
      [reference],
    ),
  )

  const deleteComponent = useAtomCallback(
    useCallback(
      (get, set, componentId: string): void => {
        const [, subProject] = ensureProject(get, reference)
        set(subProjectAtomFamily(reference), deleteComponentPure(subProject, { componentId }))
      },
      [reference],
    ),
  )

  const cloneHole = useAtomCallback(
    useCallback(
      (get, set, holeId: string): void => {
        const [, subProject] = ensureProject(get, reference)
        set(subProjectAtomFamily(reference), cloneHolePure(subProject, { holeId, getUnusedId: id, getUnusedName }))
      },
      [reference],
    ),
  )

  const deleteHole = useAtomCallback(
    useCallback(
      (get, set, holeId: string): void => {
        const [, subProject] = ensureProject(get, reference)
        set(subProjectAtomFamily(reference), deleteHolePure(subProject, { holeId }))
      },
      [reference],
    ),
  )

  const cloneStitchLine = useAtomCallback(
    useCallback(
      (get, set, stitchLineId: string): void => {
        const [, subProject] = ensureProject(get, reference)
        set(
          subProjectAtomFamily(reference),
          cloneStitchLinePure(subProject, { stitchLineId, getUnusedId: id, getUnusedName }),
        )
      },
      [reference],
    ),
  )

  const deleteStitchLine = useAtomCallback(
    useCallback(
      (get, set, stitchLineId: string): void => {
        const [, subProject] = ensureProject(get, reference)
        set(subProjectAtomFamily(reference), deleteStitchLinePure(subProject, { stitchLineId }))
      },
      [reference],
    ),
  )

  const moveComponent = useAtomCallback(
    useCallback(
      (get, set, componentId: string, targetParentId: string, beforeComponentId: string | undefined): void => {
        const [, subProject] = ensureProject(get, reference)
        set(
          subProjectAtomFamily(reference),
          moveComponentPure(subProject, { beforeComponentId, componentId, targetParentId }),
        )
      },
      [reference],
    ),
  )

  const moveHole = useAtomCallback(
    useCallback(
      (get, set, holeId: string, targetComponentId: string): void => {
        const [, subProject] = ensureProject(get, reference)
        set(subProjectAtomFamily(reference), moveHolePure(subProject, { holeId, targetComponentId }))
      },
      [reference],
    ),
  )

  const moveStitchLineToComponent = useAtomCallback(
    useCallback(
      (get, set, stitchLineId: string, componentId: string): void => {
        const [, subProject] = ensureProject(get, reference)
        set(
          subProjectAtomFamily(reference),
          moveStitchLinePure(subProject, {
            stitchLineId,
            targetId: componentId,
            targetType: 'component',
          }),
        )
      },
      [reference],
    ),
  )

  const moveStitchLineToHole = useAtomCallback(
    useCallback(
      (get, set, stitchLineId: string, holeId: string): void => {
        const [, subProject] = ensureProject(get, reference)
        set(
          subProjectAtomFamily(reference),
          moveStitchLinePure(subProject, { stitchLineId, targetId: holeId, targetType: 'hole' }),
        )
      },
      [reference],
    ),
  )

  const updateComponent = useAtomCallback(
    useCallback(
      (get, set, component: ComponentSchema): void => {
        const [, subProject] = ensureProject(get, reference)
        set(subProjectAtomFamily(reference), updateComponentPure(subProject, { component }))
      },
      [reference],
    ),
  )

  const updateHole = useAtomCallback(
    useCallback(
      (get, set, hole: HoleSchema): void => {
        const [, subProject] = ensureProject(get, reference)
        set(subProjectAtomFamily(reference), updateHolePure(subProject, { hole }))
      },
      [reference],
    ),
  )

  const updateStitchLine = useAtomCallback(
    useCallback(
      (get, set, stitchLine: StitchLineSchema): void => {
        const [, subProject] = ensureProject(get, reference)
        set(subProjectAtomFamily(reference), updateStitchLinePure(subProject, { stitchLine }))
      },
      [reference],
    ),
  )

  return useMemo(
    () => ({
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
      updateStitchLine,
    }),
    [
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
      updateStitchLine,
    ],
  )
}

const ensureProject = (get: Getter, reference: SubProjectAtomReferenceSchema): [ProjectSchema, SubProjectSchema] => {
  const project = get(projectAtomFamily(reference.projectId))
  const subProject = get(subProjectAtomFamily(reference))

  if (!isDefined(project) || !isDefined(subProject)) {
    throw new Error('A valid subproject is required')
  }

  return [project, subProject]
}
