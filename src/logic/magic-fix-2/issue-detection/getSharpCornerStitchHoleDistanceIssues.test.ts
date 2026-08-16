import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import type { RootPanelSchema } from '../../../schemas/components'
import type { ComputedStitchLineSchema, ComputedStitchRouteSchema } from '../../../schemas/computed'
import type { PathCommand, PointSchema } from '../../../schemas/geometry'
import type { ProjectSchema } from '../../../schemas/project'
import type { ComponentBoundsStitchLineSchema, StitchHoleSchema } from '../../../schemas/stitching'
import type { SubProjectSchema } from '../../../schemas/subProject'
import { createMagicFixConfig } from '../../../utils/createMagicFixConfig'
import { getSharpCornerStitchHoleDistanceIssues } from './getSharpCornerStitchHoleDistanceIssues'
import type { MagicFixIssueDetectorInput } from './types'

const stitchLineId = 'stitch-line'
const rootComponentId = 'root'

describe('getSharpCornerStitchHoleDistanceIssues', () => {
  it('does not report a sharp corner with the expected hole distance', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0), lineTo(10, 10)],
      holes: [holeAt(5, 0), holeAt(10, 0)],
    })

    expect(issues).toEqual([])
  })

  it('does not report an error within the configured accuracy', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0), lineTo(10, 10)],
      holes: [holeAt(5.05, 0), holeAt(10, 0)],
      accuracy: 0.1,
    })

    expect(issues).toEqual([])
  })

  it('reports an error above the configured accuracy', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0), lineTo(10, 10)],
      holes: [holeAt(4, 0), holeAt(10, 0)],
    })

    expect(issues).toEqual([
      {
        type: 'sharp-corner-stitch-hole-distance',
        route: { stitchLineId, routeIndex: 0 },
        corner: 'top-right',
        previousHoleIndex: 0,
        nextHoleIndex: 1,
        deviation: {
          expectedDistance: new BigNumber(5),
          actualDistance: new BigNumber(6),
          deviation: new BigNumber(1),
        },
      },
    ])
  })

  it('does not treat a rounded corner as sharp', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0), arcTo(5, 10, 5), lineTo(10, 10)],
      holes: [holeAt(4, 0), holeAt(10, 0)],
    })

    expect(issues).toEqual([])
  })

  it('does not connect separate routes at their endpoints', () => {
    const input = createInput([
      { commands: [moveTo(0, 0), lineTo(10, 0)], holes: [holeAt(4, 0)] },
      { commands: [moveTo(10, 0), lineTo(10, 10)], holes: [holeAt(10, 0)] },
    ])

    expect(getSharpCornerStitchHoleDistanceIssues(input)).toEqual([])
  })

  it('checks the sharp corner at a closed route boundary cyclically', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0), lineTo(10, 10), lineTo(0, 10), lineTo(0, 0)],
      holes: [
        holeAt(0, 0),
        holeAt(5, 0),
        holeAt(10, 0),
        holeAt(10, 5),
        holeAt(10, 10),
        holeAt(5, 10),
        holeAt(0, 10),
        holeAt(0, 6),
      ],
    })

    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      corner: 'top-left',
      previousHoleIndex: 7,
      nextHoleIndex: 0,
      deviation: {
        expectedDistance: new BigNumber(5),
        actualDistance: new BigNumber(6),
        deviation: new BigNumber(1),
      },
    })
  })
})

type RouteFixture = {
  commands: PathCommand[]
  holes: StitchHoleSchema[]
}

type GetIssuesOptions = RouteFixture & {
  accuracy?: number
}

const getIssues = ({ commands, holes, accuracy = 0.01 }: GetIssuesOptions) => {
  const input = createInput([{ commands, holes }])
  return getSharpCornerStitchHoleDistanceIssues({ ...input, config: { ...input.config, accuracy } })
}

const createInput = (routeFixtures: RouteFixture[]): MagicFixIssueDetectorInput => {
  const subProject = createSubProject()
  const project: ProjectSchema = {
    id: 'project',
    name: 'Project',
    subProjects: [subProject],
    editingSettings: {
      addComputedSizesToAutoSized: false,
      adjustCornerRadiiToParent: false,
      addBaseColorByDefault: false,
    },
    componentSettings: { baseColor: '#000000' },
    stitchingSettings: {
      stitchMargin: 0,
      stitchHoleLength: 1,
      stitchHoleDistance: 5,
      stitchHoleThickness: 1,
      stitchLineThickness: 1,
      stitchHoleColor: '#000000',
      stitchLineColor: '#000000',
    },
  }

  const computedStitchLine: ComputedStitchLineSchema = {
    stitchLineId,
    targetType: 'component',
    targetId: rootComponentId,
    componentId: rootComponentId,
    routes: routeFixtures.map(({ commands, holes }): ComputedStitchRouteSchema => ({ path: { commands }, holes })),
  }

  return {
    project,
    subProject,
    computed: {
      id: subProject.id,
      root: subProject.root,
      components: {},
      holes: [],
      stitchLines: [computedStitchLine],
    },
    config: createMagicFixConfig(project, subProject),
  }
}

const createSubProject = (): SubProjectSchema => {
  const rootPanel: RootPanelSchema = {
    type: 'root-panel',
    id: rootComponentId,
    name: 'Root panel',
    width: 100,
    height: 100,
    layoutOrientation: 'horizontal',
    layoutOrder: 'default',
    layoutGap: 0,
    children: [],
    borderRadius: 0,
    topLeftRadius: 0,
    topRightRadius: 0,
    bottomRightRadius: 0,
    bottomLeftRadius: 0,
    individualRadii: false,
  }

  const stitchLine: ComponentBoundsStitchLineSchema = {
    type: 'component-bounds-stitch-line',
    id: stitchLineId,
    name: 'Stitch line',
    targetType: 'component',
    targetId: rootComponentId,
    stitchHoleDistance: 5,
    top: true,
    right: true,
    bottom: true,
    left: true,
    topLeftCorner: true,
    topRightCorner: true,
    bottomRightCorner: true,
    bottomLeftCorner: true,
    topStartOffset: 0,
    topEndOffset: 0,
    rightStartOffset: 0,
    rightEndOffset: 0,
    bottomStartOffset: 0,
    bottomEndOffset: 0,
    leftStartOffset: 0,
    leftEndOffset: 0,
    topStitchDirection: 'left-to-right',
    rightStitchDirection: 'top-to-bottom',
    bottomStitchDirection: 'right-to-left',
    leftStitchDirection: 'bottom-to-top',
  }

  return {
    id: 'sub-project',
    root: rootComponentId,
    components: { [rootComponentId]: rootPanel },
    holes: [],
    stitchLines: [stitchLine],
  }
}

const moveTo = (x: number, y: number): PathCommand => ({ type: 'moveTo', point: point(x, y) })
const lineTo = (x: number, y: number): PathCommand => ({ type: 'lineTo', point: point(x, y) })
const arcTo = (radius: number, x: number, y: number): PathCommand => ({
  type: 'arcTo',
  radius: new BigNumber(radius),
  point: point(x, y),
  reversed: false,
})

const holeAt = (x: number, y: number): StitchHoleSchema => ({ center: point(x, y), rotation: 0 })

const point = (x: number, y: number): PointSchema => ({ x: new BigNumber(x), y: new BigNumber(y) })
