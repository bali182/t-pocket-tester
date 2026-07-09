import {
  TreeView,
  createTreeCollection,
  type TreeViewExpandedChangeDetails,
  type TreeViewSelectionChangeDetails,
} from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'
import { LuChevronRight } from 'react-icons/lu'

import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { useComponent } from '../hooks/useComponent'
import { useComponentIcon } from '../hooks/useComponentIcon'
import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state'
import { getComponentAncestorIds } from '../utils/getComponentAncestorIds'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { ComponentTreeItemActions } from './ComponentTreeItemActions'

type ComponentTreeNode = {
  children?: ComponentTreeNode[]
  component?: ComponentSchema
  id: string
  name: string
}

type ComponentTreeProps = {
  selectedComponentId: string | undefined
}

type ComponentTreeNodeIconProps = {
  type: ComponentSchema['type']
}

const ComponentTreeNodeIcon: FC<ComponentTreeNodeIconProps> = ({ type }) => {
  const Icon = useComponentIcon(type)

  return <Icon />
}

export const ComponentTree: FC<ComponentTreeProps> = ({ selectedComponentId }) => {
  const project = useAtomValue(projectAtom)
  const rootComponent = useComponent(project.root)
  const { onComponentClick } = useDrawAreaContext()
  const [expandedComponentIds, setExpandedComponentIds] = useState<string[]>(() => [project.root])

  const collection = useMemo(() => {
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

      const component = project.components[selectedComponentId]

      if (!isDefined(component)) {
        return
      }

      const element = document.querySelector<SVGGraphicsElement>(
        `[data-component-id="${CSS.escape(selectedComponentId)}"]`,
      )

      if (!isDefined(element)) {
        return
      }

      onComponentClick(component, element)
    },
    [onComponentClick, project.components],
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
      translations={{ treeLabel: 'Komponensek' }}
    >
      <TreeView.Tree>
        <TreeView.Node
          indentGuide={<TreeView.BranchIndentGuide />}
          render={({ node, nodeState }) => {
            if (!isDefined(node.component)) {
              return null
            }

            if (nodeState.isBranch) {
              return (
                <TreeView.BranchControl>
                  <TreeView.BranchTrigger>
                    <TreeView.BranchIndicator asChild>
                      <LuChevronRight />
                    </TreeView.BranchIndicator>
                  </TreeView.BranchTrigger>
                  <ComponentTreeNodeIcon type={node.component.type} />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                  <ComponentTreeItemActions component={node.component} onAddChild={handleAddChild} />
                </TreeView.BranchControl>
              )
            }

            return (
              <TreeView.Item>
                <ComponentTreeNodeIcon type={node.component.type} />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
                <ComponentTreeItemActions component={node.component} onAddChild={handleAddChild} />
              </TreeView.Item>
            )
          }}
        />
      </TreeView.Tree>
    </TreeView.Root>
  )
}
