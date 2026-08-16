import { describe, expect, it } from 'vitest'

import { defaultStitchingSettings } from '../../../defaultStates'
import { d } from '../../../testData'
import { createMagicFixConfig } from '../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../getComputedProject'
import { getClosedRouteStitchHoleDistanceIssues } from './getClosedRouteStitchHoleDistanceIssues'

describe('getClosedRouteStitchHoleDistanceIssues', () => {
  it('does not report a rounded closed route with an expected closing hole distance', () => {
    const root = d.rootPanel({ id: 'root', width: 14.9046, height: 15, borderRadius: 5 })
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

    expect(getClosedRouteStitchHoleDistanceIssues({ project, subProject, computed, config })).toEqual([])
  })

  it('does not report a rounded closing deviation within the configured accuracy', () => {
    const root = d.rootPanel({ id: 'root', width: 15, height: 15, borderRadius: 5 })
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
    const config = { ...createMagicFixConfig(project, subProject), accuracy: 1 }
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getClosedRouteStitchHoleDistanceIssues({ project, subProject, computed, config })).toEqual([])
  })

  it('reports a rounded closing deviation above the configured accuracy', () => {
    const root = d.rootPanel({ id: 'root', width: 15, height: 15, borderRadius: 5 })
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

    const issues = getClosedRouteStitchHoleDistanceIssues({ project, subProject, computed, config })
    expect(issues).toHaveLength(1)
    expect(issues[0]?.deviation.deviation.isGreaterThan(config.accuracy)).toBe(true)
  })

  it('ignores an open computed route', () => {
    const root = d.rootPanel({ id: 'root', width: 15, height: 15, borderRadius: 5 })
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

    expect(getClosedRouteStitchHoleDistanceIssues({ project, subProject, computed, config })).toEqual([])
  })

  it('ignores a closed computed route with sharp corners', () => {
    const root = d.rootPanel({ id: 'root', width: 15, height: 15 })
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

    expect(getClosedRouteStitchHoleDistanceIssues({ project, subProject, computed, config })).toEqual([])
  })
})
