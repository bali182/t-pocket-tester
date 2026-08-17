import { describe, expect, it } from 'vitest'

import { d, m } from '../../../../testData'
import { createMagicFixConfig } from '../../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../../getComputedProject'
import { getAdjustablePaths } from './getAdjustablePaths'

describe('getAdjustablePaths', () => {
  it('should include active numeric ranges and exclude disabled ranges', () => {
    const root = d.rootPanel({ id: 'root', width: 100, height: 80 })
    const subProject = d.subProject({ id: 'sub-project', root })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, {
        fixedWidthRange: { maxDecrease: 2, maxIncrease: 3 },
      })
      .toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const paths = getAdjustablePaths({ project, subProject, computed, config })

    expect(paths).toEqual([['root-panel', root.id, 'width']])
  })

  it('should collect adjustable component dimensions, layout gaps, and pocket steps', () => {
    const root = d.rootPanel({ id: 'root' })
    const panel = d.panel({ id: 'panel', autoWidth: true, autoHeight: false, width: 60, height: 40, layoutGap: 7 })
    const cluster = d.pocketCluster({
      id: 'cluster',
      autoWidth: false,
      autoHeight: true,
      width: 50,
      height: 30,
      pocketStep: 12,
    })
    const subProject = d.subProject({ id: 'sub-project', root, components: [panel, cluster] })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(panel, {
        canConvertToFixedWidth: true,
        fixedWidthRange: { maxDecrease: 2, maxIncrease: 3 },
        fixedHeightRange: { maxDecrease: 1, maxIncrease: 1 },
        layoutGapRange: { maxDecrease: 4, maxIncrease: 2 },
      })
      .set(cluster, {
        fixedWidthRange: { maxDecrease: 5, maxIncrease: 0 },
        pocketStepRange: { maxDecrease: 3, maxIncrease: 4 },
      })
      .toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const paths = getAdjustablePaths({ project, subProject, computed, config })

    expect(paths).toEqual([
      ['panel', panel.id, 'autoWidth'],
      ['panel', panel.id, 'width'],
      ['panel', panel.id, 'height'],
      ['panel', panel.id, 'layoutGap'],
      ['pocket-cluster', cluster.id, 'width'],
      ['pocket-cluster', cluster.id, 'pocketStep'],
    ])
  })

  it('should collect the permitted common-to-individual radius conversion and active individual radii', () => {
    const root = d.rootPanel({
      id: 'root',
      borderRadius: 5,
      topLeftRadius: 1,
      topRightRadius: 2,
      bottomRightRadius: 3,
      bottomLeftRadius: 4,
    })
    const cluster = d.pocketCluster({
      id: 'cluster',
      individualRadii: true,
      topLeftRadius: 6,
      topRightRadius: 7,
      bottomRightRadius: 8,
      bottomLeftRadius: 9,
    })
    const subProject = d.subProject({ id: 'sub-project', root, components: [cluster] })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, {
        canConvertToIndividualRadii: true,
        borderRadiusRange: { maxDecrease: 1, maxIncrease: 2 },
        topLeftRadiusRange: { maxDecrease: 1, maxIncrease: 0 },
        topRightRadiusRange: { maxDecrease: 0, maxIncrease: 1 },
        bottomRightRadiusRange: { maxDecrease: 2, maxIncrease: 3 },
        bottomLeftRadiusRange: { maxDecrease: 4, maxIncrease: 5 },
      })
      .set(cluster, { topLeftRadiusRange: { maxDecrease: 1, maxIncrease: 1 } })
      .toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const paths = getAdjustablePaths({ project, subProject, computed, config })

    expect(paths).toEqual([
      ['root-panel', root.id, 'borderRadius'],
      ['root-panel', root.id, 'individualRadii'],
      ['root-panel', root.id, 'topLeftRadius'],
      ['root-panel', root.id, 'topRightRadius'],
      ['root-panel', root.id, 'bottomRightRadius'],
      ['root-panel', root.id, 'bottomLeftRadius'],
      ['pocket-cluster', cluster.id, 'topLeftRadius'],
    ])
  })

  it('should collect enabled stitch line offsets and direction alternatives', () => {
    const root = d.rootPanel({ id: 'root' })
    const componentBoundsLine = d.componentBoundsStitchLine({
      id: 'component-bounds',
      targetType: 'component',
      targetId: root.id,
      topStartOffset: 10,
      leftStitchDirection: 'bottom-to-top',
    })
    const cluster = d.pocketCluster({ id: 'cluster' })
    const clusterLine = d.pocketClusterStitchLine({
      id: 'cluster-line',
      targetType: 'component',
      targetId: cluster.id,
      startOffset: 8,
      stitchDirection: 'end-to-start',
    })
    const subProject = d.subProject({
      id: 'sub-project',
      root,
      components: [cluster],
      stitchLines: [componentBoundsLine, clusterLine],
    })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(componentBoundsLine, {
        topStartOffsetRange: { maxDecrease: 3, maxIncrease: 2 },
        canFlipTopStitchDirection: true,
        canFlipLeftStitchDirection: true,
      })
      .set(clusterLine, {
        startOffsetRange: { maxDecrease: 1, maxIncrease: 4 },
        canFlipStitchDirection: true,
      })
      .toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const paths = getAdjustablePaths({ project, subProject, computed, config })

    expect(paths).toEqual([
      ['component-bounds-stitch-line', componentBoundsLine.id, 'topStartOffset'],
      ['component-bounds-stitch-line', componentBoundsLine.id, 'topStitchDirection'],
      ['component-bounds-stitch-line', componentBoundsLine.id, 'leftStitchDirection'],
      ['pocket-cluster-stitch-line', clusterLine.id, 'startOffset'],
      ['pocket-cluster-stitch-line', clusterLine.id, 'stitchDirection'],
    ])
  })
})
