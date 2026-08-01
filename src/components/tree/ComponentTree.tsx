import { TreeView as ArkTreeView } from '@ark-ui/react'
import {
  IconButton,
  TreeView,
  createTreeCollection,
  type TreeCollection,
  type TreeViewExpandedChangeDetails,
  type TreeViewSelectionChangeDetails,
} from '@chakra-ui/react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragCancelEvent,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'
import { PiDotsSixVertical } from 'react-icons/pi'

import typia from 'typia'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useProject } from '../../hooks/useProject'
import { isDefined } from '../../utils/isDefined'
import { ComponentTreeItem } from './ComponentTreeItem'
import { HoleTreeItem } from './HoleTreeItem'
import { StitchLineTreeItem } from './StitchLineTreeItem'
import { TreeItemVisual } from './TreeItemVisual'
import { TreeDragData } from './types/dragDataTypes'
import { TreeDropData } from './types/dropDataTypes'
import { ProjectTreeNode } from './types/nodeTypes'
import { getNextExpandedNodeIds } from './utils/getNextExpandedNodeIds'
import { getProjectTreeNodeIcon } from './utils/getProjectTreeNodeIcon'
import { getProjectTreeNodeLabel } from './utils/getProjectTreeNodeLabel'
import { createTreeRootNode } from './utils/treeNodeFactories'
import { getComponentNodeId, getHoleNodeId, getStitchLineNodeId } from './utils/treeNodeIds'
import { useTreeDropAnimation } from './utils/useTreeDropAnimation'

type ComponentTreeProps = {
  isInReorderMode: boolean
}

