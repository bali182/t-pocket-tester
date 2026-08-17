import BigNumber from 'bignumber.js'
import { describe, expect, it } from 'vitest'

import type { MagicFixIssueSchema } from '../../../../schemas/magicFixIssues'
import { d, m } from '../../../../testData'
import { createMagicFixConfig } from '../../../../utils/createMagicFixConfig'
import { isDefined } from '../../../../utils/isDefined'
import { getComputedSubProject } from '../../../getComputedProject'
import { getAdaptiveHeuristicsInitialState } from './getAdaptiveHeuristicsInitialState'
import { getAdaptiveHeuristicsNext } from './getAdaptiveHeuristicsNext'

describe('getAdaptiveHeuristicsNext', () => {
  it('should emit round configurations in order and retain the emitted values for the next evaluation', () => {
    const root = d.rootPanel({ id: 'root', width: 100 })
    const subProject = d.subProject({ id: 'sub-project', root })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, { fixedWidthRange: { maxDecrease: 5, maxIncrease: 5 } })
      .toMagicFix()
    config.effort = 'low'
    const computed = getComputedSubProject(subProject, project.stitchingSettings)
    const issues: MagicFixIssueSchema[] = [
      {
        type: 'route-endpoint-missing-stitch-hole',
        route: { stitchLineId: 'line', routeIndex: 0 },
        endpointPosition: { x: new BigNumber(0), y: new BigNumber(0) },
        lastHoleDistanceToEndpoint: new BigNumber(1),
      },
    ]
    const state = getAdaptiveHeuristicsInitialState({
      project,
      subProject,
      computed,
      config,
      iterations: 6,
      plan: undefined,
      issues,
    })

    const result = getAdaptiveHeuristicsNext({
      project,
      originalSubProject: subProject,
      subProject,
      computed,
      config,
      iterations: 6,
      iteration: 0,
      plan: undefined,
      issues,
      state,
    })

    expect(result.requests).not.toEqual([])
    expect(result.state.lastValues).toEqual(state.currentRound.configurations[0]?.values)
    expect(result.state.currentRound.nextConfigurationIndex).toBe(1)
    expect(result.state.currentRound.sequenceIndex).toBe(0)

    const secondResult = getAdaptiveHeuristicsNext({
      project,
      originalSubProject: subProject,
      subProject,
      computed,
      config,
      iterations: 6,
      iteration: 1,
      plan: undefined,
      issues,
      state: result.state,
    })

    expect(secondResult.state.lastValues).toEqual(state.currentRound.configurations[1]?.values)
    expect(secondResult.state.currentRound.nextConfigurationIndex).toBe(2)
  })

  it('should retain the best evaluated configuration and narrow numeric fields for a better completed round', () => {
    const root = d.rootPanel({ id: 'root', width: 100 })
    const subProject = d.subProject({ id: 'sub-project', root })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, { fixedWidthRange: { maxDecrease: 5, maxIncrease: 5 } })
      .toMagicFix()
    config.effort = 'low'
    const computed = getComputedSubProject(subProject, project.stitchingSettings)
    const issues: MagicFixIssueSchema[] = [
      {
        type: 'route-endpoint-missing-stitch-hole',
        route: { stitchLineId: 'line', routeIndex: 0 },
        endpointPosition: { x: new BigNumber(0), y: new BigNumber(0) },
        lastHoleDistanceToEndpoint: new BigNumber(1),
      },
    ]
    const initialState = getAdaptiveHeuristicsInitialState({
      project,
      subProject,
      computed,
      config,
      iterations: 7,
      plan: undefined,
      issues,
    })
    let state = initialState

    for (let iteration = 0; iteration < 5; iteration += 1) {
      state = getAdaptiveHeuristicsNext({
        project,
        originalSubProject: subProject,
        subProject,
        computed,
        config,
        iterations: 7,
        iteration,
        plan: undefined,
        issues,
        state,
      }).state
    }
    const result = getAdaptiveHeuristicsNext({
      project,
      originalSubProject: subProject,
      subProject,
      computed,
      config,
      iterations: 7,
      iteration: 5,
      plan: undefined,
      issues: [],
      state,
    })
    const previousField = initialState.currentRound.fields[0]
    const nextField = result.state.currentRound.fields[0]
    const bestValue = state.lastValues?.[0]

    expect(result.state.bestScore).toEqual({ issueCount: 0, totalDeviation: new BigNumber(0) })
    expect(result.state.currentRound.sequenceIndex).toBe(1)
    expect(result.state.currentRound.nextConfigurationIndex).toBe(1)
    expect(nextField).toMatchObject({ type: 'numeric' })
    expect(previousField).toMatchObject({ type: 'numeric' })
    if (
      !isDefined(nextField) ||
      !isDefined(previousField) ||
      nextField.type !== 'numeric' ||
      previousField.type !== 'numeric' ||
      !BigNumber.isBigNumber(bestValue)
    ) {
      throw new Error('Expected numeric adaptive fields!')
    }
    const bestBand = previousField.bands.find(
      (band) => bestValue.isGreaterThanOrEqualTo(band.minValue) && bestValue.isLessThanOrEqualTo(band.maxValue),
    )
    if (!isDefined(bestBand)) {
      throw new Error('Expected best value to belong to a numeric band!')
    }
    expect(nextField.minValue).toEqual(bestBand.minValue)
    expect(nextField.maxValue).toEqual(bestBand.maxValue)
    expect(nextField.bands).toHaveLength(previousField.bands.length)
  })

  it('should preserve fields for a completed round that does not improve the global best', () => {
    const root = d.rootPanel({ id: 'root', width: 100 })
    const subProject = d.subProject({ id: 'sub-project', root })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(root, { fixedWidthRange: { maxDecrease: 5, maxIncrease: 5 } })
      .toMagicFix()
    config.effort = 'low'
    const computed = getComputedSubProject(subProject, project.stitchingSettings)
    const issues: MagicFixIssueSchema[] = [
      {
        type: 'route-endpoint-missing-stitch-hole',
        route: { stitchLineId: 'line', routeIndex: 0 },
        endpointPosition: { x: new BigNumber(0), y: new BigNumber(0) },
        lastHoleDistanceToEndpoint: new BigNumber(1),
      },
    ]
    const initialState = getAdaptiveHeuristicsInitialState({
      project,
      subProject,
      computed,
      config,
      iterations: 7,
      plan: undefined,
      issues,
    })
    let state = initialState

    for (let iteration = 0; iteration < 5; iteration += 1) {
      state = getAdaptiveHeuristicsNext({
        project,
        originalSubProject: subProject,
        subProject,
        computed,
        config,
        iterations: 7,
        iteration,
        plan: undefined,
        issues,
        state,
      }).state
    }
    const result = getAdaptiveHeuristicsNext({
      project,
      originalSubProject: subProject,
      subProject,
      computed,
      config,
      iterations: 7,
      iteration: 5,
      plan: undefined,
      issues,
      state,
    })

    expect(result.state.currentRound.sequenceIndex).toBe(1)
    expect(result.state.currentRound.fields).toEqual(initialState.currentRound.fields)
  })

  it('should return no requests for an empty initial round', () => {
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
      iterations: 5,
      plan: undefined,
      issues: [],
    })

    const result = getAdaptiveHeuristicsNext({
      project,
      originalSubProject: subProject,
      subProject,
      computed,
      config,
      iterations: 5,
      iteration: 0,
      plan: undefined,
      issues: [],
      state,
    })

    expect(result.requests).toEqual([])
  })
})
