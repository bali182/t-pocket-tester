import { ProjectTreeNode } from '../types/nodeTypes'

export const getProjectTreeNodeLabel = (node: ProjectTreeNode): string => {
  switch (node.kind) {
    case 'component':
      return node.component.name
    case 'hole':
      return node.hole.name
    case 'stitch-line':
      return node.stitchLine.name
  }
}
