import { useAtomValue } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback } from 'react'
import { ComponentSchema } from '../schemas/components'
import { StitchLineSchema } from '../schemas/stitching'
import { lastTouchedComponentAtom } from '../state/lastTouchedComponentAtom'
import { computedProjectAtom, projectAtom } from '../state/projectAtom'
import { createComponent } from '../utils/createComponent'
import { createStitchLine } from '../utils/createStitchLine'
import { getComponentNestingLevel } from '../utils/getComponentNestingLevel'
import { getDescendants } from '../utils/getDescendants'
import { getParent } from '../utils/getParent'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { useTranslation } from '../translations/translation'

export const useProject = () => {
  const project = useAtomValue(projectAtom)
  const computedProject = useAtomValue(computedProjectAtom)
  const t = useTranslation()

  const addComponent = useAtomCallback(
    useCallback((get, set, parentId: string, type: ComponentSchema['type']): ComponentSchema => {
      const project = get(projectAtom)
      const parent = project.components[parentId]

      if (!isDefined(parent) || !hasChildren(parent)) {
        throw new Error('Missing parent or cannot have child elements')
      }

      const component = createComponent(type, project, t, getComponentNestingLevel(parent.id, project) + 1)

      set(projectAtom, {
        ...project,
        components: {
          ...project.components,
          [parent.id]: {
            ...parent,
            children: [...parent.children, component.id],
          },
          [component.id]: component,
        },
      })
      set(lastTouchedComponentAtom, { projectId: project.id, componentId: component.id })

      return component
    }, [t]),
  )

  const addStitchLine = useAtomCallback(
    useCallback((get, set, componentId: string, stitchLineType: StitchLineSchema['type']): StitchLineSchema => {
      const project = get(projectAtom)
      const stitchLine = createStitchLine(stitchLineType, project, componentId, t)

      set(projectAtom, {
        ...project,
        stitchLines: [...project.stitchLines, stitchLine],
      })
      return stitchLine
    }, [t]),
  )

  const deleteComponent = useAtomCallback(
    useCallback((get, set, componentId: string): void => {
      const project = get(projectAtom)
      const component = project.components[componentId]

      if (!isDefined(component) || component.type === 'root-panel') {
        return
      }

      const deletedIds = new Set([componentId, ...getDescendants(component, project)])

      set(projectAtom, {
        ...project,
        components: Object.fromEntries(
          Object.entries(project.components)
            .filter(([id]) => !deletedIds.has(id))
            .map((tuple) => {
              const [id, component] = tuple
              if (!hasChildren(component) || !component.children.some((child) => deletedIds.has(child))) {
                return tuple
              }
              return [id, { ...component, children: component.children.filter((child) => !deletedIds.has(child)) }]
            }),
        ),
      })
    }, []),
  )

  const deleteStitchLine = useAtomCallback(
    useCallback((get, set, stitchLineId: string): void => {
      const project = get(projectAtom)

      set(projectAtom, {
        ...project,
        stitchLines: project.stitchLines.filter((stitchLine) => stitchLine.id !== stitchLineId),
      })
    }, []),
  )

  const moveComponent = useAtomCallback(
    useCallback((get, set, componentId: string, direction: 'up' | 'down'): void => {
      const project = get(projectAtom)
      const component = project.components[componentId]

      if (!isDefined(component)) {
        return
      }

      const parent = getParent(componentId, project)

      if (!isDefined(parent)) {
        return
      }

      const currentIndex = parent.children.indexOf(componentId)
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (targetIndex < 0 || targetIndex >= parent.children.length) {
        return
      }

      const children = parent.children.slice()
      const [movedChildId] = children.splice(currentIndex, 1)
      children.splice(targetIndex, 0, movedChildId)

      set(projectAtom, {
        ...project,
        components: {
          ...project.components,
          [parent.id]: {
            ...parent,
            children,
          },
        },
      })
    }, []),
  )

  const updateComponent = useAtomCallback(
    useCallback((get, set, component: ComponentSchema): void => {
      const project = get(projectAtom)

      set(projectAtom, {
        ...project,
        components: {
          ...project.components,
          [component.id]: component,
        },
      })
      set(lastTouchedComponentAtom, { projectId: project.id, componentId: component.id })
    }, []),
  )

  const touchComponent = useAtomCallback(
    useCallback((get, set, componentId: string): void => {
      const project = get(projectAtom)

      if (!isDefined(project.components[componentId])) {
        return
      }

      set(lastTouchedComponentAtom, { projectId: project.id, componentId })
    }, []),
  )

  const updateStitchLine = useAtomCallback(
    useCallback((get, set, stitchLine: StitchLineSchema): void => {
      const project = get(projectAtom)

      set(projectAtom, {
        ...project,
        stitchLines: project.stitchLines.map((s) => (s.id === stitchLine.id ? stitchLine : s)),
      })
    }, []),
  )

  return {
    project,
    computedProject,
    addComponent,
    addStitchLine,
    deleteComponent,
    deleteStitchLine,
    moveComponent,
    updateComponent,
    touchComponent,
    updateStitchLine,
  }
}
