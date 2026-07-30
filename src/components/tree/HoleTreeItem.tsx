import { IconButton, TreeView, type TreeViewNodeState } from '@chakra-ui/react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useCallback, useMemo, type FC } from 'react'
import { PiDotsSixVertical } from 'react-icons/pi'

import { isDefined } from '../../utils/isDefined'
import { DropInsideIndicator } from './ComponentTreeDropIndicators'
import { HoleActionsMenu } from './HoleActionsMenu'
import { TreeItemVisual } from './TreeItemVisual'
import type { TreeDragData } from './types/dragDataTypes'
import type { HoleStitchLineDropData } from './types/dropDataTypes'
import type { HoleTreeNode } from './types/nodeTypes'
import { getProjectTreeNodeIcon } from './utils/getProjectTreeNodeIcon'
import { getProjectTreeNodeLabel } from './utils/getProjectTreeNodeLabel'

type HoleTreeItemProps = {
  activeDragData: TreeDragData | undefined
  indexPath: number[]
  isInReorderMode: boolean
  node: HoleTreeNode
  nodeState: TreeViewNodeState
}

export const HoleTreeItem: FC<HoleTreeItemProps> = ({
  activeDragData,
  indexPath,
  isInReorderMode,
  node,
  nodeState,
}) => {
  const { hole } = node
  const isActiveHole = activeDragData?.kind === 'hole' && activeDragData.holeId === hole.id
  const canAcceptStitchLine =
    activeDragData?.kind === 'stitch-line' && activeDragData.stitchLineType === 'component-bounds-stitch-line'
  const isDisabledForActiveDrag = isDefined(activeDragData) && !isActiveHole && !canAcceptStitchLine

  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef } = useDraggable({
    data: {
      holeId: hole.id,
      indexPath,
      kind: 'hole',
      node,
    },
    disabled: !isInReorderMode,
    id: node.id,
  })

  const dropData = useMemo<HoleStitchLineDropData>(
    () => ({
      holeId: hole.id,
      kind: 'hole-stitch-line',
    }),
    [hole.id],
  )

  const { isOver, setNodeRef: setDropNodeRef } = useDroppable({
    data: dropData,
    disabled: !isInReorderMode || !canAcceptStitchLine,
    id: `${node.id}:stitch-line`,
  })

  const setTreeNodeRef = useCallback(
    (element: HTMLElement | null): void => {
      setNodeRef(element)
      setDropNodeRef(element)
    },
    [setDropNodeRef, setNodeRef],
  )

  const Icon = getProjectTreeNodeIcon(node)
  const label = getProjectTreeNodeLabel(node)
  const dragHandle = isInReorderMode ? (
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
  const dropFeedback = isOver ? <DropInsideIndicator /> : null

  if (nodeState.isBranch) {
    return (
      <TreeView.BranchControl
        cursor={isDisabledForActiveDrag ? 'not-allowed' : undefined}
        opacity={isDisabledForActiveDrag ? 0.4 : undefined}
        ref={setTreeNodeRef}
        py="0"
        h="9"
      >
        {dropFeedback}
        <TreeItemVisual
          icon={Icon}
          isBranch={true}
          isPositioned={true}
          label={label}
          leading={dragHandle}
          trailing={!isInReorderMode && <HoleActionsMenu size="2xs" />}
        />
      </TreeView.BranchControl>
    )
  }

  return (
    <TreeView.Item
      cursor={isDisabledForActiveDrag ? 'not-allowed' : undefined}
      opacity={isDisabledForActiveDrag ? 0.4 : undefined}
      ref={setTreeNodeRef}
      py="0"
      h="9"
    >
      {dropFeedback}
      <TreeItemVisual
        icon={Icon}
        isBranch={false}
        isPositioned={true}
        label={label}
        leading={dragHandle}
        trailing={!isInReorderMode && <HoleActionsMenu size="2xs" />}
      />
    </TreeView.Item>
  )
}
