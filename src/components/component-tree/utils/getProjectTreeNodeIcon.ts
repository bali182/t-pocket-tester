import { IconType } from 'react-icons'
import { getModelIcon } from '../../../utils/getModelIcon'
import { ProjectTreeNode } from '../types/nodeTypes'

export const getProjectTreeNodeIcon = (node: ProjectTreeNode): IconType => {
  switch (node.kind) {
    case 'component':
      return getModelIcon(node.component.type)
    case 'hole':
      return getModelIcon(node.hole.type)
    case 'stitch-line':
      return getModelIcon(node.stitchLine.type)
  }
}
