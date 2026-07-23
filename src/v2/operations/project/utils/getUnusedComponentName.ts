import type { ComponentSchema } from '../../../schemas/components'
import type { ProjectSchema } from '../../../schemas/project'
import type { TranslationSchema } from '../../../translations/translationSchema'
import { getComponentNameByType } from '../../../utils/getComponentNameByType'

export const getUnusedComponentName = (type: ComponentSchema['type'], project: ProjectSchema, t: TranslationSchema): string => {
  const baseName = getComponentNameByType(type, t)
  const usedNames = new Set(Object.values(project.components).map((component) => component.name))
  let counter = 1
  let name = `${baseName} ${counter}`

  while (usedNames.has(name)) {
    counter += 1
    name = `${baseName} ${counter}`
  }

  return name
}
