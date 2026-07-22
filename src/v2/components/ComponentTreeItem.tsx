import { Box, IconButton, TreeView, type TreeViewNodeState } from '@chakra-ui/react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useMemo, type FC } from 'react'

import { PiCaretRight, PiDotsSixVertical } from 'react-icons/pi'
import type { ComponentSchema } from '../schemas/components'
import type { ComponentMovePlacementSchema, ComponentTreeDropAreaSchema } from '../schemas/move'
import { getComponentIcon } from '../utils/getComponentIcon'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { ComponentActionsMenu } from './ComponentActionsMenu'

export type ComponentTreeNode = {
  children?: ComponentTreeNode[]
  component?: ComponentSchema
  id: string
  name: string
  nextSiblingId: string | undefined
  parentId: string | undefined
}

type ComponentTreeItemProps = {
  isInReorderMode: boolean
  node: ComponentTreeNode
  nodeState: TreeViewNodeState
  onAddChild: (parentId: string) => void
}

export const ComponentTreeItem: FC<ComponentTreeItemProps> = ({ isInReorderMode, node, nodeState, onAddChild }) => {
  const { component } = node
  const isRootPanel = isDefined(component) && component.type === 'root-panel'
  const canAcceptChildren = isDefined(component) && hasChildren(component)
  const dropPositions = useMemo<ComponentMovePlacementSchema[]>(() => {
    if (isRootPanel) {
      return ['inside']
    }

    if (canAcceptChildren) {
      if (nodeState.expanded) {
        return ['before', 'inside']
      }

      return ['before', 'inside', 'after']
    }

    return ['before', 'after']
  }, [canAcceptChildren, isRootPanel, nodeState.expanded])
  const isDraggable = isInReorderMode && !isRootPanel

  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef } = useDraggable({
    id: node.id,
    disabled: !isDraggable,
  })

  const beforeDropData = useMemo<ComponentTreeDropAreaSchema>(
    () => ({
      beforeComponentId: node.id,
      targetParentId: node.parentId ?? node.id,
    }),
    [node.id, node.parentId],
  )

  const afterDropData = useMemo<ComponentTreeDropAreaSchema>(
    () => ({
      beforeComponentId: node.nextSiblingId,
      targetParentId: node.parentId ?? node.id,
    }),
    [node.id, node.nextSiblingId, node.parentId],
  )

  const insideDropData = useMemo<ComponentTreeDropAreaSchema>(
    () => ({
      beforeComponentId: undefined,
      targetParentId: node.id,
    }),
    [node.id],
  )

  const { isOver: isBeforeDropAreaOver, setNodeRef: setBeforeDropAreaNodeRef } = useDroppable({
    data: beforeDropData,
    disabled: !isInReorderMode || !dropPositions.includes('before'),
    id: `${node.id}:before`,
  })

  const { isOver: isAfterDropAreaOver, setNodeRef: setAfterDropAreaNodeRef } = useDroppable({
    data: afterDropData,
    disabled: !isInReorderMode || !dropPositions.includes('after'),
    id: `${node.id}:after`,
  })

  const { isOver: isInsideDropAreaOver, setNodeRef: setInsideDropAreaNodeRef } = useDroppable({
    data: insideDropData,
    disabled: !isInReorderMode || !dropPositions.includes('inside'),
    id: `${node.id}:inside`,
  })

  if (!isDefined(component)) {
    return null
  }

  const Icon = getComponentIcon(component.type)

  const dragHandle = isDraggable ? (
    <IconButton
      {...attributes}
      {...listeners}
      cursor={isDragging ? 'grabbing' : 'grab'}
      ref={setActivatorNodeRef}
      size="2xs"
      variant="ghost"
      _hover={{ bg: 'transparent' }}
    >
      <PiDotsSixVertical />
    </IconButton>
  ) : null

  const dropAreaRefs = {
    after: setAfterDropAreaNodeRef,
    before: setBeforeDropAreaNodeRef,
    inside: setInsideDropAreaNodeRef,
  }
  const dropAreas = isInReorderMode ? (
    <Box display="flex" flexDirection="column" inset="0" pointerEvents="none" position="absolute">
      {dropPositions.map((position) => (
        <ComponentTreeDropArea key={position} setNodeRef={dropAreaRefs[position]} />
      ))}
    </Box>
  ) : null
  const insideDropAreaFeedback = isInsideDropAreaOver ? (
    <Box
      bg="border.info/80"
      border="2px solid"
      borderColor="border.info"
      inset="0"
      pointerEvents="none"
      position="absolute"
      rounded="l2"
    />
  ) : null
  const insertionIndicators = (
    <>
      <ComponentTreeInsertionIndicator isOver={isBeforeDropAreaOver} position="before" />
      <ComponentTreeInsertionIndicator isOver={isAfterDropAreaOver} position="after" />
    </>
  )

  if (nodeState.isBranch) {
    return (
      <TreeView.BranchControl py="0" ref={setNodeRef}>
        {dropAreas}
        {insideDropAreaFeedback}
        {insertionIndicators}
        <Box alignItems="center" display="flex" flex="1" gap="2" minW="0" position="relative" py="1.5" zIndex="1">
          <TreeView.BranchTrigger>
            <TreeView.BranchIndicator asChild>
              <PiCaretRight />
            </TreeView.BranchIndicator>
          </TreeView.BranchTrigger>
          {dragHandle}
          <Icon type={component.type} />
          <TreeView.BranchText>{node.name}</TreeView.BranchText>
          {!isInReorderMode && <ComponentActionsMenu component={component} onAddChild={onAddChild} size="2xs" />}
        </Box>
      </TreeView.BranchControl>
    )
  }

  return (
    <TreeView.Item py="0" ref={setNodeRef}>
      {dropAreas}
      {insideDropAreaFeedback}
      {insertionIndicators}
      <Box alignItems="center" display="flex" flex="1" gap="2" minW="0" position="relative" py="1.5" zIndex="1">
        {dragHandle}
        <Icon type={component.type} />
        <TreeView.ItemText>{node.name}</TreeView.ItemText>
        {!isInReorderMode && <ComponentActionsMenu component={component} onAddChild={onAddChild} size="2xs" />}
      </Box>
    </TreeView.Item>
  )
}

type ComponentTreeDropAreaProps = {
  setNodeRef: (element: HTMLElement | null) => void
}

const ComponentTreeDropArea: FC<ComponentTreeDropAreaProps> = ({ setNodeRef }) => {
  return <Box flex="1" pointerEvents="none" ref={setNodeRef} />
}

type ComponentTreeInsertionIndicatorProps = {
  isOver: boolean
  position: 'after' | 'before'
}

const ComponentTreeInsertionIndicator: FC<ComponentTreeInsertionIndicatorProps> = ({ isOver, position }) => {
  if (!isOver) {
    return null
  }

  const isBefore = position === 'before'

  return (
    <Box
      bg="border.info"
      bottom={isBefore ? undefined : '-1px'}
      height="2px"
      insetInline="0"
      pointerEvents="none"
      position="absolute"
      top={isBefore ? '-1px' : undefined}
      zIndex="2"
    />
  )
}
