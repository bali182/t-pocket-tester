import { describe, expect, it } from 'vitest'

import { d, m } from '../../../../testData'
import { createMagicFixConfig } from '../../../../utils/createMagicFixConfig'
import { getComputedSubProject } from '../../../getComputedProject'
import { getAdaptiveHeuristicsPlan } from './getAdaptiveHeuristicsPlan'

describe('getAdaptiveHeuristicsPlan', () => {
  it('should create mixed, unique numeric discovery configurations from band midpoints', () => {
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

    const plan = getAdaptiveHeuristicsPlan({ project, subProject, computed, config, iterations: 100 })

    expect(plan.fields).toHaveLength(2)
    expect(plan.fields[0]).toMatchObject({ type: 'numeric', bands: expect.any(Array) })
    expect(plan.fields[1]).toMatchObject({ type: 'numeric', bands: expect.any(Array) })
    expect(
      plan.discoveryConfigurations.map((configuration) => configuration.values.map((value) => value.toString())),
    ).toEqual([
      ['104', '14'],
      ['102', '8'],
      ['96', '6'],
      ['100', '12'],
      ['98', '10'],
    ])
  })

  it('should use only the initial and alternative value for a direction field', () => {
    const root = d.rootPanel({ id: 'root' })
    const stitchLine = d.componentBoundsStitchLine({
      id: 'line',
      targetType: 'component',
      targetId: root.id,
      topStitchDirection: 'left-to-right',
    })
    const subProject = d.subProject({ id: 'sub-project', root, stitchLines: [stitchLine] })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject))
      .disableAll()
      .set(stitchLine, { canFlipTopStitchDirection: true })
      .toMagicFix()
    config.effort = 'low'
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const plan = getAdaptiveHeuristicsPlan({ project, subProject, computed, config, iterations: 100 })

    expect(plan.discoveryConfigurations).toHaveLength(2)
    expect(plan.discoveryConfigurations.map((configuration) => configuration.values)).toEqual([
      ['left-to-right'],
      ['right-to-left'],
    ])
  })

  it('should stop at the number of distinct discrete configurations', () => {
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

    const plan = getAdaptiveHeuristicsPlan({ project, subProject, computed, config, iterations: 100 })

    expect(plan.discoveryConfigurations).toHaveLength(4)
    expect(new Set(plan.discoveryConfigurations.map((configuration) => configuration.values.join(':'))).size).toBe(4)
  })

  it('should return no discovery configurations when no field is adjustable', () => {
    const root = d.rootPanel({ id: 'root' })
    const subProject = d.subProject({ id: 'sub-project', root })
    const project = d.project({ id: 'project', subProjects: [subProject] })
    const config = m(createMagicFixConfig(project, subProject)).disableAll().toMagicFix()
    const computed = getComputedSubProject(subProject, project.stitchingSettings)

    const plan = getAdaptiveHeuristicsPlan({ project, subProject, computed, config, iterations: 100 })

    expect(plan).toEqual({ fields: [], discoveryConfigurations: [] })
  })
})
