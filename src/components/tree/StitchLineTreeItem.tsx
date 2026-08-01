import { IconButton, TreeView } from '@chakra-ui/react'
import { useDraggable } from '@dnd-kit/core'
import type { FC } from 'react'
import { PiDotsSixVertical } from 'react-icons/pi'

import { StitchLineActionsMenu } from '../StitchLineActionsMenu'
import { TreeItemVisual } from './TreeItemVisual'
import type { TreeDragData } from './types/dragDataTypes'
import type { StitchLineTreeNode } from './types/nodeTypes'
import { getProjectTreeNodeIcon } from './utils/getProjectTreeNodeIcon'
import { getProjectTreeNodeLabel } from './utils/getProjectTreeNodeLabel'

type StitchLineTreeItemProps = {
  activeDragData: TreeDragData | undefined
  indexPath: number[]
  isInReorderMode: boolean
  node: StitchLineTreeNode
  onDelete: (stitchLineId: string) => void
}

export const StitchLineTreeItem: FC<StitchLineTreeItemProps> = ({
  activeDragData,
  indexPath,
  isInReorderMode,
  node,
  onDelete,
}) => {
  const { stitchLine } = node
  const isActiveStitchLine = activeDragData?.kind === 'stitch-line' && activeDragData.stitchLineId === stitchLine.id
  const isDisabledForActiveDrag = activeDragData !== undefined && !isActiveStitchLine
  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef } = useDraggable({
    data: {
      indexPath,
      kind: 'stitch-line',
      node,
      stitchLineId: stitchLine.id,
      stitchLineType: stitchLine.type,
    },
    disabled: !isInReorderMode,
    id: node.id,
  })

  return (
    <TreeView.Item
      cursor={isDisabledForActiveDrag ? 'not-allowed' : undefined}
      opacity={isDisabledForActiveDrag ? 0.4 : undefined}
      ref={setNodeRef}
      py="0"
      h="9"
    >
      <TreeItemVisual
        icon={getProjectTreeNodeIcon(node)}
        isBranch={false}
        isExpandable={false}
        isPositioned={false}
        label={getProjectTreeNodeLabel(node)}
        leading={
          isInReorderMode ? (
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
        }
        trailing={!isInReorderMode && <StitchLineActionsMenu size="2xs" stitchLine={stitchLine} onDelete={onDelete} />}
      />
    </TreeView.Item>
  )
}
