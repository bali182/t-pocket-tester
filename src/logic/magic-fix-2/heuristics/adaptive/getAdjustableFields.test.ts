import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import { d, m } from '../../../../testData'
import { createMagicFixConfig } from '../../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../../getComputedProject'
import { getAdjustableFields } from './getAdjustableFields'

describe('getAdjustableFields', () => {
  it('should calculate numeric ranges and split them into equal bands', () => {
    const root = d.rootPanel({ id: 'root', width: 100, height: 80 })
    const subProject = d.subProject({ id: 'sub-project', root })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, { fixedWidthRange: { maxDecrease: 2, maxIncrease: 4 } })
      .toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const fields = getAdjustableFields({ project, subProject, computed, config }, 3)

    expect(fields).toEqual([
      {
        type: 'numeric',
        path: ['root-panel', root.id, 'width'],
        minValue: new BigNumber(98),
        maxValue: new BigNumber(104),
        bands: [
          { minValue: new BigNumber(98), maxValue: new BigNumber(100) },
          { minValue: new BigNumber(100), maxValue: new BigNumber(102) },
          { minValue: new BigNumber(102), maxValue: new BigNumber(104) },
        ],
      },
    ])
  })

  it('should create fields for adjustable component dimensions, layout gaps, and pocket steps', () => {
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

    const fields = getAdjustableFields({ project, subProject, computed, config }, 1)

    expect(fields).toEqual([
      { type: 'boolean', path: ['panel', panel.id, 'autoWidth'], initialValue: true },
      {
        type: 'numeric',
        path: ['panel', panel.id, 'width'],
        minValue: new BigNumber(58),
        maxValue: new BigNumber(63),
        bands: [{ minValue: new BigNumber(58), maxValue: new BigNumber(63) }],
      },
      {
        type: 'numeric',
        path: ['panel', panel.id, 'height'],
        minValue: new BigNumber(39),
        maxValue: new BigNumber(41),
        bands: [{ minValue: new BigNumber(39), maxValue: new BigNumber(41) }],
      },
      {
        type: 'numeric',
        path: ['panel', panel.id, 'layoutGap'],
        minValue: new BigNumber(3),
        maxValue: new BigNumber(9),
        bands: [{ minValue: new BigNumber(3), maxValue: new BigNumber(9) }],
      },
      {
        type: 'numeric',
        path: ['pocket-cluster', cluster.id, 'width'],
        minValue: new BigNumber(45),
        maxValue: new BigNumber(50),
        bands: [{ minValue: new BigNumber(45), maxValue: new BigNumber(50) }],
      },
      {
        type: 'numeric',
        path: ['pocket-cluster', cluster.id, 'pocketStep'],
        minValue: new BigNumber(9),
        maxValue: new BigNumber(16),
        bands: [{ minValue: new BigNumber(9), maxValue: new BigNumber(16) }],
      },
    ])
  })

  it('should create fields for the permitted common-to-individual radius conversion and active individual radii', () => {
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

    const fields = getAdjustableFields({ project, subProject, computed, config }, 1)

    expect(fields).toEqual([
      {
        type: 'numeric',
        path: ['root-panel', root.id, 'borderRadius'],
        minValue: new BigNumber(4),
        maxValue: new BigNumber(7),
        bands: [{ minValue: new BigNumber(4), maxValue: new BigNumber(7) }],
      },
      { type: 'boolean', path: ['root-panel', root.id, 'individualRadii'], initialValue: false },
      {
        type: 'numeric',
        path: ['root-panel', root.id, 'topLeftRadius'],
        minValue: new BigNumber(0),
        maxValue: new BigNumber(1),
        bands: [{ minValue: new BigNumber(0), maxValue: new BigNumber(1) }],
      },
      {
        type: 'numeric',
        path: ['root-panel', root.id, 'topRightRadius'],
        minValue: new BigNumber(2),
        maxValue: new BigNumber(3),
        bands: [{ minValue: new BigNumber(2), maxValue: new BigNumber(3) }],
      },
      {
        type: 'numeric',
        path: ['root-panel', root.id, 'bottomRightRadius'],
        minValue: new BigNumber(1),
        maxValue: new BigNumber(6),
        bands: [{ minValue: new BigNumber(1), maxValue: new BigNumber(6) }],
      },
      {
        type: 'numeric',
        path: ['root-panel', root.id, 'bottomLeftRadius'],
        minValue: new BigNumber(0),
        maxValue: new BigNumber(9),
        bands: [{ minValue: new BigNumber(0), maxValue: new BigNumber(9) }],
      },
      {
        type: 'numeric',
        path: ['pocket-cluster', cluster.id, 'topLeftRadius'],
        minValue: new BigNumber(5),
        maxValue: new BigNumber(7),
        bands: [{ minValue: new BigNumber(5), maxValue: new BigNumber(7) }],
      },
    ])
  })

  it('should create fields for enabled stitch line offsets and direction alternatives', () => {
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

    const fields = getAdjustableFields({ project, subProject, computed, config }, 1)

    expect(fields).toEqual([
      {
        type: 'numeric',
        path: ['component-bounds-stitch-line', componentBoundsLine.id, 'topStartOffset'],
        minValue: new BigNumber(7),
        maxValue: new BigNumber(12),
        bands: [{ minValue: new BigNumber(7), maxValue: new BigNumber(12) }],
      },
      {
        type: 'horizontal-direction',
        path: ['component-bounds-stitch-line', componentBoundsLine.id, 'topStitchDirection'],
        initialValue: 'left-to-right',
        alternativeValue: 'right-to-left',
      },
      {
        type: 'vertical-direction',
        path: ['component-bounds-stitch-line', componentBoundsLine.id, 'leftStitchDirection'],
        initialValue: 'bottom-to-top',
        alternativeValue: 'top-to-bottom',
      },
      {
        type: 'numeric',
        path: ['pocket-cluster-stitch-line', clusterLine.id, 'startOffset'],
        minValue: new BigNumber(7),
        maxValue: new BigNumber(12),
        bands: [{ minValue: new BigNumber(7), maxValue: new BigNumber(12) }],
      },
      {
        type: 'pocket-cluster-direction',
        path: ['pocket-cluster-stitch-line', clusterLine.id, 'stitchDirection'],
        initialValue: 'end-to-start',
        alternativeValue: 'start-to-end',
      },
    ])
  })
})
