import { describe, expect, it } from 'vitest'

import { defaultMagicFix3Settings, defaultStitchingSettings } from '../../../defaultStates'
import { d } from '../../../testData'
import { getComputedSubProject } from '../../getComputedProject'
import { getClosedRouteStitchHoleDistanceIssues } from './getClosedRouteStitchHoleDistanceIssues'

describe('getClosedRouteStitchHoleDistanceIssues', () => {
  it('does not report a rounded closed route with an expected closing hole distance', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 14.9046,
      height: 15,
      bottomLeftRadius: 5,
      bottomRightRadius: 5,
      topLeftRadius: 5,
      topRightRadius: 5,
    })
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
      getClosedRouteStitchHoleDistanceIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
  })

  it('does not report a rounded closing deviation within the configured accuracy', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 15,
      height: 15,
      bottomLeftRadius: 5,
      bottomRightRadius: 5,
      topLeftRadius: 5,
      topRightRadius: 5,
    })
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
    const magicFixSettings = { ...defaultMagicFix3Settings, accuracy: 1 }
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(
      getClosedRouteStitchHoleDistanceIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
  })

  it('reports a rounded closing deviation above the configured accuracy', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 15,
      height: 15,
      bottomLeftRadius: 5,
      bottomRightRadius: 5,
      topLeftRadius: 5,
      topRightRadius: 5,
    })
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

    const issues = getClosedRouteStitchHoleDistanceIssues({
      subProject,
      computed,
      magicFixSettings,
      stitchLineSettings: project.stitchingSettings,
      stitchLineId: stitchLine.id,
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]?.id).toEqual(expect.any(String))
    expect(issues[0]?.deviation.deviation.isGreaterThan(magicFixSettings.accuracy)).toBe(true)
  })

  it('ignores an open computed route', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 15,
      height: 15,
      bottomLeftRadius: 5,
      bottomRightRadius: 5,
      topLeftRadius: 5,
      topRightRadius: 5,
    })
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
      getClosedRouteStitchHoleDistanceIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
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
    const magicFixSettings = defaultMagicFix3Settings
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(
      getClosedRouteStitchHoleDistanceIssues({
        subProject,
        computed,
        magicFixSettings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: stitchLine.id,
      }),
    ).toEqual([])
  })

  it('ignores a closed-route issue on a stitchline other than the selected one', () => {
    const root = d.rootPanel({
      id: 'root',
      width: 15,
      height: 15,
      bottomLeftRadius: 5,
      bottomRightRadius: 5,
      topLeftRadius: 5,
      topRightRadius: 5,
    })
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
    })
    const subProject = d.subProject({ id: 'sub', root, stitchLines: [selectedStitchLine, invalidStitchLine] })
    const project = d.project({
      id: 'project',
      subProjects: [subProject],
      stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 0 },
    })
    const computed = getComputedSubProject(subProject, project.stitchingSettings)
    const invalidIssues = getClosedRouteStitchHoleDistanceIssues({
      subProject,
      computed,
      magicFixSettings: defaultMagicFix3Settings,
      stitchLineSettings: project.stitchingSettings,
      stitchLineId: invalidStitchLine.id,
    })

    expect(invalidIssues).not.toEqual([])
    expect(
      getClosedRouteStitchHoleDistanceIssues({
        subProject,
        computed,
        magicFixSettings: defaultMagicFix3Settings,
        stitchLineSettings: project.stitchingSettings,
        stitchLineId: selectedStitchLine.id,
      }),
    ).toEqual([])
  })
})
