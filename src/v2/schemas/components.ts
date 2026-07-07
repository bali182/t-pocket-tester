import { FillableSize, SizeSchema } from './geometry'

export type BaseComponentSchema = {
  id: string
  name: string
  color: string
}

export type HasChildrenSchema = {
  children: string[]
}

export type HasLayoutSchema = {
  layout: LayoutSchema
}

export type LayoutOrientation = 'horizontal' | 'vertical'
export type LayoutOrder = 'default' | 'reverse'

export type LayoutSchema = {
  orientation: LayoutOrientation
  order: LayoutOrder
  gap: number
}

/** A plain panel. Can have children (stuff placed on top of it) */
export type RootPanelSchema = BaseComponentSchema &
  HasLayoutSchema &
  HasChildrenSchema & {
    type: 'root-panel'
    size: SizeSchema
  }

/** A plain panel. Can have children (stuff placed on top of it) */
export type PanelSchema = BaseComponentSchema &
  HasLayoutSchema &
  HasChildrenSchema & {
    type: 'panel'
    size?: FillableSize
  }

export type PocketOrientation = 'up' | 'down' | 'left' | 'right'

/**
 * A cluster of pockets.
 * Does not hold individual pockets, rather pocketCount-1 T-Pockets and 1 top pocket (computed internally).
 */
export type PocketClusterSchema = BaseComponentSchema & {
  type: 'pocket-cluster'
  /** The bounding rectangle of the cluster */
  size?: FillableSize
  /** How many pockets do we have in this cluster (min 1) */
  pocketCount: number
  /** How far each pocket is offset from the previous one along the stack axis */
  pocketStep: number
  /** Direction where the pocket opening is. Example means you can put the card in from the top, and left means from the left side. */
  orientation: PocketOrientation
  /** Size of the flaps/tabs on the T-Pockets */
  tPocketTabWidth: number
  /** How much the t pockets taper from the 2 * tPocketTabWidth reduced width to the bottom of the pocket */
  tPocketTaper: number
}

export type ComponentSchema = RootPanelSchema | PanelSchema | PocketClusterSchema
