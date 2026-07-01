import { SizeSchema } from './geometry'

export type BaseComponentSchema = {
  id: string
  name: string
  color: string
}

export type LayoutedComponentSchema = {
  layout: LayoutSchema
}

export type LayoutOrientation = 'horizontal' | 'vertical'

export type LayoutSchema = {
  orientation: LayoutOrientation
  gap: number
}

/** A plain panel. Can have children (stuff placed on top of it) */
export type RootPanelSchema = BaseComponentSchema &
  LayoutedComponentSchema & {
    type: 'root-panel'
    size: SizeSchema
    children: string[]
  }

/** A plain panel. Can have children (stuff placed on top of it) */
export type PanelSchema = BaseComponentSchema &
  LayoutedComponentSchema & {
    type: 'panel'
    size?: 'fill' | number | SizeSchema
    children: string[]
  }

/** A plain pocket. Can have children (stuff placed on top of it) */
export type PocketSchema = BaseComponentSchema & {
  type: 'pocket'
}

/**
 * A cluster of pockets.
 * Does not hold individual pockets, rather pocketCount-1 T-Pockets and 1 top pocket (computed internally).
 */
export type PocketClusterSchema = BaseComponentSchema & {
  type: 'pocket-cluster'
  /** The size of a card going into a pocket */
  cardSize: SizeSchema
  /** How many pockets do we have in this cluster (min 1) */
  pocketCount: number
  /** How much space between the stitchlines on the sides and the card in a pocket */
  sideClearance: number
  /** How much space between the stitchlines on the bottom of the pocket and the bottom of the card  */
  bottomClearance: number
  /** How much space between the pockets (the full width part of the t-pockets) */
  pocketSpacing: number
  /** How tall is a pocket (full bounding box) */
  pocketHeight: number
  /** Size of the flaps/tabs on the T-Pockets */
  tPocketTabWidth: number
  /** How much the t pockets taper from the 2 * tPocketTabWidth reduced width to the bottom of the pocket */
  tPocketTaper: number
}

export type ComponentSchema = RootPanelSchema | PanelSchema | PocketSchema | PocketClusterSchema
