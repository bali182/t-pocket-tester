import { getComponentDescendants } from '../operations/subProject/utils/getComponentDescendants'
import { ComponentSchema } from '../schemas/components'
import { SelectionSchema } from '../schemas/selection'
import { StitchLineSchema } from '../schemas/stitching'
import { SubProjectSchema } from '../schemas/subProject'
import { isDefined } from '../utils/isDefined'

const EmptySet: ReadonlySet<string> = new Set<string>()

export const getSelectionObstructingComponentIds = (
  selection: SelectionSchema | undefined,
  subProject: SubProjectSchema,
): ReadonlySet<string> => {
  if (!isDefined(selection)) {
    return EmptySet
  }
  switch (selection.type) {
    case 'component':
      return EmptySet
    case 'stitch-line':
      return getStitchLineObstructingComponentIds(selection.stitchLineId, subProject)
    case 'hole':
      return getHoleObstructingComponentIds(selection.holeId, subProject)
  }
}

const getStitchLineObstructingComponentIds = (
  stitchLineId: string,
  subProject: SubProjectSchema,
): ReadonlySet<string> => {
  if (!isDefined(stitchLineId)) {
    return EmptySet
  }

  const stitchLine = subProject.stitchLines.find((s) => s.id === stitchLineId)

  if (!isDefined(stitchLine)) {
    return EmptySet
  }

  const ownerComponent = getStitchLineOwnerComponent(stitchLine, subProject)

  if (!isDefined(ownerComponent)) {
    return EmptySet
  }

  const coveredComponentIds = new Set(getComponentDescendants(ownerComponent, subProject))
  coveredComponentIds.delete(ownerComponent.id)

  if (ownerComponent.type === 'pocket-cluster' && stitchLine.type === 'pocket-cluster-stitch-line') {
    coveredComponentIds.add(ownerComponent.id)
  }

  return coveredComponentIds
}

const getHoleObstructingComponentIds = (holeId: string, subProject: SubProjectSchema): ReadonlySet<string> => {
  const hole = subProject.holes.find((candidate) => candidate.id === holeId)

  if (!isDefined(hole)) {
    return EmptySet
  }

  const ownerComponent = subProject.components[hole.componentId]

  if (!isDefined(ownerComponent)) {
    return EmptySet
  }

  const obstructingComponentIds = new Set(getComponentDescendants(ownerComponent, subProject))
  obstructingComponentIds.delete(ownerComponent.id)

  return obstructingComponentIds
}

const getStitchLineOwnerComponent = (
  stitchLine: StitchLineSchema,
  subProject: SubProjectSchema,
): ComponentSchema | undefined => {
  if (stitchLine.targetType === 'component') {
    return subProject.components[stitchLine.targetId]
  }
  const targetHole = subProject.holes.find((hole) => hole.id === stitchLine.targetId)
  return isDefined(targetHole) ? subProject.components[targetHole.componentId] : undefined
}
