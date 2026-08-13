import type BigNumber from 'bignumber.js'

import type { PointSchema } from './geometry'
import type { StitchCornerSchema } from './stitching'

export type MagicFixRouteReferenceSchema = {
  stitchLineId: string
  routeIndex: number
}

export type MagicFixRouteEndpointSchema = 'start' | 'end'

export type MagicFixDistanceDeviationSchema = {
  expectedDistance: BigNumber
  actualDistance: BigNumber
  deviation: BigNumber
}

export type MagicFixMinimumDistanceDeviationSchema = {
  minimumDistance: BigNumber
  actualDistance: BigNumber
  deviation: BigNumber
}

export type MagicFixComponentBoundaryOwnerSchema = {
  componentId: string
  element: 'component'
}

export type MagicFixFrontPocketBoundaryOwnerSchema = {
  componentId: string
  element: 'front-pocket'
}

export type MagicFixTPocketBoundaryOwnerSchema = {
  componentId: string
  element: 't-pocket'
  tPocketIndex: number
}

export type MagicFixBoundaryOwnerSchema =
  | MagicFixComponentBoundaryOwnerSchema
  | MagicFixFrontPocketBoundaryOwnerSchema
  | MagicFixTPocketBoundaryOwnerSchema

export type MagicFixLineBoundaryFragmentSchema = {
  type: 'line'
  owner: MagicFixBoundaryOwnerSchema
  start: PointSchema
  end: PointSchema
}

export type MagicFixArcBoundaryFragmentSchema = {
  type: 'arc'
  owner: MagicFixBoundaryOwnerSchema
  start: PointSchema
  end: PointSchema
  center: PointSchema
  radius: BigNumber
}

export type MagicFixBoundaryFragmentSchema = MagicFixLineBoundaryFragmentSchema | MagicFixArcBoundaryFragmentSchema

export type MagicFixCrossingHoleMinimumDistanceSchema = {
  type: 'distance'
  holeIndex: number
  deviation: MagicFixMinimumDistanceDeviationSchema
}

export type MagicFixCrossingHoleMissingSchema = {
  type: 'missing'
}

export type MagicFixCrossingHoleResultSchema =
  | MagicFixCrossingHoleMinimumDistanceSchema
  | MagicFixCrossingHoleMissingSchema

/** Created when the two holes on either side of a connected sharp corner are not stitchHoleDistance apart. */
export type MagicFixSharpCornerStitchHoleDistanceIssueSchema = {
  type: 'sharp-corner-stitch-hole-distance'
  /** The route that contains the connected sharp corner. */
  route: MagicFixRouteReferenceSchema
  /** The sharp corner between the two holes. */
  corner: StitchCornerSchema
  /** Index of the final hole before the sharp corner. */
  previousHoleIndex: number
  /** Index of the first hole after the sharp corner. */
  nextHoleIndex: number
  /** The expected, actual, and absolute distance error between the two holes. */
  deviation: MagicFixDistanceDeviationSchema
}

/** Created when the first and last holes of a closed non-sharp route are not stitchHoleDistance apart. */
export type MagicFixClosedRouteStitchHoleDistanceIssueSchema = {
  type: 'closed-route-stitch-hole-distance'
  /** The closed route whose closing hole distance is invalid. */
  route: MagicFixRouteReferenceSchema
  /** The expected, actual, and absolute distance error between the closing holes. */
  deviation: MagicFixDistanceDeviationSchema
}

/** Created when the final hole of an open route is farther from its endpoint than the allowed accuracy. */
export type MagicFixRouteEndpointMissingStitchHoleIssueSchema = {
  type: 'route-endpoint-missing-stitch-hole'
  /** The open route whose endpoint does not have a sufficiently close final hole. */
  route: MagicFixRouteReferenceSchema
  /** The geometric position of the route endpoint that the final hole should reach. */
  endpointPosition: PointSchema
  /** Distance between the route's final hole and its endpoint. */
  lastHoleDistanceToEndpoint: BigNumber
}

/** Created when the hole at a non-overhanging route endpoint is closer to its boundary than the preferred minimum. */
export type MagicFixEndpointMinimumEdgeDistanceIssueSchema = {
  type: 'endpoint-minimum-edge-distance'
  /** The route with the endpoint-hole clearance violation. */
  route: MagicFixRouteReferenceSchema
  /** Whether the clearance violation is at the route start or end. */
  endpoint: MagicFixRouteEndpointSchema
  /** The physical component or pocket boundary that is too close to the endpoint hole. */
  boundary: MagicFixBoundaryFragmentSchema
  /** The preferred minimum, actual distance, and amount by which the clearance is missed. */
  deviation: MagicFixMinimumDistanceDeviationSchema
}

/** Created when a route crosses a physical boundary and either adjacent hole is missing or too close to that boundary. */
export type MagicFixEdgeCrossingMinimumStitchHoleDistanceIssueSchema = {
  type: 'edge-crossing-minimum-stitch-hole-distance'
  /** The route that crosses the boundary. */
  route: MagicFixRouteReferenceSchema
  /** The physical component or pocket boundary crossed by the route. */
  boundary: MagicFixBoundaryFragmentSchema
  /** The hole immediately before the crossing, or its missing state. */
  beforeCrossing: MagicFixCrossingHoleResultSchema
  /** The hole immediately after the crossing, or its missing state. */
  afterCrossing: MagicFixCrossingHoleResultSchema
}

export type MagicFixValidationIssueSchema =
  | MagicFixSharpCornerStitchHoleDistanceIssueSchema
  | MagicFixClosedRouteStitchHoleDistanceIssueSchema
  | MagicFixRouteEndpointMissingStitchHoleIssueSchema
  | MagicFixEndpointMinimumEdgeDistanceIssueSchema
  | MagicFixEdgeCrossingMinimumStitchHoleDistanceIssueSchema
