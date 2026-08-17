import { expose } from 'comlink'

import { adaptiveHeuristics } from '../logic/magic-fix-2/heuristics/adaptive/adaptiveHeuristics'
import { runMagicFixWithHeuristics } from '../logic/magic-fix-2/runMagicFixWithHeuristics'
import type { MagicFixApi } from '../schemas/magicFixOperation'

const runMagicFix: MagicFixApi = (project, subProjectId, config, reportProgress) => {
  return runMagicFixWithHeuristics(project, subProjectId, config, reportProgress, adaptiveHeuristics)
}

expose(runMagicFix)
