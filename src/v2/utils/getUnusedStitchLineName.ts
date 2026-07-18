import type { ProjectSchema } from '../schemas/project'

export const getUnusedStitchLineName = (project: ProjectSchema): string => {
  const usedNames = new Set(project.stitchLines.map((stitchLine) => stitchLine.name))
  let counter = 1
  let name = `Varrás ${counter}`

  while (usedNames.has(name)) {
    counter += 1
    name = `Varrás ${counter}`
  }

  return name
}
