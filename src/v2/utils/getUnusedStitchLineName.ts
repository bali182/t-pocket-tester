import { ComponentSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import type { TranslationSchema } from '../translations/translationSchema'

export const getUnusedStitchLineName = (
  project: ProjectSchema,
  _component: ComponentSchema,
  t: TranslationSchema,
): string => {
  const usedNames = new Set(project.stitchLines.map((stitchLine) => stitchLine.name))
  let counter = 1
  let name = t.defaults.stitchLineName(counter)

  while (usedNames.has(name)) {
    counter += 1
    name = t.defaults.stitchLineName(counter)
  }

  return name
}
