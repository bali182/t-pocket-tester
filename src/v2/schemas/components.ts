import { FillableSizeSchema, SizeSchema } from './geometry'

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

export type HasCornerRadiusSchema = {
  radius: number | CornerRadiusSchema
}

export type LayoutOrientationSchema = 'horizontal' | 'vertical'
export type LayoutOrderSchema = 'default' | 'reverse'

export type CornerRadiusSchema = {
  topLeft: number
  topRight: number
  bottomLeft: number
  bottomRight: number
}

export type LayoutSchema = {
  orientation: LayoutOrientationSchema
  order: LayoutOrderSchema
  gap: number
}

/** A plain panel. Can have children (stuff placed on top of it) */
export type RootPanelSchema = BaseComponentSchema &
  HasLayoutSchema &
  HasChildrenSchema &
  HasCornerRadiusSchema & {
    type: 'root-panel'
    size: SizeSchema
  }

/** A plain panel. Can have children (stuff placed on top of it) */
export type PanelSchema = BaseComponentSchema &
  HasLayoutSchema &
  HasChildrenSchema &
  HasCornerRadiusSchema & {
    type: 'panel'
    size?: FillableSizeSchema
  }

export type PocketOrientationSchema = 'up' | 'down' | 'left' | 'right'

/**
 * A cluster of pockets.
 * Does not hold individual pockets, rather pocketCount-1 T-Pockets and 1 top pocket (computed internally).
 */
export type PocketClusterSchema = BaseComponentSchema &
  HasCornerRadiusSchema & {
    type: 'pocket-cluster'
    /** The bounding rectangle of the cluster */
    size?: FillableSizeSchema
    /** How many pockets do we have in this cluster (min 1) */
    pocketCount: number
    /** How far each pocket is offset from the previous one along the stack axis */
    pocketStep: number
    /** Direction where the pocket opening is. Example means you can put the card in from the top, and left means from the left side. */
    orientation: PocketOrientationSchema
    /** Size of the flaps/tabs on the T-Pockets */
    tPocketTabWidth: number
    /** How much the t pockets taper from the 2 * tPocketTabWidth reduced width to the bottom of the pocket */
    tPocketTaper: number
    /**
     * The corner radius of pockets on the card insertion side (for example orientaton === up => top left and right radius)
     * The top pockets other 2 exposed corners are specified by the clusters radius, not this radius.
     */
    pocketRadius: number
  }

export type ComponentSchema = RootPanelSchema | PanelSchema | PocketClusterSchema
