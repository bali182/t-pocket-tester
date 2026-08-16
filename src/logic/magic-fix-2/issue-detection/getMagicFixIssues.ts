import { MagicFixIssueDetectorInput, MagicFixIssueSchema } from '../../../schemas/magicFixIssues'
import { getClosedRouteStitchHoleDistanceIssues } from './getClosedRouteStitchHoleDistanceIssues'
import { getEdgeCrossingMinimumStitchHoleDistanceIssues } from './getEdgeCrossingMinimumStitchHoleDistanceIssues'
import { getEndpointMinimumEdgeDistanceIssues } from './getEndpointMinimumEdgeDistanceIssues'
import { getRouteEndpointMissingStitchHoleIssues } from './getRouteEndpointMissingStitchHoleIssues'
import { getSharpCornerStitchHoleDistanceIssues } from './getSharpCornerStitchHoleDistanceIssues'

export const getMagicFixIssues = (input: MagicFixIssueDetectorInput): MagicFixIssueSchema[] => {
  return [
    ...getSharpCornerStitchHoleDistanceIssues(input),
    ...getClosedRouteStitchHoleDistanceIssues(input),
    ...getRouteEndpointMissingStitchHoleIssues(input),
    ...getEndpointMinimumEdgeDistanceIssues(input),
    ...getEdgeCrossingMinimumStitchHoleDistanceIssues(input),
  ]
}
