import type { ProjectSchema } from '../schemas/project'
import type { PocketClusterStitchLineSchema, StitchLineComponentReferencesSchema } from '../schemas/stitching'
import { getUnusedStitchLineName } from './getUnusedStitchLineName'
import { id } from './id'

export const createPocketClusterStitchLine = (
  project: ProjectSchema,
  componentReferences: StitchLineComponentReferencesSchema,
): PocketClusterStitchLineSchema => ({
  ...project.stitchingSettings,
  ...componentReferences,
  id: id(),
  name: getUnusedStitchLineName(project),
  type: 'pocket-cluster-stitch-line',
  enabled: true,
  endOffset: 0,
  startOffset: 0,
  stitchDirection: 'start-to-end',
})
