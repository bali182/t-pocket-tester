import { MagicFixIssueSchema } from '../../../schemas/magicFixIssues'
import { getClosedRouteStitchHoleDistanceIssues } from './getClosedRouteStitchHoleDistanceIssues'
import { getRouteEndpointMissingStitchHoleIssues } from './getRouteEndpointMissingStitchHoleIssues'
import { getSharpCornerStitchHoleDistanceIssues } from './getSharpCornerStitchHoleDistanceIssues'
import { MagicFixIssueDetectorInput } from './types'

export const getMagicFixIssues = (input: MagicFixIssueDetectorInput): MagicFixIssueSchema[] => {
  return [
    ...getSharpCornerStitchHoleDistanceIssues(input),
    ...getClosedRouteStitchHoleDistanceIssues(input),
    ...getRouteEndpointMissingStitchHoleIssues(input),
  ]
}
