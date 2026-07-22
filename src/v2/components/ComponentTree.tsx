import {
  TreeView,
  createTreeCollection,
  type TreeCollection,
  type TreeViewExpandedChangeDetails,
  type TreeViewSelectionChangeDetails,
} from '@chakra-ui/react'
import { DndContext, PointerSensor, pointerWithin, useSensor, useSensors } from '@dnd-kit/core'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'

import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { useComponent } from '../hooks/useComponent'
import { useProject } from '../hooks/useProject'
import type { ComponentSchema } from '../schemas/components'
import { getComponentAncestorIds } from '../utils/getComponentAncestorIds'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { ComponentTreeItem, type ComponentTreeNode } from './ComponentTreeItem'

type ComponentTreeProps = {
  isInReorderMode: boolean
  selectedComponentId: string | undefined
}

export const ComponentTree: FC<ComponentTreeProps> = ({ selectedComponentId, isInReorderMode = true }) => {
  const { project } = useProject()
  const rootComponent = useComponent(project.root)
  const { selectComponent } = useDrawAreaContext()
  const [expandedComponentIds, setExpandedComponentIds] = useState<string[]>(() => [project.root])
  const sensors = useSensors(useSensor(PointerSensor))

  const collection = useMemo<TreeCollection<ComponentTreeNode>>(() => {
    const createNode = (component: ComponentSchema): ComponentTreeNode => {
      const childNodes: ComponentTreeNode[] = []

      if (hasChildren(component)) {
        component.children.forEach((childId) => {
          const child = project.components[childId]

          if (!isDefined(child)) {
            return
          }

          childNodes.push(createNode(child))
        })
      }

      if (childNodes.length > 0) {
        return {
          children: childNodes,
          component,
          id: component.id,
          name: component.name,
        }
      }

      return {
        component,
        id: component.id,
        name: component.name,
      }
    }

    return createTreeCollection<ComponentTreeNode>({
      nodeToChildren: (node) => node.children ?? [],
      nodeToString: (node) => node.name,
      nodeToValue: (node) => node.id,
      rootNode: {
        children: [createNode(rootComponent)],
        id: 'component-tree-root',
        name: '',
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

  return (
    <DndContext collisionDetection={pointerWithin} sensors={sensors}>
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
