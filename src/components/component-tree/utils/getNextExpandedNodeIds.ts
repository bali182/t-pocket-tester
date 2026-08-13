import { getComponentAncestorIds } from '../../../operations/subProject/utils/getComponentAncestorIds'
import { SelectionSchema } from '../../../schemas/selection'
import { SubProjectSchema } from '../../../schemas/subProject'
import { isDefined } from '../../../utils/isDefined'
import { getComponentNodeId, getHoleNodeId } from './treeNodeIds'

export const getNextExpandedNodeIds = (
  selection: SelectionSchema,
  subProject: SubProjectSchema,
  expandedIds: string[],
): string[] => {
  switch (selection.type) {
    case 'component':
      return getNextExpandedNodeIdsForComponent(selection.componentId, subProject, expandedIds)
    case 'stitch-line':
      return getNextExpandedIdsForStitchLine(selection.stitchLineId, subProject, expandedIds)
    case 'hole':
      return getNextExpandedIdsForHole(selection.holeId, subProject, expandedIds)
  }
}

const getNextExpandedNodeIdsForComponent = (
  componentId: string,
  subProject: SubProjectSchema,
  expandedIds: string[],
): string[] => {
  return uniqueExpandedIds(expandedIds, getComponentRelatedIds(componentId, subProject, false))
}

const getNextExpandedIdsForStitchLine = (
  stitchLineId: string,
  subProject: SubProjectSchema,
  expandedIds: string[],
): string[] => {
  const stitchLine = subProject.stitchLines.find((candidate) => candidate.id === stitchLineId)
  if (!isDefined(stitchLine)) {
    return expandedIds
  }

  switch (stitchLine.targetType) {
    case 'component': {
      return uniqueExpandedIds(expandedIds, getComponentRelatedIds(stitchLine.targetId, subProject, true))
    }
    case 'hole': {
      const hole = subProject.holes.find((candidate) => candidate.id === stitchLine.targetId)
      if (!isDefined(hole)) {
        return expandedIds
      }
      return uniqueExpandedIds(expandedIds, [
        ...getComponentRelatedIds(hole.componentId, subProject, true),
        getHoleNodeId(hole.id),
      ])
    }
    default: {
      return expandedIds
    }
  }
}

const getNextExpandedIdsForHole = (holeId: string, subProject: SubProjectSchema, expandedIds: string[]): string[] => {
  const hole = subProject.holes.find((candidate) => candidate.id === holeId)

  if (!isDefined(hole)) {
    return expandedIds
  }

  return uniqueExpandedIds(expandedIds, getComponentRelatedIds(hole.componentId, subProject, true))
}

const getComponentRelatedIds = (
  componentId: string,
  subProject: SubProjectSchema,
  includeComponent: boolean,
): string[] => {
  const ancestorNodeIds = getComponentAncestorIds(componentId, subProject).map(getComponentNodeId)
  return includeComponent ? [...ancestorNodeIds, getComponentNodeId(componentId)] : ancestorNodeIds
}

export const uniqueExpandedIds = (expandedIds: string[], newExpandedIds: string[]) =>
  Array.from(new Set([...expandedIds, ...newExpandedIds]))
