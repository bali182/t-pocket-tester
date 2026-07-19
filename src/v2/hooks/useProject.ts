import { useAtom } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback } from 'react'
import { ComponentSchema } from '../schemas/components'
import { StitchLineSchema } from '../schemas/stitching'
import { projectAtom } from '../state/projectAtom'
import { createComponent } from '../utils/createComponent'
import { createStitchLine } from '../utils/createStitchLine'
import { getComponentNestingLevel } from '../utils/getComponentNestingLevel'
import { getDescendants } from '../utils/getDescendants'
import { getParent } from '../utils/getParent'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'

export const useProject = () => {
  const [p, setProject] = useAtom(projectAtom)

  const addComponent = useAtomCallback(
    useCallback((get, set, parentId: string, type: ComponentSchema['type']): ComponentSchema => {
      const project = get(projectAtom)
      const parent = project.components[parentId]

      if (!isDefined(parent) || !hasChildren(parent)) {
        throw new Error('Missing parent or cannot have child elements')
      }

      const component = createComponent(type, project, getComponentNestingLevel(parent.id, project) + 1)

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
      return component
    }, []),
  )

  const addStitchLine = useAtomCallback(
    useCallback((get, set, componentId: string, stitchLineType: StitchLineSchema['type']): StitchLineSchema => {
      const project = get(projectAtom)
      const stitchLine = createStitchLine(stitchLineType, project, componentId)

      set(projectAtom, {
        ...project,
        stitchLines: [...project.stitchLines, stitchLine],
      })
      return stitchLine
    }, []),
  )

  const deleteComponent = useCallback(
    (componentId: string): void => {
      setProject((project) => {
        const component = project.components[componentId]

        if (!isDefined(component) || component.type === 'root-panel') {
          return project
        }

        const deletedIds = new Set([componentId, ...getDescendants(component, project)])

        return {
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
        }
      })
    },
    [setProject],
  )

  const deleteStitchLine = useCallback(
    (stitchLineId: string): void => {
      setProject((project) => ({
        ...project,
        stitchLines: project.stitchLines.filter((stitchLine) => stitchLine.id !== stitchLineId),
      }))
    },
    [setProject],
  )

  const moveComponent = useCallback(
    (componentId: string, direction: 'up' | 'down'): void => {
      setProject((project) => {
        const component = project.components[componentId]

        if (!isDefined(component)) {
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
      })
    },
    [setProject],
  )

  const updateComponent = useCallback(
    (component: ComponentSchema): void => {
      setProject((project) => ({
        ...project,
        components: {
          ...project.components,
          [component.id]: component,
        },
      }))
    },
    [setProject],
  )

  const updateStitchLine = useCallback(
    (stitchLine: StitchLineSchema): void => {
      setProject((project) => ({
        ...project,
        stitchLines: project.stitchLines.map((s) => (s.id === stitchLine.id ? stitchLine : s)),
      }))
    },
    [setProject],
  )

  return {
    project: p,
    addComponent,
    addStitchLine,
    deleteComponent,
    deleteStitchLine,
    moveComponent,
    updateComponent,
    updateStitchLine,
  }
}
