import { describe, expect, it } from 'vitest'

import { defaultStitchingSettings } from '../../../defaultStates'
import { d } from '../../../testData'
import { createMagicFixConfig } from '../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../getComputedProject'
import { getEndpointMinimumEdgeDistanceIssues } from './getEndpointMinimumEdgeDistanceIssues'

describe('getEndpointMinimumEdgeDistanceIssues', () => {
  it('reports endpoint clearances below the configured minimum', () => {
    const root = d.rootPanel({ id: 'root', width: 12, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'root-line', targetType: 'component', targetId: root.id, top: true, right: false, bottom: false, left: false,
      topLeftCorner: false, topRightCorner: false, bottomRightCorner: false, bottomLeftCorner: false,
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject], stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 5 } })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 2
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const issues = getEndpointMinimumEdgeDistanceIssues({ project, subProject, config, computed })

    expect(issues).toHaveLength(2)
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'endpoint-minimum-edge-distance', route: { stitchLineId: stitchLine.id, routeIndex: 0 }, endpoint: 'start', boundary: expect.objectContaining({ owner: { componentId: root.id, element: 'component' } }) }),
      expect.objectContaining({ type: 'endpoint-minimum-edge-distance', route: { stitchLineId: stitchLine.id, routeIndex: 0 }, endpoint: 'end', boundary: expect.objectContaining({ owner: { componentId: root.id, element: 'component' } }) }),
    ]))
  })

  it('accepts endpoint clearances within the configured accuracy', () => {
    const root = d.rootPanel({ id: 'root', width: 12, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'root-line', targetType: 'component', targetId: root.id, top: true, right: false, bottom: false, left: false,
      topLeftCorner: false, topRightCorner: false, bottomRightCorner: false, bottomLeftCorner: false,
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject], stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 5 } })
    const config = createMagicFixConfig(project, subProject)
    config.accuracy = 0.1
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 1.05
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getEndpointMinimumEdgeDistanceIssues({ project, subProject, config, computed })).toEqual([])
  })

  it('does not judge the lateral stitch margin', () => {
    const root = d.rootPanel({ id: 'root', width: 100, height: 100, borderRadius: 5 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'root-line', targetType: 'component', targetId: root.id, top: true, right: false, bottom: false, left: false,
      topLeftCorner: false, topRightCorner: false, bottomRightCorner: false, bottomLeftCorner: false,
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject], stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 5 } })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 3
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getEndpointMinimumEdgeDistanceIssues({ project, subProject, config, computed })).toEqual([])
  })

  it('ignores a closed computed route', () => {
    const root = d.rootPanel({ id: 'root', width: 20, height: 20 })
    const stitchLine = d.componentBoundsStitchLine({ id: 'root-line', targetType: 'component', targetId: root.id })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject], stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 5 } })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 100
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getEndpointMinimumEdgeDistanceIssues({ project, subProject, config, computed })).toEqual([])
  })

  it('uses the computed hole order for a right-to-left route', () => {
    const root = d.rootPanel({ id: 'root', width: 12, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'root-line', targetType: 'component', targetId: root.id, top: true, right: false, bottom: false, left: false,
      topLeftCorner: false, topRightCorner: false, bottomRightCorner: false, bottomLeftCorner: false, topStitchDirection: 'right-to-left',
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject], stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 5 } })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 2
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const issues = getEndpointMinimumEdgeDistanceIssues({ project, subProject, config, computed })

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ route: { stitchLineId: stitchLine.id, routeIndex: 0 }, endpoint: 'start', boundary: expect.objectContaining({ owner: { componentId: root.id, element: 'component' } }) }),
    ]))
  })

  it('ignores a route that crosses its component boundary', () => {
    const root = d.rootPanel({ id: 'root', width: 12, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'root-line', targetType: 'component', targetId: root.id, top: true, right: false, bottom: false, left: false,
      topLeftCorner: false, topRightCorner: false, bottomRightCorner: false, bottomLeftCorner: false, topStartOffset: 2,
    })
    const subProject = d.subProject({ id: 'subproject', root, stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject], stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 5 } })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[root.id].preferredMinimumDistanceFromEdge = 100
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    expect(getEndpointMinimumEdgeDistanceIssues({ project, subProject, config, computed })).toEqual([])
  })

  it('uses the front-pocket boundary for a route around a hole in the front pocket', () => {
    const cluster = d.pocketCluster({ id: 'cluster', width: 100, height: 100, autoWidth: false, autoHeight: false })
    const root = d.rootPanel({ id: 'root', width: 100, height: 100, children: [cluster.id] })
    const hole = d.hole({ id: 'hole', componentId: cluster.id, width: 10, height: 10 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'hole-line', targetType: 'hole', targetId: hole.id, top: true, right: false, bottom: false, left: false,
      topLeftCorner: false, topRightCorner: false, bottomRightCorner: false, bottomLeftCorner: false,
    })
    const subProject = d.subProject({ id: 'subproject', root, components: [cluster], holes: [hole], stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject], stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 5 } })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[cluster.id].preferredMinimumDistanceFromEdge = 100
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const issues = getEndpointMinimumEdgeDistanceIssues({ project, subProject, config, computed })

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ boundary: expect.objectContaining({ owner: { componentId: cluster.id, element: 'front-pocket' } }) }),
    ]))
  })

  it('uses an individual T-pocket boundary for a pocket-cluster stitchline', () => {
    const cluster = d.pocketCluster({ id: 'cluster', width: 100, height: 100, autoWidth: false, autoHeight: false, pocketCount: 2 })
    const root = d.rootPanel({ id: 'root', width: 100, height: 100, children: [cluster.id] })
    const stitchLine = d.pocketClusterStitchLine({ id: 'pocket-line', targetType: 'component', targetId: cluster.id, startOffset: 0, endOffset: 0 })
    const subProject = d.subProject({ id: 'subproject', root, components: [cluster], stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject], stitchingSettings: { ...defaultStitchingSettings, stitchMargin: 1, stitchHoleDistance: 5 } })
    const config = createMagicFixConfig(project, subProject)
    config.componentConfigs[cluster.id].preferredMinimumDistanceFromEdge = 100
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const issues = getEndpointMinimumEdgeDistanceIssues({ project, subProject, config, computed })

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ route: { stitchLineId: stitchLine.id, routeIndex: 0 }, boundary: expect.objectContaining({ owner: { componentId: cluster.id, element: 't-pocket', tPocketIndex: 0 } }) }),
    ]))
  })
})
