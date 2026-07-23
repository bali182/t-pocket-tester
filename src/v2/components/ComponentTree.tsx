import {
  TreeView,
  createTreeCollection,
  type TreeCollection,
  type TreeViewExpandedChangeDetails,
  type TreeViewSelectionChangeDetails,
} from '@chakra-ui/react'
import { DndContext, PointerSensor, pointerWithin, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'

import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { useComponent } from '../hooks/useComponent'
import { useProject } from '../hooks/useProject'
import type { ComponentSchema } from '../schemas/components'
import { getComponentAncestorIds } from '../operations/project/utils/getComponentAncestorIds'
import { hasComponentChildren } from '../operations/project/utils/hasComponentChildren'
import { isComponentTreeDropAreaSchema } from '../utils/isComponentTreeDropAreaSchema'
import { isDefined } from '../utils/isDefined'
import { ComponentTreeItem, type ComponentTreeNode } from './ComponentTreeItem'

type ComponentTreeProps = {
  isInReorderMode: boolean
  selectedComponentId: string | undefined
}

export const ComponentTree: FC<ComponentTreeProps> = ({ selectedComponentId, isInReorderMode = true }) => {
  const { moveComponent, project } = useProject()
  const rootComponent = useComponent(project.root)
  const { selectComponent } = useDrawAreaContext()
  const [expandedComponentIds, setExpandedComponentIds] = useState<string[]>(() => [project.root])
  const sensors = useSensors(useSensor(PointerSensor))

  const collection = useMemo<TreeCollection<ComponentTreeNode>>(() => {
    const createNode = (
      component: ComponentSchema,
      parentId: string | undefined,
      nextSiblingId: string | undefined,
    ): ComponentTreeNode => {
      const childNodes: ComponentTreeNode[] = []

      if (hasComponentChildren(component)) {
        const childComponents = component.children
          .map((childId) => project.components[childId])
          .filter(isDefined)

        childComponents.forEach((child, index) => {
          childNodes.push(createNode(child, component.id, childComponents[index + 1]?.id))
        })
      }

      if (childNodes.length > 0) {
        return {
          children: childNodes,
          component,
          id: component.id,
          name: component.name,
          nextSiblingId,
          parentId,
        }
      }

      return {
        component,
        id: component.id,
        name: component.name,
        nextSiblingId,
        parentId,
      }
    }

    return createTreeCollection<ComponentTreeNode>({
      nodeToChildren: (node) => node.children ?? [],
      nodeToString: (node) => node.name,
      nodeToValue: (node) => node.id,
      rootNode: {
        children: [createNode(rootComponent, undefined, undefined)],
        id: 'component-tree-root',
        name: '',
        nextSiblingId: undefined,
        parentId: undefined,
      },
    })
  }, [project.components, rootComponent])

  const selectedValue = useMemo((): string[] => {
    if (!isDefined(selectedComponentId)) {
      return []
    }

    return [selectedComponentId]
  }, [selectedComponentId])

  useEffect(() => {
    if (!isDefined(selectedComponentId)) {
      return
    }
    const ancestorIds = getComponentAncestorIds(selectedComponentId, project)
    setExpandedComponentIds((expandedComponentIds) => Array.from(new Set([...expandedComponentIds, ...ancestorIds])))
  }, [project, selectedComponentId])

  const handleExpandedChange = useCallback((details: TreeViewExpandedChangeDetails<ComponentTreeNode>): void => {
    setExpandedComponentIds(details.expandedValue)
  }, [])

  const handleSelectionChange = useCallback(
    (details: TreeViewSelectionChangeDetails<ComponentTreeNode>): void => {
      const selectedComponentId = details.selectedValue[0]

      if (!isDefined(selectedComponentId)) {
        return
      }

      selectComponent(selectedComponentId)
    },
    [selectComponent],
  )

  const handleAddChild = useCallback((parentId: string): void => {
    setExpandedComponentIds((expandedComponentIds) => Array.from(new Set([...expandedComponentIds, parentId])))
  }, [])

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent): void => {
      if (!isDefined(over) || typeof active.id !== 'string') {
        return
      }

      const dropAreaData: unknown = over.data.current

      if (!isComponentTreeDropAreaSchema(dropAreaData)) {
        return
      }

      moveComponent(active.id, dropAreaData.targetParentId, dropAreaData.beforeComponentId)
    },
    [moveComponent],
  )

  return (
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd} sensors={sensors}>
      <TreeView.Root
        collection={collection}
        expandedValue={expandedComponentIds}
        expandOnClick={false}
        onExpandedChange={handleExpandedChange}
        onSelectionChange={!isInReorderMode ? handleSelectionChange : undefined}
        selectedValue={!isInReorderMode ? selectedValue : undefined}
        selectionMode="single"
      >
        <TreeView.Tree>
          <TreeView.Node<ComponentTreeNode>
            indentGuide={<TreeView.BranchIndentGuide />}
            render={({ node, nodeState }) => (
              <ComponentTreeItem
                isInReorderMode={isInReorderMode}
                node={node}
                nodeState={nodeState}
                onAddChild={handleAddChild}
              />
            )}
          />
        </TreeView.Tree>
      </TreeView.Root>
    </DndContext>
  )
}
