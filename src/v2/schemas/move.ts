export type ComponentMovePlacementSchema = 'after' | 'before' | 'inside'

export type ComponentTreeDropAreaSchema = {
  beforeComponentId: string | undefined
  targetParentId: string
}
