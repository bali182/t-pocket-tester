import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import { d, m } from '../../../../../testData'
import { createMagicFixConfig } from '../../../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../../../getComputedProject'
import { getAdjustableFields } from '../getAdjustableFields'
import { getFieldValue } from './getFieldValue'

describe('getFieldValue', () => {
  it('should read values for every adjustable component and stitch line field type', () => {
    const root = d.rootPanel({ id: 'root', width: 100 })
    const panel = d.panel({ id: 'panel', autoWidth: true, width: 60 })
    const pocketCluster = d.pocketCluster({ id: 'pocket-cluster', pocketStep: 12 })
    const componentBoundsStitchLine = d.componentBoundsStitchLine({
      id: 'component-bounds-stitch-line',
      targetType: 'component',
      targetId: root.id,
      topStartOffset: 8,
      topStitchDirection: 'right-to-left',
      leftStitchDirection: 'bottom-to-top',
    })
    const pocketClusterStitchLine = d.pocketClusterStitchLine({
      id: 'pocket-cluster-stitch-line',
      targetType: 'component',
      targetId: pocketCluster.id,
      startOffset: 6,
      stitchDirection: 'end-to-start',
    })
    const subProject = d.subProject({
      id: 'sub-project',
      root,
      components: [panel, pocketCluster],
      stitchLines: [componentBoundsStitchLine, pocketClusterStitchLine],
    })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, { fixedWidthRange: { maxDecrease: 1, maxIncrease: 1 } })
      .set(panel, { canConvertToFixedWidth: true, fixedWidthRange: { maxDecrease: 1, maxIncrease: 1 } })
      .set(pocketCluster, { pocketStepRange: { maxDecrease: 1, maxIncrease: 1 } })
      .set(componentBoundsStitchLine, {
        topStartOffsetRange: { maxDecrease: 1, maxIncrease: 1 },
        canFlipTopStitchDirection: true,
        canFlipLeftStitchDirection: true,
      })
      .set(pocketClusterStitchLine, {
        startOffsetRange: { maxDecrease: 1, maxIncrease: 1 },
        canFlipStitchDirection: true,
      })
      .toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)
    const fields = getAdjustableFields({ project, subProject, computed, config }, 1)

    expect(fields.map((field) => getFieldValue(subProject, field))).toEqual([
      new BigNumber(100),
      true,
      new BigNumber(60),
      new BigNumber(12),
      new BigNumber(8),
      'right-to-left',
      'bottom-to-top',
      new BigNumber(6),
      'end-to-start',
    ])
  })
})
