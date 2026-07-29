import { ComponentSchema } from '../../schemas/components'

export type ComponentTreeNode = {
  children?: ComponentTreeNode[]
  component?: ComponentSchema
  id: string
  name: string
  nextSiblingId: string | undefined
  parentId: string | undefined
}
