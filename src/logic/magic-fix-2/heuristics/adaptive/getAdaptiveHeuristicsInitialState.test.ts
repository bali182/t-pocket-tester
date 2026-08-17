import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import { d, m } from '../../../../testData'
import { createMagicFixConfig } from '../../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../../getComputedProject'
import { getAdaptiveHeuristicsInitialState } from './getAdaptiveHeuristicsInitialState'

describe('getAdaptiveHeuristicsInitialState', () => {
  it('should create the initial round and use source field values as global and round best values', () => {
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

    const state = getAdaptiveHeuristicsInitialState({
      project,
      subProject,
      computed,
      config,
      iterations: 100,
      plan: undefined,
      issues: [],
    })

    const bestValues = [new BigNumber(100), true, new BigNumber(60), 'bottom-to-top']
    const bestScore = { issueCount: 0, totalDeviation: new BigNumber(0) }

    expect(state.bestValues).toEqual(bestValues)
    expect(state.bestScore).toEqual(bestScore)
    expect(state.lastValues).toBeUndefined()
    expect(state.currentRound).toMatchObject({
      fields: expect.any(Array),
      configurations: expect.any(Array),
      nextConfigurationIndex: 0,
      bestValues,
      bestScore,
      sequenceIndex: 0,
    })
  })

  it('should create mixed, unique numeric round configurations from band midpoints', () => {
    const root = d.rootPanel({ id: 'root', width: 100 })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      topStartOffset: 10,
    })
    const subProject = d.subProject({ id: 'sub-project', root, stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, { fixedWidthRange: { maxDecrease: 5, maxIncrease: 5 } })
      .set(stitchLine, { topStartOffsetRange: { maxDecrease: 5, maxIncrease: 5 } })
      .toMagicFix()
    config.effort = 'low'
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const state = getAdaptiveHeuristicsInitialState({
      project,
      subProject,
      computed,
      config,
      iterations: 100,
      plan: undefined,
      issues: [],
    })

    expect(state.currentRound.fields).toHaveLength(2)
    expect(state.currentRound.fields[0]).toMatchObject({ type: 'numeric', bands: expect.any(Array) })
    expect(state.currentRound.fields[1]).toMatchObject({ type: 'numeric', bands: expect.any(Array) })
    expect(
      state.currentRound.configurations.map((configuration) => configuration.values.map((value) => value.toString())),
    ).toEqual([
      ['104', '14'],
      ['102', '10'],
      ['96', '12'],
      ['100', '8'],
      ['98', '6'],
    ])
  })

  it('should limit an all-discrete round to its number of distinct configurations', () => {
    const root = d.rootPanel({ id: 'root' })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      topStitchDirection: 'left-to-right',
      leftStitchDirection: 'top-to-bottom',
    })
    const subProject = d.subProject({ id: 'sub-project', root, stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(stitchLine, { canFlipTopStitchDirection: true, canFlipLeftStitchDirection: true })
      .toMagicFix()
    config.effort = 'low'
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const state = getAdaptiveHeuristicsInitialState({
      project,
      subProject,
      computed,
      config,
      iterations: 100,
      plan: undefined,
      issues: [],
    })

    expect(state.currentRound.configurations).toHaveLength(4)
    expect(new Set(state.currentRound.configurations.map((configuration) => configuration.values.join(':'))).size).toBe(
      4,
    )
  })

  it('should create an empty round when no field is adjustable', () => {
    const root = d.rootPanel({ id: 'root' })
    const subProject = d.subProject({ id: 'sub-project', root })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject)).disableAll().toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const state = getAdaptiveHeuristicsInitialState({
      project,
      subProject,
      computed,
      config,
      iterations: 100,
      plan: undefined,
      issues: [],
    })

    expect(state.currentRound.fields).toEqual([])
    expect(state.currentRound.configurations).toEqual([])
  })
})
