import { describe, expect, it } from 'vitest'

import { defaultStitchingSettings } from '../../../defaultStates'
import { d } from '../../../testData'
import { createMagicFixConfig } from '../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../getComputedProject'
import { getEdgeCrossingMinimumStitchHoleDistanceIssues } from './getEdgeCrossingMinimumStitchHoleDistanceIssues'

describe('getEdgeCrossingMinimumStitchHoleDistanceIssues', () => {
  it('reports a crossing when only the preceding hole is too close', () => {
    const root = d.rootPanel({ id: 'root', width: 20, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      top: true,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
      topStartOffset: 3.5,
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 2 },
    })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 1
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const issues = getEdgeCrossingMinimumStitchHoleDistanceIssues({ project, subProject, config, computed })

    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      type: 'edge-crossing-minimum-stitch-hole-distance',
      route: { stitchLineId: stitchLine.id, routeIndex: 0 },
      boundary: { owner: { componentId: root.id, element: 'component' } },
    })
    expect(issues[0]?.beforeCrossing.deviation.deviation.isGreaterThan(config.accuracy)).toBe(true)
    expect(issues[0]?.afterCrossing.deviation.deviation.isZero()).toBe(true)
  })

  it('reports both crossing holes when both are too close', () => {
    const root = d.rootPanel({ id: 'root', width: 20, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      top: true,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
      topStartOffset: 2.5,
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 1 },
    })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 1
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const issues = getEdgeCrossingMinimumStitchHoleDistanceIssues({ project, subProject, config, computed })

    expect(issues).toHaveLength(1)
    expect(issues[0]?.beforeCrossing.deviation.deviation.isGreaterThan(config.accuracy)).toBe(true)
    expect(issues[0]?.afterCrossing.deviation.deviation.isGreaterThan(config.accuracy)).toBe(true)
  })

  it('accepts a crossing when both adjacent holes meet the minimum', () => {
    const root = d.rootPanel({ id: 'root', width: 20, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      top: true,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
      topStartOffset: 2.5,
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 1 },
    })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 0.5
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getEdgeCrossingMinimumStitchHoleDistanceIssues({ project, subProject, config, computed })).toEqual([])
  })

  it('accepts a crossing shortfall within the configured accuracy', () => {
    const root = d.rootPanel({ id: 'root', width: 20, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      top: true,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
      topStartOffset: 3.5,
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 2 },
    })
    const config = createMagicFixConfig(project, subProject)
    config.accuracy = 0.1
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 0.55
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getEdgeCrossingMinimumStitchHoleDistanceIssues({ project, subProject, config, computed })).toEqual([])
  })

  it('uses the T-pocket boundary for a pocket-cluster crossing', () => {
    const cluster = d.pocketCluster({
      id: 'cluster',
      width: 100,
      height: 100,
      autoWidth: false,
      autoHeight: false,
      pocketCount: 2,
      pocketStep: 60,
    })
    const root = d.rootPanel({ id: 'root', width: 100, height: 100, children: [cluster.id] })
    const stitchLine = d.pocketClusterStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: cluster.id,
      startOffset: 21,
    })
    const subProject = d.subProject({ id: 'subproject', root, components: [cluster], stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 2 },
    })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[cluster.id].preferredMinimumDistanceFromEdge = 2
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const issues = getEdgeCrossingMinimumStitchHoleDistanceIssues({ project, subProject, config, computed })

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          route: { stitchLineId: stitchLine.id, routeIndex: 0 },
          boundary: expect.objectContaining({
            owner: { componentId: cluster.id, element: 't-pocket', tPocketIndex: 0 },
          }),
        }),
      ]),
    )
  })

  it('ignores a stitchline that targets a hole', () => {
    const root = d.rootPanel({ id: 'root', width: 20, height: 10 })
    const hole = d.hole({
      id: 'hole',
      componentId: root.id,
      width: 4,
      height: 4,
      xAnchor: 'start',
      xOffset: 0,
      yAnchor: 'start',
      yOffset: 2,
    })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'hole',
      targetId: hole.id,
      top: true,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
    })
    const subProject = d.subProject({ id: 'subproject', root, holes: [hole], stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 2 },
    })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 100
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getEdgeCrossingMinimumStitchHoleDistanceIssues({ project, subProject, config, computed })).toEqual([])
  })
})
