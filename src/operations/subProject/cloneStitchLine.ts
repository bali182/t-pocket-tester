import type { SubProjectSchema } from '../../schemas/subProject'
import type { StitchLineSchema } from '../../schemas/stitching'

export type CloneStitchLineParams = {
  stitchLineId: string
  getUnusedId: () => string
  getUnusedName: (sourceName: string, usedNames: Set<string>) => string
}

export const cloneStitchLine = (
  subProject: SubProjectSchema,
  { stitchLineId, getUnusedId, getUnusedName }: CloneStitchLineParams,
): SubProjectSchema => {
  const sourceStitchLineIndex = subProject.stitchLines.findIndex((stitchLine) => stitchLine.id === stitchLineId)

  if (sourceStitchLineIndex < 0) {
    return subProject
  }

  const sourceStitchLine = subProject.stitchLines[sourceStitchLineIndex]
  const usedNames = new Set(subProject.stitchLines.map((stitchLine) => stitchLine.name))
  const clonedStitchLine: StitchLineSchema = {
    ...sourceStitchLine,
    id: getUnusedId(),
    name: getUnusedName(sourceStitchLine.name, usedNames),
  }

  return {
    ...subProject,
    stitchLines: [
      ...subProject.stitchLines.slice(0, sourceStitchLineIndex + 1),
      clonedStitchLine,
      ...subProject.stitchLines.slice(sourceStitchLineIndex + 1),
    ],
  }
}
