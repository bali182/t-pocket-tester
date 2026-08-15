import { expose } from 'comlink'
import { getComputedSubProject } from '../logic/getComputedProject'
import { MagicFixConfigSchema, MagicFixEffortSchema } from '../schemas/magicFixConfig'
import { ProjectSchema } from '../schemas/project'
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

const runMagicFix = async (
  project: ProjectSchema,
  subProjectId: string,
  config: MagicFixConfigSchema,
  reportProgress: (progress: MagicFixProgress) => void,
): Promise<void> => {
  const iterations = maxIterations[config.effort]
  const subProject = project.subProjects.find((subProject) => subProject.id === subProjectId)

  if (!isDefined(subProject)) {
    throw new Error('FUCK')
  }

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    getComputedSubProject(subProject, project.stitchingSettings)

    reportProgress({
      progress: iteration + 1,
      max: iterations,
    })
  }
}

export type MagicFixWorker = typeof runMagicFix

expose(runMagicFix)
