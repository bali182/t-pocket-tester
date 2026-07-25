import type { ProjectSchema } from '../../schemas/project'
import type { StitchLineSchema } from '../../schemas/stitching'

export type CloneStitchLineParams = {
  stitchLineId: string
  getUnusedId: () => string
  getUnusedName: (sourceName: string, usedNames: Set<string>) => string
}

export const cloneStitchLine = (
  project: ProjectSchema,
  { stitchLineId, getUnusedId, getUnusedName }: CloneStitchLineParams,
): ProjectSchema => {
  const sourceStitchLineIndex = project.stitchLines.findIndex((stitchLine) => stitchLine.id === stitchLineId)

  if (sourceStitchLineIndex < 0) {
    return project
  }

  const sourceStitchLine = project.stitchLines[sourceStitchLineIndex]
  const usedNames = new Set(project.stitchLines.map((stitchLine) => stitchLine.name))
  const clonedStitchLine: StitchLineSchema = {
    ...sourceStitchLine,
    id: getUnusedId(),
    name: getUnusedName(sourceStitchLine.name, usedNames),
  }

  return {
    ...project,
    stitchLines: [
      ...project.stitchLines.slice(0, sourceStitchLineIndex + 1),
      clonedStitchLine,
      ...project.stitchLines.slice(sourceStitchLineIndex + 1),
    ],
  }
}
