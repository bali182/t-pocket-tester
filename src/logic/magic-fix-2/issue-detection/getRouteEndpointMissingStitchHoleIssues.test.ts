import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import type { RootPanelSchema } from '../../../schemas/components'
import type { ComputedStitchLineSchema, ComputedStitchRouteSchema } from '../../../schemas/computed'
import type { PathCommand, PointSchema } from '../../../schemas/geometry'
import type { ProjectSchema } from '../../../schemas/project'
import type { ComponentBoundsStitchLineSchema, StitchHoleSchema } from '../../../schemas/stitching'
import type { SubProjectSchema } from '../../../schemas/subProject'
import { createMagicFixConfig } from '../../../utils/createMagicFixConfig'
import { getRouteEndpointMissingStitchHoleIssues } from './getRouteEndpointMissingStitchHoleIssues'
import type { MagicFixIssueDetectorInput } from './types'

const stitchLineId = 'stitch-line'
const rootComponentId = 'root'

describe('getRouteEndpointMissingStitchHoleIssues', () => {
  it('does not report a hole at the route endpoint', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0)],
      holes: [holeAt(0, 0), holeAt(10, 0)],
    })

    expect(issues).toEqual([])
  })

  it('does not report a hole within the configured accuracy', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0)],
      holes: [holeAt(0, 0), holeAt(9.95, 0)],
      accuracy: 0.1,
    })

    expect(issues).toEqual([])
  })

  it('reports a missing endpoint hole above the configured accuracy', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0)],
      holes: [holeAt(0, 0), holeAt(6, 0)],
    })

    expect(issues).toEqual([
      {
        type: 'route-endpoint-missing-stitch-hole',
        route: { stitchLineId, routeIndex: 0 },
        endpointPosition: point(10, 0),
        lastHoleDistanceToEndpoint: new BigNumber(4),
      },
    ])
  })

  it('ignores a closed route', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0), arcTo(5, 0, 0)],
      holes: [holeAt(0, 0), holeAt(6, 0)],
    })

    expect(issues).toEqual([])
  })

  it('uses the opposite path endpoint for a reversed traversal', () => {
    const issues = getIssues({
      commands: [moveTo(0, 0), lineTo(10, 0)],
      holes: [holeAt(10, 0), holeAt(4, 0)],
    })

    expect(issues).toEqual([
      {
        type: 'route-endpoint-missing-stitch-hole',
        route: { stitchLineId, routeIndex: 0 },
        endpointPosition: point(0, 0),
        lastHoleDistanceToEndpoint: new BigNumber(4),
      },
    ])
  })
})

type GetIssuesOptions = {
  commands: PathCommand[]
  holes: StitchHoleSchema[]
  accuracy?: number
}

const getIssues = ({ commands, holes, accuracy = 0.01 }: GetIssuesOptions) => {
  const input = createInput(commands, holes)
  return getRouteEndpointMissingStitchHoleIssues({ ...input, config: { ...input.config, accuracy } })
}

const createInput = (commands: PathCommand[], holes: StitchHoleSchema[]): MagicFixIssueDetectorInput => {
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
  const route: ComputedStitchRouteSchema = { path: { commands }, holes }
  const stitchLine: ComputedStitchLineSchema = {
    stitchLineId,
    targetType: 'component',
    targetId: rootComponentId,
    componentId: rootComponentId,
    routes: [route],
  }

  return {
    project,
    subProject,
    computed: { id: subProject.id, root: subProject.root, components: {}, holes: [], stitchLines: [stitchLine] },
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
