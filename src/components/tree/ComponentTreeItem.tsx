import { Box, IconButton, TreeView, type TreeViewNodeState } from '@chakra-ui/react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'
import { PiDotsSixVertical } from 'react-icons/pi'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { hasComponentChildren } from '../../operations/subProject/utils/hasComponentChildren'
import { isDefined } from '../../utils/isDefined'
import { ComponentActionsMenu } from '../ComponentActionsMenu'
import { DropInsideIndicator, ReorderDropIndicator } from './ComponentTreeDropIndicators'
import { TreeItemVisual } from './TreeItemVisual'
import { TreeDragData } from './types/dragDataTypes'
import type {
  ComponentAttachmentDropData,
  ComponentReorderDropData,
  ComponentTreeDropPosition,
} from './types/dropDataTypes'
import { ComponentTreeNode } from './types/nodeTypes'
import { getProjectTreeNodeIcon } from './utils/getProjectTreeNodeIcon'
import { getProjectTreeNodeLabel } from './utils/getProjectTreeNodeLabel'

type ComponentTreeItemProps = {
  activeDragData: TreeDragData | undefined
  indexPath: number[]
  node: ComponentTreeNode
  nodeState: TreeViewNodeState
  onAddChild: (parentId: string) => void
}

export const ComponentTreeItem: FC<ComponentTreeItemProps> = ({
  activeDragData,
  indexPath,
  node,
  nodeState,
  onAddChild,
}) => {
  const { selection } = useDrawAreaContext()
  const { component } = node
  const isActiveComponent = activeDragData?.kind === 'component' && activeDragData.componentId === component.id
  const isDraggable = component.type !== 'root-panel'
  const canReorder = !isDefined(activeDragData) || activeDragData.kind === 'component'
  const isExpandable = node.children.length > 0

  const handleDragHandleClick = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
  }, [])

  const handlePointerEnter = useCallback((): void => {
    selection.setHoveredTreeSelection({ componentId: component.id, type: 'component' })
  }, [component.id, selection])

  const handlePointerLeave = useCallback((): void => {
    selection.setHoveredTreeSelection(undefined)
  }, [selection])

  const canAcceptAttachment = useMemo<boolean>(() => {
    if (!isDefined(activeDragData)) {
      return false
    }
    switch (activeDragData.kind) {
      case 'component':
        return false
      case 'hole':
        return true
      case 'stitch-line':
        return activeDragData.stitchLineType === 'component-bounds-stitch-line' || component.type === 'pocket-cluster'
    }
  }, [activeDragData, component.type])

  const isDisabledForActiveDrag = useMemo<boolean>(() => {
    if (!isDefined(activeDragData) || isActiveComponent) {
      return false
    }
    switch (activeDragData.kind) {
      case 'component':
        return false
      case 'hole':
        return false
      case 'stitch-line':
        return activeDragData.stitchLineType === 'pocket-cluster-stitch-line' && component.type !== 'pocket-cluster'
    }
  }, [activeDragData, component.type, isActiveComponent])

  const dropPositions = useMemo<ComponentTreeDropPosition[]>(() => {
    if (component.type === 'root-panel') {
      return ['inside']
    }
    if (hasComponentChildren(component)) {
      return nodeState.expanded ? ['before', 'inside'] : ['before', 'inside', 'after']
    }
    return ['before', 'after']
  }, [component, nodeState.expanded])

  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef } = useDraggable({
    data: {
      componentId: component.id,
      indexPath,
      kind: 'component',
      node,
    },
    disabled: !isDraggable,
    id: node.id,
  })

  const attachmentDropData = useMemo<ComponentAttachmentDropData>(
    () => ({
      componentId: component.id,
      kind: 'component-attachment',
    }),
    [component.id],
  )

  const beforeDropData = useMemo<ComponentReorderDropData>(
    () => ({
      beforeComponentId: component.id,
      kind: 'component-reorder',
      targetParentId: node.parentId ?? component.id,
    }),
    [component.id, node.parentId],
  )

  const afterDropData = useMemo<ComponentReorderDropData>(
    () => ({
      beforeComponentId: node.nextSiblingId,
      kind: 'component-reorder',
      targetParentId: node.parentId ?? component.id,
    }),
    [component.id, node.nextSiblingId, node.parentId],
  )

  const insideDropData = useMemo<ComponentReorderDropData>(
    () => ({
      beforeComponentId: undefined,
      kind: 'component-reorder',
      targetParentId: component.id,
    }),
    [component.id],
  )

  const { isOver: isAttachmentDropOver, setNodeRef: setAttachmentDropNodeRef } = useDroppable({
    data: attachmentDropData,
    disabled: !canAcceptAttachment,
    id: `${node.id}:attachment`,
  })

  const { isOver: isBeforeDropAreaOver, setNodeRef: setBeforeDropAreaNodeRef } = useDroppable({
    data: beforeDropData,
    disabled: !canReorder || !dropPositions.includes('before'),
    id: `${node.id}:before`,
  })

  const { isOver: isAfterDropAreaOver, setNodeRef: setAfterDropAreaNodeRef } = useDroppable({
    data: afterDropData,
    disabled: !canReorder || !dropPositions.includes('after'),
    id: `${node.id}:after`,
  })

  const { isOver: isInsideDropAreaOver, setNodeRef: setInsideDropAreaNodeRef } = useDroppable({
    data: insideDropData,
    disabled: !canReorder || !dropPositions.includes('inside'),
    id: `${node.id}:inside`,
  })

  const setTreeNodeRef = useCallback(
    (element: HTMLElement | null): void => {
      setNodeRef(element)
      setAttachmentDropNodeRef(element)
    },
    [setAttachmentDropNodeRef, setNodeRef],
  )

  const Icon = getProjectTreeNodeIcon(node)
  const dragHandle = (
    <IconButton
      {...attributes}
      {...listeners}
      cursor={isDragging ? 'grabbing' : 'grab'}
      disabled={!isDraggable}
      onClick={handleDragHandleClick}
      ref={setActivatorNodeRef}
      size="2xs"
      variant="ghost"
      _hover={{ bg: 'transparent' }}
    >
      <PiDotsSixVertical />
    </IconButton>
  )
  const dropAreaRefs = {
    after: setAfterDropAreaNodeRef,
    before: setBeforeDropAreaNodeRef,
    inside: setInsideDropAreaNodeRef,
  }
  const dropAreas = (
    <Box display="flex" flexDirection="column" inset="0" pointerEvents="none" position="absolute" ref={setTreeNodeRef}>
      {canReorder &&
        dropPositions.map((position) => (
          <Box key={position} flex="1" pointerEvents="none" ref={dropAreaRefs[position]} />
        ))}
    </Box>
  )

  const insideDropAreaFeedback = isInsideDropAreaOver || isAttachmentDropOver ? <DropInsideIndicator /> : null

  const insertionIndicators = (
    <>
      {isBeforeDropAreaOver && <ReorderDropIndicator position="before" />}
      {isAfterDropAreaOver && <ReorderDropIndicator position="after" />}
    </>
  )

  return (
    <TreeView.BranchControl
      cursor={isDisabledForActiveDrag ? 'not-allowed' : undefined}
      opacity={isDisabledForActiveDrag ? 0.4 : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={(event) => {
        if (!isExpandable && (event.key === 'ArrowRight' || event.key === '*')) {
          event.preventDefault()
        }
      }}
      py="0"
      h="9"
    >
      {dropAreas}
      {insideDropAreaFeedback}
      {insertionIndicators}
      <TreeItemVisual
        icon={Icon}
        isBranch={true}
        isExpandable={isExpandable}
        isPositioned={true}
        label={getProjectTreeNodeLabel(node)}
        leading={dragHandle}
        trailing={<ComponentActionsMenu component={component} onAddChild={onAddChild} size="2xs" />}
      />
    </TreeView.BranchControl>
  )
}
