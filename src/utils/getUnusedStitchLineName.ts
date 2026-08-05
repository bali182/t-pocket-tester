import type { SubProjectSchema } from '../schemas/subProject'
import type { TranslationSchema } from '../translations/translationSchema'

export const getUnusedStitchLineName = (subProject: SubProjectSchema, t: TranslationSchema): string => {
  const usedNames = new Set(subProject.stitchLines.map((stitchLine) => stitchLine.name))
  let counter = 1
  let name = t.defaults.stitchLineName(counter)

  while (usedNames.has(name)) {
    counter += 1
    name = t.defaults.stitchLineName(counter)
  }

  return name
}
