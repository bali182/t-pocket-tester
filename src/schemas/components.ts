export type HasIdentitySchema = {
  id: string
  name: string
}

export type HasColorSchema = {
  color: string
}

export type BaseComponentSchema = HasIdentitySchema & HasColorSchema

export type HasChildrenSchema = {
  children: string[]
}

export type HasLayoutSchema = {
  layoutOrientation: LayoutOrientationSchema
  layoutOrder: LayoutOrderSchema
  layoutGap: number
}

export type HasCornerRadiusSchema = {
  individualRadii: boolean
  borderRadius: number
  topLeftRadius: number
  topRightRadius: number
  bottomLeftRadius: number
  bottomRightRadius: number
}

export type HasSizeSchema = {
  width: number
  height: number
}

export type HasFillableSizeSchema = HasSizeSchema & {
  autoWidth: boolean
  autoHeight: boolean
}

export type LayoutOrientationSchema = 'horizontal' | 'vertical'
export type LayoutOrderSchema = 'default' | 'reverse'

/** A plain panel. Can have children (stuff placed on top of it) */
export type RootPanelSchema = BaseComponentSchema &
  HasLayoutSchema &
  HasChildrenSchema &
  HasCornerRadiusSchema &
  HasSizeSchema & {
    type: 'root-panel'
  }

/** A plain panel. Can have children (stuff placed on top of it) */
export type PanelSchema = BaseComponentSchema &
  HasLayoutSchema &
  HasChildrenSchema &
  HasCornerRadiusSchema &
  HasFillableSizeSchema & {
    type: 'panel'
  }

export type PocketOrientationSchema = 'up' | 'down' | 'left' | 'right'

/**
 * A cluster of pockets.
 * Does not hold individual pockets, rather pocketCount-1 T-Pockets and 1 top pocket (computed internally).
 */
export type PocketClusterSchema = BaseComponentSchema &
  HasCornerRadiusSchema &
  HasFillableSizeSchema & {
    type: 'pocket-cluster'
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
  }

export type ComponentSchema = RootPanelSchema | PanelSchema | PocketClusterSchema
