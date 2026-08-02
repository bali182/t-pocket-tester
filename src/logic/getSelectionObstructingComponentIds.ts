import { getComponentDescendants } from '../operations/project/utils/getComponentDescendants'
import { ComponentSchema } from '../schemas/components'
import { ProjectSchema } from '../schemas/project'
import { EditorSelectionSchema } from '../schemas/selection'
import { StitchLineSchema } from '../schemas/stitching'
import { isDefined } from '../utils/isDefined'

const EmptySet: ReadonlySet<string> = new Set<string>()

export const getSelectionObstructingComponentIds = (
  selection: EditorSelectionSchema | undefined,
  project: ProjectSchema,
): ReadonlySet<string> => {
  if (!isDefined(selection)) {
    return EmptySet
  }
  switch (selection.type) {
    case 'component':
      return EmptySet
    case 'stitch-line':
      return getStitchLineObstructingComponentIds(selection.stitchLineId, project)
    case 'hole':
      return getHoleObstructingComponentIds(selection.holeId, project)
  }
}

const getStitchLineObstructingComponentIds = (stitchLineId: string, project: ProjectSchema): ReadonlySet<string> => {
  if (!isDefined(stitchLineId)) {
    return EmptySet
  }

  const stitchLine = project.stitchLines.find((s) => s.id === stitchLineId)

  if (!isDefined(stitchLine)) {
    return EmptySet
  }

  const ownerComponent = getStitchLineOwnerComponent(stitchLine, project)

  if (!isDefined(ownerComponent)) {
    return EmptySet
  }

  const coveredComponentIds = new Set(getComponentDescendants(ownerComponent, project))
  coveredComponentIds.delete(ownerComponent.id)

  if (ownerComponent.type === 'pocket-cluster' && stitchLine.type === 'pocket-cluster-stitch-line') {
    coveredComponentIds.add(ownerComponent.id)
  }

  return coveredComponentIds
}

const getHoleObstructingComponentIds = (holeId: string, project: ProjectSchema): ReadonlySet<string> => {
  const hole = project.holes.find((candidate) => candidate.id === holeId)

  if (!isDefined(hole)) {
    return EmptySet
  }

  const ownerComponent = project.components[hole.componentId]

  if (!isDefined(ownerComponent)) {
    return EmptySet
  }

  const obstructingComponentIds = new Set(getComponentDescendants(ownerComponent, project))
  obstructingComponentIds.delete(ownerComponent.id)

  return obstructingComponentIds
}

const getStitchLineOwnerComponent = (
  stitchLine: StitchLineSchema,
  project: ProjectSchema,
): ComponentSchema | undefined => {
  if (stitchLine.targetType === 'component') {
    return project.components[stitchLine.targetId]
  }
  const targetHole = project.holes.find((hole) => hole.id === stitchLine.targetId)
  return isDefined(targetHole) ? project.components[targetHole.componentId] : undefined
}
