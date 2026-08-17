import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import { d, m } from '../../../../testData'
import { createMagicFixConfig } from '../../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../../getComputedProject'
import { getAdaptiveMagicFixChangeRequests } from './getAdaptiveMagicFixChangeRequests'
import { getAdjustableFields } from './getAdjustableFields'
import type { AdaptiveMagicFixFieldValue } from './types'

describe('getAdaptiveMagicFixChangeRequests', () => {
  it('should convert source-derived adaptive fields to the corresponding change requests in field order', () => {
    const root = d.rootPanel({ id: 'root' })
    const panel = d.panel({ id: 'panel', autoWidth: true })
    const cluster = d.pocketCluster({ id: 'cluster' })
    const componentLine = d.componentBoundsStitchLine({
      id: 'component-line',
      targetType: 'component',
      targetId: root.id,
    })
    const clusterLine = d.pocketClusterStitchLine({
      id: 'cluster-line',
      targetType: 'component',
      targetId: cluster.id,
    })
    const subProject = d.subProject({
      id: 'sub-project',
      root,
      components: [panel, cluster],
      stitchLines: [componentLine, clusterLine],
    })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, {
        fixedWidthRange: { maxDecrease: 1, maxIncrease: 1 },
        layoutGapRange: { maxDecrease: 1, maxIncrease: 1 },
        borderRadiusRange: { maxDecrease: 1, maxIncrease: 1 },
        canConvertToIndividualRadii: true,
        topLeftRadiusRange: { maxDecrease: 1, maxIncrease: 1 },
      })
      .set(panel, { canConvertToFixedWidth: true, fixedWidthRange: { maxDecrease: 1, maxIncrease: 1 } })
      .set(cluster, { pocketStepRange: { maxDecrease: 1, maxIncrease: 1 } })
      .set(componentLine, {
        topStartOffsetRange: { maxDecrease: 1, maxIncrease: 1 },
        canFlipTopStitchDirection: true,
        canFlipLeftStitchDirection: true,
      })
      .set(clusterLine, {
        startOffsetRange: { maxDecrease: 1, maxIncrease: 1 },
        canFlipStitchDirection: true,
      })
      .toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)
    const fields = getAdjustableFields({ project, subProject, computed, config }, 1)
    const values: AdaptiveMagicFixFieldValue[] = fields.map((field, index) => {
      switch (field.type) {
        case 'numeric':
          return new BigNumber(index + 1)
        case 'boolean':
          return !field.initialValue
        case 'horizontal-direction':
        case 'vertical-direction':
        case 'pocket-cluster-direction':
          return field.alternativeValue
      }
    })

    const requests = getAdaptiveMagicFixChangeRequests(fields, values)

    expect(requests).toEqual([
      { type: 'set-component-dimension', componentId: root.id, dimensionField: 'width', value: 1 },
      { type: 'set-layout-gap', componentId: root.id, value: 2 },
      { type: 'set-component-corner-radius', componentId: root.id, radiusField: 'borderRadius', value: 3 },
      { type: 'set-component-individual-radii', componentId: root.id, value: true },
      { type: 'set-component-corner-radius', componentId: root.id, radiusField: 'topLeftRadius', value: 5 },
      { type: 'set-component-auto-dimension', componentId: panel.id, autoDimensionField: 'autoWidth', value: false },
      { type: 'set-component-dimension', componentId: panel.id, dimensionField: 'width', value: 7 },
      { type: 'set-pocket-step', componentId: cluster.id, value: 8 },
      {
        type: 'set-component-bounds-stitch-line-offset',
        stitchLineId: componentLine.id,
        offsetField: 'topStartOffset',
        value: 9,
      },
      {
        type: 'set-component-bounds-stitch-line-horizontal-direction',
        stitchLineId: componentLine.id,
        directionField: 'topStitchDirection',
        value: 'right-to-left',
      },
      {
        type: 'set-component-bounds-stitch-line-vertical-direction',
        stitchLineId: componentLine.id,
        directionField: 'leftStitchDirection',
        value: 'top-to-bottom',
      },
      {
        type: 'set-pocket-cluster-stitch-line-offset',
        stitchLineId: clusterLine.id,
        offsetField: 'startOffset',
        value: 12,
      },
      { type: 'set-pocket-cluster-stitch-line-direction', stitchLineId: clusterLine.id, value: 'end-to-start' },
    ])
  })

  it('should reject field and value arrays with different lengths', () => {
    const root = d.rootPanel({ id: 'root' })
    const subProject = d.subProject({ id: 'sub-project', root })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, { fixedWidthRange: { maxDecrease: 1, maxIncrease: 1 } })
      .toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)
    const fields = getAdjustableFields({ project, subProject, computed, config }, 1)

    expect(() => getAdaptiveMagicFixChangeRequests(fields, [])).toThrow('equal lengths')
  })
})
