import type { ProjectSchema } from '../schemas/project'
import type { TranslationSchema } from '../translations/translation'

export const getUnusedStitchLineName = (project: ProjectSchema, t: TranslationSchema): string => {
  const usedNames = new Set(project.stitchLines.map((stitchLine) => stitchLine.name))
  let counter = 1
  let name = `${t.defaults.stitchLineName} ${counter}`

  while (usedNames.has(name)) {
    counter += 1
    name = `${t.defaults.stitchLineName} ${counter}`
  }

  return name
}
