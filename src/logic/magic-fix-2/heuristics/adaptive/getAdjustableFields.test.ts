import { describe, expect, it } from 'vitest'

import { d, m } from '../../../../testData'
import { createMagicFixConfig } from '../../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../../getComputedProject'
import { getAdjustableFields } from './getAdjustableFields'

describe('getAdjustableFields', () => {
  it('should calculate numeric ranges from the source value and exclude disabled ranges', () => {
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

    const fields = getAdjustableFields({ project, subProject, computed, config })

    expect(fields).toEqual([{ type: 'numeric', path: ['components', root.id, 'width'], minValue: 98, maxValue: 103 }])
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

    const fields = getAdjustableFields({ project, subProject, computed, config })

    expect(fields).toEqual([
      { type: 'boolean', path: ['components', panel.id, 'autoWidth'], initialValue: true },
      { type: 'numeric', path: ['components', panel.id, 'width'], minValue: 58, maxValue: 63 },
      { type: 'numeric', path: ['components', panel.id, 'height'], minValue: 39, maxValue: 41 },
      { type: 'numeric', path: ['components', panel.id, 'layoutGap'], minValue: 3, maxValue: 9 },
      { type: 'numeric', path: ['components', cluster.id, 'width'], minValue: 45, maxValue: 50 },
      { type: 'numeric', path: ['components', cluster.id, 'pocketStep'], minValue: 9, maxValue: 16 },
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

    const fields = getAdjustableFields({ project, subProject, computed, config })

    expect(fields).toEqual([
      { type: 'numeric', path: ['components', root.id, 'borderRadius'], minValue: 4, maxValue: 7 },
      { type: 'boolean', path: ['components', root.id, 'individualRadii'], initialValue: false },
      { type: 'numeric', path: ['components', root.id, 'topLeftRadius'], minValue: 0, maxValue: 1 },
      { type: 'numeric', path: ['components', root.id, 'topRightRadius'], minValue: 2, maxValue: 3 },
      { type: 'numeric', path: ['components', root.id, 'bottomRightRadius'], minValue: 1, maxValue: 6 },
      { type: 'numeric', path: ['components', root.id, 'bottomLeftRadius'], minValue: 0, maxValue: 9 },
      { type: 'numeric', path: ['components', cluster.id, 'topLeftRadius'], minValue: 5, maxValue: 7 },
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

    const fields = getAdjustableFields({ project, subProject, computed, config })

    expect(fields).toEqual([
      {
        type: 'numeric',
        path: ['stitchLines', componentBoundsLine.id, 'topStartOffset'],
        minValue: 7,
        maxValue: 12,
      },
      {
        type: 'horizontal-direction',
        path: ['stitchLines', componentBoundsLine.id, 'topStitchDirection'],
        initialValue: 'left-to-right',
        alternativeValue: 'right-to-left',
      },
      {
        type: 'vertical-direction',
        path: ['stitchLines', componentBoundsLine.id, 'leftStitchDirection'],
        initialValue: 'bottom-to-top',
        alternativeValue: 'top-to-bottom',
      },
      { type: 'numeric', path: ['stitchLines', clusterLine.id, 'startOffset'], minValue: 7, maxValue: 12 },
      {
        type: 'pocket-cluster-direction',
        path: ['stitchLines', clusterLine.id, 'stitchDirection'],
        initialValue: 'end-to-start',
        alternativeValue: 'start-to-end',
      },
    ])
  })
})
