import type { MagicFixConfigSchema } from '../../schemas/magicFixConfig'
import type { MagicFixHeuristics, MagicFixHeuristicsGetInitialStateInput } from '../../schemas/magicFixHeuristics'
import type { MagicFixProgressSchema, MagicFixResultSchema } from '../../schemas/magicFixOperation'
import type { ProjectSchema } from '../../schemas/project'
import { isDefined } from '../../utils/isDefined'
import { getComputedSubProject } from '../getComputedProject'
import { applyMagicFixRequests } from './applyMagicFixChangeRequests'
import { getMagicFixIssues } from './issue-detection/getMagicFixIssues'

export const runMagicFixWithHeuristics = <P, S>(
  project: ProjectSchema,
  subProjectId: string,
  config: MagicFixConfigSchema,
  reportProgress: (progress: MagicFixProgressSchema) => void,
  heuristics: MagicFixHeuristics<P, S>,
): MagicFixResultSchema => {
  const originalSubProject = project.subProjects.find((subProject) => subProject.id === subProjectId)

  if (!isDefined(originalSubProject)) {
    return { type: 'error', issues: [{ severity: 'error', message: `Missing data ${subProjectId}.` }] }
  }

  try {
    let subProject = originalSubProject
    let computed = getComputedSubProject(subProject, project.stitchingSettings)
    let issues = getMagicFixIssues({ project, subProject, computed, config })

    if (issues.length === 0) {
      return { type: 'success', data: subProject }
    }

    const iterations = heuristics.getIterations({ project, subProject, computed, config })
    const plan = heuristics.getPlan({ project, subProject, computed, config, iterations })
    const initialStateInput: MagicFixHeuristicsGetInitialStateInput<P> = {
      project,
      subProject,
      computed,
      config,
      iterations,
      plan,
      issues,
    }

    let state = heuristics.getInitialState(initialStateInput)

    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const result = heuristics.getNextState({
        project,
        originalSubProject,
        subProject,
        computed,
        config,
        issues,
        iterations,
        iteration,
        plan,
        state,
      })
      state = result.state

      if (result.requests.length === 0) {
        return { type: 'no-result', issues }
      }

      subProject = applyMagicFixRequests(subProject, result.requests)
      computed = getComputedSubProject(subProject, project.stitchingSettings)
      issues = getMagicFixIssues({ project, subProject, computed, config })

      reportProgress({
        progress: iteration + 1,
        max: iterations,
      })

      if (issues.length === 0) {
        return { type: 'success', data: subProject }
      }
    }

    return { type: 'no-result', issues }
  } catch (e) {
    return { type: 'error', issues: [{ severity: 'error', message: `Unexpected error: ${e}.` }] }
  }
}
