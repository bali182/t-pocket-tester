import type { ProjectSchema } from '../../../schemas/project'
import type { TranslationSchema } from '../../../translations/translationSchema'
import { getUnusedName } from './getUnusedName'

export const getUnusedHoleName = (
  project: ProjectSchema,
  t: TranslationSchema,
): string => {
  const usedNames = new Set(project.holes.map((hole) => hole.name))
  return getUnusedName(t.hole.title, usedNames)
}
