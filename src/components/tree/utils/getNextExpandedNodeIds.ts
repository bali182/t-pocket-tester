import { getComponentAncestorIds } from '../../../operations/project/utils/getComponentAncestorIds'
import { ProjectSchema } from '../../../schemas/project'
import { EditorSelectionSchema } from '../../../schemas/selection'
import { isDefined } from '../../../utils/isDefined'
import { getComponentNodeId, getHoleNodeId } from './treeNodeIds'

export const getNextExpandedNodeIds = (
  selection: EditorSelectionSchema,
  project: ProjectSchema,
  expandedIds: string[],
): string[] => {
  switch (selection.type) {
    case 'component':
      return getNextExpandedNodeIdsForComponent(selection.componentId, project, expandedIds)
    case 'stitch-line':
      return getNextExpandedIdsForStitchLine(selection.stitchLineId, project, expandedIds)
    case 'hole':
      return getNextExpandedIdsForHole(selection.holeId, project, expandedIds)
  }
}

const getNextExpandedNodeIdsForComponent = (
  componentId: string,
  project: ProjectSchema,
  expandedIds: string[],
): string[] => {
  return uniqueExpandedIds(expandedIds, getComponentRelatedIds(componentId, project, false))
}

const getNextExpandedIdsForStitchLine = (
  stitchLineId: string,
  project: ProjectSchema,
  expandedIds: string[],
): string[] => {
  const stitchLine = project.stitchLines.find((candidate) => candidate.id === stitchLineId)
  if (!isDefined(stitchLine)) {
    return expandedIds
  }

  switch (stitchLine.targetType) {
    case 'component': {
      return uniqueExpandedIds(expandedIds, getComponentRelatedIds(stitchLine.targetId, project, true))
    }
    case 'hole': {
      const hole = project.holes.find((candidate) => candidate.id === stitchLine.targetId)
      if (!isDefined(hole)) {
        return expandedIds
      }
      return uniqueExpandedIds(expandedIds, [
        ...getComponentRelatedIds(hole.componentId, project, true),
        getHoleNodeId(hole.id),
      ])
    }
    default: {
      return expandedIds
    }
  }
}

const getNextExpandedIdsForHole = (holeId: string, project: ProjectSchema, expandedIds: string[]): string[] => {
  const hole = project.holes.find((candidate) => candidate.id === holeId)

  if (!isDefined(hole)) {
    return expandedIds
  }

  return uniqueExpandedIds(expandedIds, getComponentRelatedIds(hole.componentId, project, true))
}

const getComponentRelatedIds = (componentId: string, project: ProjectSchema, includeComponent: boolean): string[] => {
  const ancestorNodeIds = getComponentAncestorIds(componentId, project).map(getComponentNodeId)
  return includeComponent ? [...ancestorNodeIds, getComponentNodeId(componentId)] : ancestorNodeIds
}

export const uniqueExpandedIds = (expandedIds: string[], newExpandedIds: string[]) =>
  Array.from(new Set([...expandedIds, ...newExpandedIds]))
