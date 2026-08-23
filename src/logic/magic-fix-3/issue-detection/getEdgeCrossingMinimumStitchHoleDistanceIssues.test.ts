import { describe, expect, it } from 'vitest'

import { defaultMagicFix3Settings, defaultStitchingSettings } from '../../../defaultStates'
import { d } from '../../../testData'
import { getSubComputedSubProject } from '../../getSubComputedProject'
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
    const magicFixSettings = { ...defaultMagicFix3Settings, minimumEdgeCrossingMultiplier: 0.5 }
    const computed = getSubComputedSubProject(subProject, project.stitchingSettings)

    const issues = getEdgeCrossingMinimumStitchHoleDistanceIssues({
      subProject,
      computed,
      magicFixSettings,
      stitchLineSettings: project.stitchingSettings,
      stitchLineId: stitchLine.id,
    })

    expect(issues).toHaveLength(1)
    expect(issues[0]?.id).toEqual(expect.any(String))
    expect(issues[0]).toMatchObject({
      type: 'edge-crossing-minimum-stitch-hole-distance',
      route: { stitchLineId: stitchLine.id, routeIndex: 0 },
      boundary: { owner: { componentId: root.id, element: 'component' } },
    })
    expect(issues[0]?.beforeCrossing.deviation.deviation.isGreaterThan(magicFixSettings.accuracy)).toBe(true)
    expect(issues[0]?.afterCrossing.deviation.deviation.isZero()).toBe(true)
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
    const magicFixSettings = { ...defaultMagicFix3Settings, minimumEdgeCrossingMultiplier: 0.5 }
    const computed = getSubComputedSubProject(subProject, project.stitchingSettings)

    expect(
      getEdgeCrossingMinimumStitchHoleDistanceIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
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
    const magicFixSettings = { ...defaultMagicFix3Settings, accuracy: 0.1, minimumEdgeCrossingMultiplier: 0.275 }
    const computed = getSubComputedSubProject(subProject, project.stitchingSettings)

    expect(
      getEdgeCrossingMinimumStitchHoleDistanceIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
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
      startOffset: 20.5,
    })
    const subProject = d.subProject({ id: 'subproject', root, components: [cluster], stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 2 },
    })
    const magicFixSettings = { ...defaultMagicFix3Settings, minimumEdgeCrossingMultiplier: 0.5 }
    const computed = getSubComputedSubProject(subProject, project.stitchingSettings)

    const issues = getEdgeCrossingMinimumStitchHoleDistanceIssues({
      subProject,
      computed,
      magicFixSettings,
      stitchLineSettings: project.stitchingSettings,
      stitchLineId: stitchLine.id,
    })

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
    const magicFixSettings = defaultMagicFix3Settings
    const computed = getSubComputedSubProject(subProject, project.stitchingSettings)

    expect(
      getEdgeCrossingMinimumStitchHoleDistanceIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
  })

  it('ignores a crossing issue on a stitchline other than the selected one', () => {
    const root = d.rootPanel({ id: 'root', width: 20, height: 10 })
    const selectedStitchLine = d.componentBoundsStitchLine({
      id: 'selected',
      targetType: 'component',
      targetId: root.id,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
    })
    const invalidStitchLine = d.componentBoundsStitchLine({
      id: 'invalid',
      targetType: 'component',
      targetId: root.id,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
      topStartOffset: 3.5,
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [selectedStitchLine, invalidStitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 2 },
    })
    const computed = getSubComputedSubProject(subProject, project.stitchingSettings)
    const invalidIssues = getEdgeCrossingMinimumStitchHoleDistanceIssues({
      subProject,
      computed,
      magicFixSettings: defaultMagicFix3Settings,
      stitchLineSettings: project.stitchingSettings,
      stitchLineId: invalidStitchLine.id,
    })

    expect(invalidIssues).not.toEqual([])
    expect(
      getEdgeCrossingMinimumStitchHoleDistanceIssues({
        subProject,
        computed,
        magicFixSettings: defaultMagicFix3Settings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: selectedStitchLine.id,
      }),
    ).toEqual([])
  })
})
