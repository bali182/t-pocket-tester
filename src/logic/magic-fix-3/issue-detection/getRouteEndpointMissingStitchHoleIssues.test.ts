import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import { defaultMagicFix3Settings, defaultStitchingSettings } from '../../../defaultStates'
import { d } from '../../../testData'
import { getComputedSubProject } from '../../getComputedProject'
import { getRouteEndpointMissingStitchHoleIssues } from './getRouteEndpointMissingStitchHoleIssues'

describe('getRouteEndpointMissingStitchHoleIssues', () => {
  it('does not report a hole at the computed route endpoint', () => {
    const root = d.rootPanel({ id: 'root', width: 10, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      stitchHoleDistance: 5,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
    })
    const subProject = d.subProject({ id: 'sub', root, stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 0 },
    })
    const magicFixSettings = defaultMagicFix3Settings
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(
      getRouteEndpointMissingStitchHoleIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
  })

  it('does not report a computed endpoint gap within the configured accuracy', () => {
    const root = d.rootPanel({ id: 'root', width: 12, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      stitchHoleDistance: 5,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
    })
    const subProject = d.subProject({ id: 'sub', root, stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 0 },
    })
    const magicFixSettings = { ...defaultMagicFix3Settings, accuracy: 2 }
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(
      getRouteEndpointMissingStitchHoleIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
  })

  it('reports a computed endpoint gap above the configured accuracy', () => {
    const root = d.rootPanel({ id: 'root', width: 12, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      stitchHoleDistance: 5,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
    })
    const subProject = d.subProject({ id: 'sub', root, stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 0 },
    })
    const magicFixSettings = defaultMagicFix3Settings
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const issues = getRouteEndpointMissingStitchHoleIssues({
      subProject,
      computed,
      magicFixSettings,
      stitchLineSettings: project.stitchingSettings,
      stitchLineId: stitchLine.id,
    })
    expect(issues).toMatchObject([
      {
        type: 'route-endpoint-missing-stitch-hole',
        route: { stitchLineId: 'line', routeIndex: 0 },
        endpointPosition: { x: new BigNumber(12), y: new BigNumber(0) },
      },
    ])
    expect(issues[0]?.id).toEqual(expect.any(String))
    expect(issues[0]?.lastHoleDistanceToEndpoint.isGreaterThan(magicFixSettings.accuracy)).toBe(true)
  })

  it('ignores a closed computed route', () => {
    const root = d.rootPanel({ id: 'root', width: 12, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      stitchHoleDistance: 5,
    })
    const subProject = d.subProject({ id: 'sub', root, stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 0 },
    })
    const magicFixSettings = defaultMagicFix3Settings
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(
      getRouteEndpointMissingStitchHoleIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
  })

  it('uses the logical endpoint for reversed computed traversal', () => {
    const root = d.rootPanel({ id: 'root', width: 12, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      stitchHoleDistance: 5,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
      topStitchDirection: 'right-to-left',
    })
    const subProject = d.subProject({ id: 'sub', root, stitchLines: [stitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 0 },
    })
    const magicFixSettings = defaultMagicFix3Settings
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(
      getRouteEndpointMissingStitchHoleIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toMatchObject([{ endpointPosition: { x: new BigNumber(0), y: new BigNumber(0) } }])
  })

  it('ignores an endpoint gap on a stitchline other than the selected one', () => {
    const root = d.rootPanel({ id: 'root', width: 10, height: 10 })
    const selectedStitchLine = d.componentBoundsStitchLine({
      id: 'selected',
      targetType: 'component',
      targetId: root.id,
      stitchHoleDistance: 5,
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
      stitchHoleDistance: 5,
      right: false,
      bottom: false,
      left: false,
      topLeftCorner: false,
      topRightCorner: false,
      bottomRightCorner: false,
      bottomLeftCorner: false,
      topStartOffset: 1,
    })
    const subProject = d.subProject({ id: 'sub', root, stitchLines: [selectedStitchLine, invalidStitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 0 },
    })
    const computed = getComputedSubProject(subProject, project.stitchingSettings)
    const invalidIssues = getRouteEndpointMissingStitchHoleIssues({
      subProject,
      computed,
      magicFixSettings: defaultMagicFix3Settings,
      stitchLineSettings: project.stitchingSettings,
      stitchLineId: invalidStitchLine.id,
    })

    expect(invalidIssues).not.toEqual([])
    expect(
      getRouteEndpointMissingStitchHoleIssues({
        subProject,
        computed,
        magicFixSettings: defaultMagicFix3Settings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: selectedStitchLine.id,
      }),
    ).toEqual([])
  })
})
