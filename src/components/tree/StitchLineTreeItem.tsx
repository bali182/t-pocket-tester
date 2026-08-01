import { IconButton, TreeView } from '@chakra-ui/react'
import { useDraggable } from '@dnd-kit/core'
import { useCallback, type FC, type MouseEvent } from 'react'
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
  node: StitchLineTreeNode
  onDelete: (stitchLineId: string) => void
}

export const StitchLineTreeItem: FC<StitchLineTreeItemProps> = ({
  activeDragData,
  indexPath,
  node,
  onDelete,
}) => {
  const { stitchLine } = node
  const isActiveStitchLine = activeDragData?.kind === 'stitch-line' && activeDragData.stitchLineId === stitchLine.id
  const isDisabledForActiveDrag = activeDragData !== undefined && !isActiveStitchLine
  const handleDragHandleClick = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
  }, [])
  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef } = useDraggable({
    data: {
      indexPath,
      kind: 'stitch-line',
      node,
      stitchLineId: stitchLine.id,
      stitchLineType: stitchLine.type,
    },
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
          <IconButton
            {...attributes}
            {...listeners}
            cursor={isDragging ? 'grabbing' : 'grab'}
            onClick={handleDragHandleClick}
            ref={setActivatorNodeRef}
            size="2xs"
            variant="ghost"
            _hover={{ bg: 'transparent' }}
          >
            <PiDotsSixVertical />
          </IconButton>
        }
        trailing={<StitchLineActionsMenu size="2xs" stitchLine={stitchLine} onDelete={onDelete} />}
      />
    </TreeView.Item>
  )
}
