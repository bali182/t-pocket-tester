import BigNumber from 'bignumber.js'

import type { MagicFixIssueSchema } from '../../../../../schemas/magicFixIssues'
import type { AdaptiveMagicFixHeuristicsScore } from '../types'

export const getMagicFixIssuesScore = (issues: readonly MagicFixIssueSchema[]): AdaptiveMagicFixHeuristicsScore => {
  return {
    issueCount: issues.length,
    totalDeviation: issues.reduce(
      (totalDeviation, issue) => totalDeviation.plus(getIssueDeviation(issue)),
      new BigNumber(0),
    ),
  }
}

const getIssueDeviation = (issue: MagicFixIssueSchema): BigNumber => {
  switch (issue.type) {
    case 'sharp-corner-stitch-hole-distance':
    case 'closed-route-stitch-hole-distance':
    case 'endpoint-minimum-edge-distance':
      return issue.deviation.deviation
    case 'route-endpoint-missing-stitch-hole':
      return issue.lastHoleDistanceToEndpoint
    case 'edge-crossing-minimum-stitch-hole-distance':
      return issue.beforeCrossing.deviation.deviation.plus(issue.afterCrossing.deviation.deviation)
  }
}
