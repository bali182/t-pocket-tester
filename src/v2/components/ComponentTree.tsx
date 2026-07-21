import {
  TreeView,
  createTreeCollection,
  type TreeCollection,
  type TreeViewExpandedChangeDetails,
  type TreeViewSelectionChangeDetails,
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'

import { PiCaretRight } from 'react-icons/pi'
import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { useComponent } from '../hooks/useComponent'
import { useProject } from '../hooks/useProject'
import type { ComponentSchema } from '../schemas/components'
import { getComponentAncestorIds } from '../utils/getComponentAncestorIds'
import { getComponentIcon } from '../utils/getComponentIcon'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { ComponentActionsMenu } from './ComponentActionsMenu'

type ComponentTreeNode = {
  children?: ComponentTreeNode[]
  component?: ComponentSchema
  id: string
  name: string
}

type ComponentTreeProps = {
  selectedComponentId: string | undefined
}

export const ComponentTree: FC<ComponentTreeProps> = ({ selectedComponentId }) => {
  const { project } = useProject()
  const rootComponent = useComponent(project.root)
  const { selectComponent } = useDrawAreaContext()
  const [expandedComponentIds, setExpandedComponentIds] = useState<string[]>(() => [project.root])

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
    <TreeView.Root
      collection={collection}
      expandedValue={expandedComponentIds}
      expandOnClick={false}
      onExpandedChange={handleExpandedChange}
      onSelectionChange={handleSelectionChange}
      selectedValue={selectedValue}
      selectionMode="single"
    >
      <TreeView.Tree>
        <TreeView.Node<ComponentTreeNode>
          indentGuide={<TreeView.BranchIndentGuide />}
          render={({ node, nodeState }) => {
            const { component } = node
            if (!isDefined(component)) {
              return null
            }
            const Icon = getComponentIcon(component.type)
            if (nodeState.isBranch) {
              return (
                <TreeView.BranchControl>
                  <TreeView.BranchTrigger>
                    <TreeView.BranchIndicator asChild>
                      <PiCaretRight />
                    </TreeView.BranchIndicator>
                  </TreeView.BranchTrigger>
                  <Icon type={component.type} />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                  <ComponentActionsMenu component={component} onAddChild={handleAddChild} size="2xs" />
                </TreeView.BranchControl>
              )
            }

            return (
              <TreeView.Item>
                <Icon type={component.type} />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
                <ComponentActionsMenu component={component} onAddChild={handleAddChild} size="2xs" />
              </TreeView.Item>
            )
          }}
        />
      </TreeView.Tree>
    </TreeView.Root>
  )
}
