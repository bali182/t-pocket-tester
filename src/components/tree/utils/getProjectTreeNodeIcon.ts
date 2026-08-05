import { IconType } from 'react-icons'
import { PiNeedle, PiRectangleDashed } from 'react-icons/pi'
import { getComponentIcon } from '../../../utils/getComponentIcon'
import { ProjectTreeNode } from '../types/nodeTypes'

export const getProjectTreeNodeIcon = (node: ProjectTreeNode): IconType => {
  switch (node.kind) {
    case 'component':
      return getComponentIcon(node.component.type)
    case 'hole':
      return PiRectangleDashed
    case 'stitch-line':
      return PiNeedle
  }
}
