import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import type { MagicFixIssueSchema } from '../../../../../schemas/magicFixIssues'
import { getMagicFixIssuesScore } from './getMagicFixIssuesScore'

describe('getMagicFixIssuesScore', () => {
  it('should return a zero score for an empty issue list', () => {
    expect(getMagicFixIssuesScore([])).toEqual({ issueCount: 0, totalDeviation: new BigNumber(0) })
  })

  it('should sum the deviation of every issue type', () => {
    const point = { x: new BigNumber(0), y: new BigNumber(0) }
    const route = { stitchLineId: 'line', routeIndex: 0 }
    const boundary = {
      type: 'line' as const,
      owner: { componentId: 'root', element: 'component' as const },
      start: point,
      end: point,
    }
    const issues: MagicFixIssueSchema[] = [
      {
        type: 'sharp-corner-stitch-hole-distance',
        route,
        corner: 'top-left',
        previousHoleIndex: 0,
        nextHoleIndex: 1,
        deviation: {
          expectedDistance: new BigNumber(10),
          actualDistance: new BigNumber(8),
          deviation: new BigNumber(2),
        },
      },
      {
        type: 'closed-route-stitch-hole-distance',
        route,
        deviation: {
          expectedDistance: new BigNumber(10),
          actualDistance: new BigNumber(7),
          deviation: new BigNumber(3),
        },
      },
      {
        type: 'route-endpoint-missing-stitch-hole',
        route,
        endpointPosition: point,
        lastHoleDistanceToEndpoint: new BigNumber(7),
      },
      {
        type: 'endpoint-minimum-edge-distance',
        route,
        endpoint: 'start',
        boundary,
        deviation: {
          minimumDistance: new BigNumber(10),
          actualDistance: new BigNumber(6),
          deviation: new BigNumber(4),
        },
      },
      {
        type: 'edge-crossing-minimum-stitch-hole-distance',
        route,
        boundary,
        beforeCrossing: {
          type: 'distance',
          holeIndex: 1,
          deviation: {
            minimumDistance: new BigNumber(10),
            actualDistance: new BigNumber(9),
            deviation: new BigNumber(1),
          },
        },
        afterCrossing: {
          type: 'distance',
          holeIndex: 2,
          deviation: {
            minimumDistance: new BigNumber(10),
            actualDistance: new BigNumber(4),
            deviation: new BigNumber(6),
          },
        },
      },
    ]

    expect(getMagicFixIssuesScore(issues)).toEqual({ issueCount: 5, totalDeviation: new BigNumber(23) })
  })
})
