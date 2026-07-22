import { Box, IconButton, TreeView, type TreeViewNodeState } from '@chakra-ui/react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useMemo, type FC } from 'react'

import { PiCaretRight, PiDotsSixVertical } from 'react-icons/pi'
import type { ComponentSchema } from '../schemas/components'
import { getComponentIcon } from '../utils/getComponentIcon'
import { isDefined } from '../utils/isDefined'
import { ComponentActionsMenu } from './ComponentActionsMenu'

export type ComponentTreeNode = {
  children?: ComponentTreeNode[]
  component?: ComponentSchema
  id: string
  name: string
}

type ComponentTreeDropPosition = 'after' | 'before'

type ComponentTreeDropAreaData = {
  componentId: string
  position: ComponentTreeDropPosition
}

type ComponentTreeItemProps = {
  isInReorderMode: boolean
  node: ComponentTreeNode
  nodeState: TreeViewNodeState
  onAddChild: (parentId: string) => void
}

export const ComponentTreeItem: FC<ComponentTreeItemProps> = ({ isInReorderMode, node, nodeState, onAddChild }) => {
  const { component } = node

  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef } = useDraggable({
    id: node.id,
    disabled: !isInReorderMode,
  })

  const beforeDropData = useMemo<ComponentTreeDropAreaData>(
    () => ({
      componentId: node.id,
      position: 'before',
    }),
    [node.id],
  )

  const afterDropData = useMemo<ComponentTreeDropAreaData>(
    () => ({
      componentId: node.id,
      position: 'after',
    }),
    [node.id],
  )

  const { isOver: isBeforeDropAreaOver, setNodeRef: setBeforeDropAreaNodeRef } = useDroppable({
    data: beforeDropData,
    disabled: !isInReorderMode,
    id: `${node.id}:before`,
  })

  const { isOver: isAfterDropAreaOver, setNodeRef: setAfterDropAreaNodeRef } = useDroppable({
    data: afterDropData,
    disabled: !isInReorderMode,
    id: `${node.id}:after`,
  })

  if (!isDefined(component)) {
    return null
  }

  const Icon = getComponentIcon(component.type)

  const dragHandle = isInReorderMode ? (
    <IconButton
      {...attributes}
      {...listeners}
      cursor={isDragging ? 'grabbing' : 'grab'}
      ref={setActivatorNodeRef}
      size="2xs"
      variant="ghost"
    >
      <PiDotsSixVertical />
    </IconButton>
  ) : null

  const dropAreas = isInReorderMode ? (
    <>
      <ComponentTreeDropArea isOver={isBeforeDropAreaOver} position="before" setNodeRef={setBeforeDropAreaNodeRef} />
      <ComponentTreeDropArea isOver={isAfterDropAreaOver} position="after" setNodeRef={setAfterDropAreaNodeRef} />
    </>
  ) : null

  if (nodeState.isBranch) {
    return (
      <TreeView.BranchControl py="0" ref={setNodeRef}>
        <Box alignItems="center" display="flex" flex="1" gap="2" minW="0" position="relative" py="1.5">
          {dropAreas}
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
      <Box alignItems="center" display="flex" flex="1" gap="2" minW="0" position="relative" py="1.5">
        {dropAreas}
        {dragHandle}
        <Icon type={component.type} />
        <TreeView.ItemText>{node.name}</TreeView.ItemText>
        {!isInReorderMode && <ComponentActionsMenu component={component} onAddChild={onAddChild} size="2xs" />}
      </Box>
    </TreeView.Item>
  )
}

type ComponentTreeDropAreaProps = {
  isOver: boolean
  position: ComponentTreeDropPosition
  setNodeRef: (element: HTMLElement | null) => void
}

const ComponentTreeDropArea: FC<ComponentTreeDropAreaProps> = ({ isOver, position, setNodeRef }) => {
  const isBefore = position === 'before'

  return (
    <Box
      bottom={isBefore ? undefined : '0'}
      height="50%"
      insetInline="0"
      pointerEvents="none"
      position="absolute"
      ref={setNodeRef}
      top={isBefore ? '0' : undefined}
    >
      {isOver && (
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
      )}
    </Box>
  )
}
