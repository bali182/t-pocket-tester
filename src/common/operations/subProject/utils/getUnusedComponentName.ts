import type { ComponentSchema } from '../../../schemas/components'
import type { SubProjectSchema } from '../../../schemas/subProject'
import type { TranslationSchema } from '../../../translations/translationSchema'
import { getComponentNameByType } from '../../../utils/getComponentNameByType'
import { getUnusedName } from './getUnusedName'

export const getUnusedComponentName = (
  type: ComponentSchema['type'],
  subProject: SubProjectSchema,
  t: TranslationSchema,
): string => {
  const baseName = getComponentNameByType(type, t)
  const usedNames = new Set(Object.values(subProject.components).map((component) => component.name))
  return getUnusedName(baseName, usedNames)
}
