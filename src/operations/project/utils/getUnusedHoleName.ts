import type { HoleSchema } from '../../../schemas/hole'
import type { ProjectSchema } from '../../../schemas/project'
import type { TranslationSchema } from '../../../translations/translationSchema'
import { getUnusedName } from './getUnusedName'

export const getUnusedHoleName = (
  type: HoleSchema['type'],
  project: ProjectSchema,
  t: TranslationSchema,
): string => {
  const baseName = type === 'rect-hole' ? t.hole.types.rectangle : t.hole.types.circle
  const usedNames = new Set(project.holes.map((hole) => hole.name))
  return getUnusedName(baseName, usedNames)
}
