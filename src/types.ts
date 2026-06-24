/** A two-dimensional size. All values are measured in millimeters. */
export type Size = {
  width: number
  height: number
}

/** Values are in millimeters. From top left corner. */
export type Point = {
  x: number
  y: number
}

/** Values are in millimeters. */
export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type Polygon = {
  points: Point[]
}

/**
 * Orientation of a standard ISO card size. Custom card dimensions do not have a
 * CardOrientation value and are represented as undefined in the UI layer.
 */
export type CardOrientation = 'landscape' | 'portrait'

/**
 * Input parameters for a vertically oriented leather card holder made from
 * stacked pockets. All numeric values are measured in millimeters.
 */
export type CardHolderInput = {
  /**
   * Width and height of a single card. This is configurable so portrait and
   * landscape layouts can be recalculated without hard-coded card dimensions.
   */
  cardSize: Size

  /**
   * Total number of pockets, including the top plain cover pocket. The minimum
   * meaningful value is 1; a value of N produces N - 1 T-pockets and 1 cover pocket.
   */
  pocketCount: number

  /**
   * Distance between the stitch line and the leather edge. This margin is used
   * around the side tabs of T-pockets, around the three stitched sides of the
   * cover pocket, and from the bottom of a T-pocket to its bottom stitch line.
   */
  stitchMargin: number

  /**
   * Side clearance between the stitch line and the card edge so cards can slide
   * into the pockets without binding.
   */
  cardSideClearanceFromStitch: number

  /**
   * Bottom clearance between the bottom stitch line and the card edge. This is
   * independent from the side clearance because the card needs different room at
   * the bottom of the pocket.
   */
  cardBottomClearanceFromStitch: number

  /**
   * Vertical offset between consecutive pockets. This is also the visible height
   * of the small T-tab step between pockets.
   */
  pocketSpacing: number

  /**
   * Width of each side tab at the top of a T-pocket. The tab must be wide enough
   * to contain the stitch margin, but that constraint is documented rather than
   * encoded in the type system.
   */
  tPocketTabWidth: number

  /**
   * Symmetric inward taper of the T-pocket's lower trapezoid, measured from the
   * full calculated pocket width on each side. For example, a value of 10 means
   * the lower edge is inset by 10 millimeters on the left and 10 millimeters on
   * the right.
   */
  tPocketTaper: number

  /**
   * Height of the card area that remains visible above a pocket. The actual
   * leather pocket height is calculated from this value and the card dimensions.
   */
  visibleCardHeight: number
}

/** Configuration for a numeric CardHolderInput field rendered in the input editor. */
export type CardHolderInputField = {
  key: keyof CardHolderInput
  label: string
  min?: number
  max?: number
}

/** Identifier of an input editor accordion section. */
export type SectionId = 'card' | 'pockets' | 'stitching'

/** Calculated drawing model for a complete vertically oriented card holder. */
export type CalculatedCardHolder = {
  /** Bounding size of the complete card holder drawing. */
  overallSize: Size
  /** Back panel that all pockets are stitched onto. */
  backPanel: BackPanel
  /** Calculated T-pockets. For an input pocketCount of N, this list contains N - 1 items. */
  tPockets: TPocket[]
  /** Top plain rectangular cover pocket placed above the T-pockets. */
  coverPocket: PlainPocket
}

/** The rectangular leather back panel that carries every pocket. */
export type BackPanel = {
  kind: 'backPanel'
  /**  Rectangular outline of the full back panel. */
  outline: Rect
}

/** A full rectangular cover pocket. This is the top pocket above all T-pockets. */
export type PlainPocket = {
  kind: 'plainPocket'
  /** Rectangular outline of the entire leather pocket piece. */
  outline: Rect
}

/**
 * A T-shaped leather pocket. Its top is a thin rectangular tab strip and its
 * lower part is an inverted trapezoid that narrows downward.
 */
export type TPocket = {
  kind: 'tPocket'
  /** Pocket index counted from top to bottom. */
  index: number
  /** Full outline of the T-pocket as a polygon suitable for SVG path or polygon drawing. */
  outline: Polygon
}
