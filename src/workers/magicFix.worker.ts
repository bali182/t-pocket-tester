import { expose } from 'comlink'
import { getComputedSubProject } from '../logic/getComputedProject'
import { MagicFixEffortSchema } from '../schemas/magicFixConfig'
import { MagicFixApi } from '../schemas/magicFixOperation'
import { isDefined } from '../utils/isDefined'

export type MagicFixProgress = {
  progress: number
  max: number
}

const maxIterations: Record<MagicFixEffortSchema, number> = {
  low: 100,
  medium: 1000,
  high: 10000,
}

const runMagicFix: MagicFixApi = (project, subProjectId, config, reportProgress) => {
  const iterations = maxIterations[config.effort]
  const subProject = project.subProjects.find((subProject) => subProject.id === subProjectId)

  if (!isDefined(subProject)) {
    return { type: 'error', issues: [{ severity: 'error', message: `Missing data ${subProjectId}.` }] }
  }

  try {
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      getComputedSubProject(subProject, project.stitchingSettings)

      reportProgress({
        progress: iteration + 1,
        max: iterations,
      })
    }
    // Mock result
    return { type: 'success', data: subProject }
  } catch (e) {
    return { type: 'error', issues: [{ severity: 'error', message: `Unexpected error: ${e}.` }] }
  }
}

expose(runMagicFix)