export const ComponentTree: FC<ComponentTreeProps> = ({ isInReorderMode = true }) => {
  const { project, moveComponent, moveHole, moveStitchLineToComponent, moveStitchLineToHole } = useProject()
  const { selection } = useDrawAreaContext()
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>(() => [getComponentNodeId(project.root)])
  const [activeDragData, setActiveDragData] = useState<TreeDragData | undefined>()
  const { dropTargetRectRef, handleDropAnimation } = useTreeDropAnimation()
  const sensors = useSensors(useSensor(PointerSensor))

  const collection = useMemo<TreeCollection<ProjectTreeNode>>(() => {
    return createTreeCollection<ProjectTreeNode>({
      nodeToChildren: (node) => node.children,
      nodeToChildrenCount: (node) => (node.kind === 'stitch-line' ? undefined : node.children.length),
      nodeToString: getProjectTreeNodeLabel,
      nodeToValue: (node) => node.id,
      rootNode: createTreeRootNode(project),
    })
  }, [project])

  const selectedValue = useMemo((): string[] => {
    const { editorSelection } = selection
    if (!isDefined(editorSelection)) {
      return []
    }
    switch (editorSelection.type) {
      case 'component':
        return [getComponentNodeId(editorSelection.componentId)]
      case 'stitch-line':
        return [getStitchLineNodeId(editorSelection.stitchLineId)]
      case 'hole':
        return [getHoleNodeId(editorSelection.holeId)]
    }
  }, [selection])

  useEffect(() => {
    setExpandedNodeIds((currentExpandedNodeIds) => {
      const nextExpanded = currentExpandedNodeIds.filter((id) => collection.findNode(id)?.children?.length ?? 0 > 0)
      return nextExpanded.length === currentExpandedNodeIds.length ? currentExpandedNodeIds : nextExpanded
    })
  }, [collection])

  useEffect(() => {
    const { editorSelection } = selection
    if (isDefined(editorSelection)) {
      setExpandedNodeIds((expandedIds) => getNextExpandedNodeIds(editorSelection, project, expandedIds))
    }
  }, [project, selection])

  const handleExpandedChange = useCallback((details: TreeViewExpandedChangeDetails<ProjectTreeNode>): void => {
    setExpandedNodeIds(details.expandedValue)
  }, [])

  const handleSelectionChange = useCallback(
    (details: TreeViewSelectionChangeDetails<ProjectTreeNode>): void => {
      const selectedNode = details.selectedNodes[0]
      if (!isDefined(selectedNode)) {
        return
      }
      switch (selectedNode.kind) {
        case 'component':
          return selection.selectComponent(selectedNode.component.id)
        case 'stitch-line':
          return selection.selectStitchLine(selectedNode.stitchLine.id)
        case 'hole':
          return selection.selectHole(selectedNode.hole.id)
      }
    },
    [selection],
  )

  const handleAddChild = useCallback((parentId: string): void => {
    setExpandedNodeIds((currentExpandedNodeIds) =>
      Array.from(new Set([...currentExpandedNodeIds, getComponentNodeId(parentId)])),
    )
  }, [])

  const handleStitchLineDelete = useCallback(
    (stitchLineId: string): void => {
      if (selection.selectedStitchLine?.id === stitchLineId) {
        selection.clearSelection()
      }
    },
    [selection],
  )

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent): void => {
      dropTargetRectRef.current = undefined

      const dragData: unknown = active.data.current

      if (typia.is<TreeDragData>(dragData)) {
        setActiveDragData(dragData)
      }
    },
    [dropTargetRectRef],
  )

  const handleDragCancel = useCallback(
    (_event: DragCancelEvent): void => {
      dropTargetRectRef.current = undefined
      setActiveDragData(undefined)
    },
    [dropTargetRectRef],
  )

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent): void => {
      setActiveDragData(undefined)

      if (!isDefined(over)) {
        return
      }

      const dragData = active.data.current
      const dropData = over.data.current

      if (!typia.is<TreeDragData>(dragData) || !typia.is<TreeDropData>(dropData)) {
        return
      }

      dropTargetRectRef.current = { ...over.rect }

      switch (dropData.kind) {
        case 'component-reorder': {
          if (dragData.kind === 'component') {
            moveComponent(dragData.componentId, dropData.targetParentId, dropData.beforeComponentId)
          }
          break
        }
        case 'component-attachment': {
          switch (dragData.kind) {
            case 'hole': {
              moveHole(dragData.holeId, dropData.componentId)
              break
            }
            case 'stitch-line': {
              moveStitchLineToComponent(dragData.stitchLineId, dropData.componentId)
              break
            }
          }
          break
        }
        case 'hole-stitch-line': {
          if (dragData.kind === 'stitch-line' && dragData.stitchLineType === 'component-bounds-stitch-line') {
            moveStitchLineToHole(dragData.stitchLineId, dropData.holeId)
          }
          break
        }
      }
    },
    [dropTargetRectRef, moveComponent, moveHole, moveStitchLineToComponent, moveStitchLineToHole],
  )

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <TreeView.Root
        collection={collection}
        expandedValue={expandedNodeIds}
        expandOnClick={false}
        onExpandedChange={handleExpandedChange}
        onSelectionChange={!isInReorderMode ? handleSelectionChange : undefined}
        selectedValue={!isInReorderMode ? selectedValue : undefined}
        selectionMode="single"
      >
        <TreeView.Tree>
          <TreeView.Node<ProjectTreeNode>
            indentGuide={<TreeView.BranchIndentGuide />}
            render={({ indexPath, node, nodeState }) => {
              switch (node.kind) {
                case 'component':
                  return (
                    <ComponentTreeItem
                      activeDragData={activeDragData}
                      indexPath={indexPath}
                      isInReorderMode={isInReorderMode}
                      node={node}
                      nodeState={nodeState}
                      onAddChild={handleAddChild}
                    />
                  )
                case 'hole':
                  return (
                    <HoleTreeItem
                      activeDragData={activeDragData}
                      indexPath={indexPath}
                      isInReorderMode={isInReorderMode}
                      node={node}
                    />
                  )
                case 'stitch-line':
                  return (
                    <StitchLineTreeItem
                      activeDragData={activeDragData}
                      indexPath={indexPath}
                      isInReorderMode={isInReorderMode}
                      node={node}
                      onDelete={handleStitchLineDelete}
                    />
                  )
              }
            }}
          />
        </TreeView.Tree>
        <DragOverlay dropAnimation={handleDropAnimation}>
          {isDefined(activeDragData) && <TreeDragPreview dragData={activeDragData} />}
        </DragOverlay>
      </TreeView.Root>
    </DndContext>
  )
}

type TreeDragPreviewProps = {
  dragData: TreeDragData
}

const TreeDragPreview: FC<TreeDragPreviewProps> = ({ dragData }) => {
  const { node } = dragData
  const isBranch = node.kind !== 'stitch-line'
  const isExpandable = node.children.length > 0
  const dragHandle = (
    <IconButton pointerEvents="none" size="2xs" variant="ghost" _hover={{ bg: 'transparent' }}>
      <PiDotsSixVertical />
    </IconButton>
  )
  const isPositioned = node.kind !== 'stitch-line'

  const visual = (
    <TreeItemVisual
      icon={getProjectTreeNodeIcon(node)}
      isBranch={isBranch}
      isExpandable={isExpandable}
      isPositioned={isPositioned}
      label={getProjectTreeNodeLabel(node)}
      leading={dragHandle}
      trailing={null}
    />
  )

  return (
    <TreeView.Tree aria-hidden="true" height="100%" pointerEvents="none" width="100%">
      <ArkTreeView.NodeProvider indexPath={dragData.indexPath} node={node}>
        {isBranch ? (
          <TreeView.Branch>
            <TreeView.BranchControl bg="bg.info/90" h="9" py="0">
              {visual}
            </TreeView.BranchControl>
          </TreeView.Branch>
        ) : (
          <TreeView.Item bg="bg.info/90" h="9" py="0">
            {visual}
          </TreeView.Item>
        )}
      </ArkTreeView.NodeProvider>
    </TreeView.Tree>
  )
}
