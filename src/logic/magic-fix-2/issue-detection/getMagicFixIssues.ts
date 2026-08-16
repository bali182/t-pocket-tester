import { MagicFixIssueSchema } from '../../../schemas/magicFixIssues'
import { getSharpCornerStitchHoleDistanceIssues } from './getSharpCornerStitchHoleDistanceIssues'
import { MagicFixIssueDetectorInput } from './types'

export const getMagicFixIssues = (input: MagicFixIssueDetectorInput): MagicFixIssueSchema[] => {
  return [...getSharpCornerStitchHoleDistanceIssues(input)]
}
