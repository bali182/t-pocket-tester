import { expose } from 'comlink'

import { getComputedSubProject } from '../logic/getComputedProject'
import { applyMagicFixRequests } from '../logic/magic-fix-2/applyMagicFixChangeRequests'
import { getMagicFixIssues } from '../logic/magic-fix-2/issue-detection/getMagicFixIssues'
import type { MagicFixConfigSchema } from '../schemas/magicFixConfig'
import type {
  MagicFixBaseInput,
  MagicFixHeuristics,
  MagicFixHeuristicsGetInitialStateInput,
  MagicFixHeuristicsInput,
  MagicFixHeuristicsPlanInput,
  MagicFixHeuristicsResult,
} from '../schemas/magicFixHeuristics'
import type { MagicFixApi, MagicFixProgressSchema, MagicFixResultSchema } from '../schemas/magicFixOperation'
import type { ProjectSchema } from '../schemas/project'
import { isDefined } from '../utils/isDefined'

const dummyHeuristics: MagicFixHeuristics<undefined, undefined> = {
  getIterations: ({ config }: MagicFixBaseInput): number => {
    switch (config.effort) {
      case 'low':
        return 100
      case 'medium':
        return 1000
      case 'high':
        return 10000
    }
  },
  getPlan: (_input: MagicFixHeuristicsPlanInput): undefined => {
    return undefined
  },
  getInitialState: (_input: MagicFixHeuristicsGetInitialStateInput<undefined>): undefined => {
    return undefined
  },
  getNextState: (input: MagicFixHeuristicsInput<undefined, undefined>): MagicFixHeuristicsResult<undefined> => {
    const root = input.subProject.components[input.subProject.root]

    if (!isDefined(root) || root.type !== 'root-panel') {
      throw new Error(`Missing root panel with "${input.subProject.root}".`)
    }

    return {
      requests: [
        {
          type: 'set-layout-gap',
          componentId: root.id,
          value: root.layoutGap,
        },
      ],
      state: undefined,
    }
  },
}

const runMagicFixWithHeuristics = <P, S>(
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

const runMagicFix: MagicFixApi = (project, subProjectId, config, reportProgress) => {
  return runMagicFixWithHeuristics(project, subProjectId, config, reportProgress, dummyHeuristics)
}

expose(runMagicFix)
