import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import { d, m } from '../../../../testData'
import { createMagicFixConfig } from '../../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../../getComputedProject'
import { getAdaptiveHeuristicsInitialState } from './getAdaptiveHeuristicsInitialState'
import { getAdaptiveHeuristicsPlan } from './getAdaptiveHeuristicsPlan'

describe('getAdaptiveHeuristicsInitialState', () => {
  it('should use the source field values as the initial best values', () => {
    const root = d.rootPanel({ id: 'root', width: 100 })
    const panel = d.panel({ id: 'panel', autoWidth: true, width: 60 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      leftStitchDirection: 'bottom-to-top',
    })
    const subProject = d.subProject({ id: 'sub-project', root, components: [panel], stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, { fixedWidthRange: { maxDecrease: 5, maxIncrease: 5 } })
      .set(panel, { canConvertToFixedWidth: true, fixedWidthRange: { maxDecrease: 5, maxIncrease: 5 } })
      .set(stitchLine, { canFlipLeftStitchDirection: true })
      .toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)
    const plan = getAdaptiveHeuristicsPlan({ project, subProject, computed, config, iterations: 100 })

    const state = getAdaptiveHeuristicsInitialState({
      project,
      subProject,
      computed,
      config,
      iterations: 100,
      plan,
      issues: [],
    })

    expect(state).toEqual({
      bestValues: [new BigNumber(100), true, new BigNumber(60), 'bottom-to-top'],
      bestScore: { issueCount: 0, totalDeviation: new BigNumber(0) },
      lastValues: undefined,
    })
  })
})
