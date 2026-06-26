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

/** A straight line segment suitable for SVG rendering. All values are measured in millimeters. */
export type LineModel = {
  /** Starting point of the line segment in the SVG-like coordinate system. */
  start: Point
  /** Ending point of the line segment in the SVG-like coordinate system. */
  end: Point
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
   * Total number of pockets, including the top cover pocket. The minimum
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
export type CalculatedCardHolderModel = {
  /** Bounding size of the complete card holder drawing. */
  overallSize: Size
  /** Back panel that all pockets are stitched onto. */
  backPanel: BackPanelModel
  /** Calculated cards. The order follows the pocket order from top to bottom. */
  cards: CardModel[]
  /** Calculated T-pockets. For an input pocketCount of N, this list contains N - 1 items. */
  tPockets: TPocketModel[]
  /** Top rectangular cover pocket placed above the T-pockets. */
  coverPocket: TopPocketModel
}

/** A card placed into one of the card holder pockets. */
export type CardModel = {
  kind: 'card'
  /** Card index counted in the same top-to-bottom order as pockets. */
  index: number
  /** Rectangular card outline used for SVG rendering. */
  outline: Rect
}

/** The rectangular leather back panel that carries every pocket. */
export type BackPanelModel = {
  kind: 'backPanel'
  /**  Rectangular outline of the full back panel. */
  outline: Rect
}

/** A full rectangular cover pocket. This is the top pocket above all T-pockets. */
export type TopPocketModel = {
  kind: 'topPocket'
  /** Rectangular outline of the entire leather pocket piece. */
  outline: Rect
}

/**
 * A T-shaped leather pocket. Its top is a thin rectangular tab strip and its
 * lower part is an inverted trapezoid that narrows downward.
 */
export type TPocketModel = {
  kind: 'tPocket'
  /** Pocket index counted from top to bottom. */
  index: number
  /** Top-left corner of the full top tab strip. */
  topLeft: Point
  /** Top-right corner of the full top tab strip. */
  topRight: Point
  /** Bottom-right corner of the right tab area. */
  rightTabBottom: Point
  /** Top-right corner of the lower trapezoid where it meets the right tab. */
  rightTrapezoidTop: Point
  /** Bottom-right corner of the lower trapezoid. */
  rightBottom: Point
  /** Bottom-left corner of the lower trapezoid. */
  leftBottom: Point
  /** Top-left corner of the lower trapezoid where it meets the left tab. */
  leftTrapezoidTop: Point
  /** Bottom-left corner of the left tab area. */
  leftTabBottom: Point
  /** Full outline of the T-pocket as a polygon suitable for SVG path or polygon drawing. */
  outline: Polygon
}

/** Stitch lines calculated for a T-pocket. */
export type TPocketStitchLinesModel = {
  /** Vertical stitch line inside the left top tab. */
  leftTabStitchLine: LineModel
  /** Vertical stitch line inside the right top tab. */
  rightTabStitchLine: LineModel
  /** Horizontal stitch line near the bottom edge of the lower trapezoid. */
  bottomStitchLine: LineModel
}

/** Stitch lines calculated for the top pocket. */
export type TopPocketStitchLinesModel = {
  /** Vertical stitch line near the left edge of the pocket. */
  leftStitchLine: LineModel
  /** Vertical stitch line near the right edge of the pocket. */
  rightStitchLine: LineModel
  /** Horizontal stitch line near the bottom edge of the pocket. */
  bottomStitchLine: LineModel
}
