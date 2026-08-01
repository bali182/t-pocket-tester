import type { HasComponentTargetSchema, HasHoleTargetSchema } from '../../schemas/common'
import type { ProjectSchema } from '../../schemas/project'
import type { StitchLineSchema } from '../../schemas/stitching'
import { isDefined } from '../../utils/isDefined'

export type MoveStitchLineToComponentParams = HasComponentTargetSchema & {
  stitchLineId: string
}

export type MoveStitchLineToHoleParams = HasHoleTargetSchema & {
  stitchLineId: string
}

export type MoveStitchLineParams = MoveStitchLineToHoleParams | MoveStitchLineToComponentParams

export const moveStitchLine = (project: ProjectSchema, params: MoveStitchLineParams): ProjectSchema => {
  const stitchLine = project.stitchLines.find((candidate) => candidate.id === params.stitchLineId)

  if (!isDefined(stitchLine)) {
    return project
  }

  switch (params.targetType) {
    case 'hole': {
      const targetHole = project.holes.find((candidate) => candidate.id === params.targetId)
      if (stitchLine.type !== 'component-bounds-stitch-line' || !isDefined(targetHole)) {
        return project
      }
      return updateStitchLine(project, { ...stitchLine, targetType: params.targetType, targetId: params.targetId })
    }
    case 'component': {
      const targetComponent = project.components[params.targetId]
      if (!isDefined(targetComponent)) {
        return project
      }
      if (stitchLine.type === 'pocket-cluster-stitch-line' && targetComponent.type !== 'pocket-cluster') {
        return project
      }
      return updateStitchLine(project, { ...stitchLine, targetType: params.targetType, targetId: params.targetId })
    }
  }
}

const updateStitchLine = (project: ProjectSchema, stitchLine: StitchLineSchema): ProjectSchema => {
  return {
    ...project,
    stitchLines: project.stitchLines.map((candidate) => (candidate.id === stitchLine.id ? stitchLine : candidate)),
  }
}
