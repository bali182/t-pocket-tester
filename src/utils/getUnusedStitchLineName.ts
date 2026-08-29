import { getUnusedName } from '../operations/subProject/utils/getUnusedName'
import { StitchLineSchema } from '../schemas/stitching'
import type { SubProjectSchema } from '../schemas/subProject'
import type { TranslationSchema } from '../translations/translationSchema'
import { getStitchLineNameByType } from './getStitchLineNameByType'

export const getUnusedStitchLineName = (
  type: StitchLineSchema['type'],
  subProject: SubProjectSchema,
  t: TranslationSchema,
): string => {
  const baseName = getStitchLineNameByType(type, t)
  const usedNames = new Set(subProject.stitchLines.map((stitchLine) => stitchLine.name))
  return getUnusedName(baseName, usedNames)
}
