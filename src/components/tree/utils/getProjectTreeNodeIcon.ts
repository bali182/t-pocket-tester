import { IconType } from 'react-icons'
import { PiCircleDashed, PiNeedle, PiRectangleDashed } from 'react-icons/pi'
import { getComponentIcon } from '../../../utils/getComponentIcon'
import { ProjectTreeNode } from '../types/nodeTypes'

export const getProjectTreeNodeIcon = (node: ProjectTreeNode): IconType => {
  switch (node.kind) {
    case 'component':
      return getComponentIcon(node.component.type)
    case 'hole': {
      switch (node.hole.type) {
        case 'rect-hole':
          return PiRectangleDashed
        case 'circle-hole':
          return PiCircleDashed
      }
    }
    case 'stitch-line':
      return PiNeedle
  }
}
