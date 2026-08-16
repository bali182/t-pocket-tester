import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import { defaultStitchingSettings } from '../../../defaultStates'
import { d } from '../../../testData'
import { createMagicFixConfig } from '../../../utils/createMagicFixConfig'
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
    const config = createMagicFixConfig(project, subProject)
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getRouteEndpointMissingStitchHoleIssues({ project, subProject, computed, config })).toEqual([])
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
    const config = { ...createMagicFixConfig(project, subProject), accuracy: 2 }
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getRouteEndpointMissingStitchHoleIssues({ project, subProject, computed, config })).toEqual([])
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
    const config = createMagicFixConfig(project, subProject)
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const issues = getRouteEndpointMissingStitchHoleIssues({ project, subProject, computed, config })
    expect(issues).toMatchObject([
      {
        type: 'route-endpoint-missing-stitch-hole',
        route: { stitchLineId: 'line', routeIndex: 0 },
        endpointPosition: { x: new BigNumber(12), y: new BigNumber(0) },
      },
    ])
    expect(issues[0]?.lastHoleDistanceToEndpoint.isGreaterThan(config.accuracy)).toBe(true)
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
    const config = createMagicFixConfig(project, subProject)
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getRouteEndpointMissingStitchHoleIssues({ project, subProject, computed, config })).toEqual([])
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
    const config = createMagicFixConfig(project, subProject)
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getRouteEndpointMissingStitchHoleIssues({ project, subProject, computed, config })).toMatchObject([
      { endpointPosition: { x: new BigNumber(0), y: new BigNumber(0) } },
    ])
  })
})
