import { getComponentParent } from '../../../operations/project/utils/getComponentParent'
import { hasComponentChildren } from '../../../operations/project/utils/hasComponentChildren'
import { ComponentSchema } from '../../../schemas/components'
import { HoleSchema } from '../../../schemas/hole'
import { ProjectSchema } from '../../../schemas/project'
import { StitchLineSchema } from '../../../schemas/stitching'
import { isDefined } from '../../../utils/isDefined'
import { ComponentTreeNode, HoleTreeNode, StitchLineTreeNode } from '../types/nodeTypes'
import { getComponentNodeId, getHoleNodeId, getStitchLineNodeId } from './treeNodeIds'

export const createComponentTreeNode = (project: ProjectSchema, component: ComponentSchema): ComponentTreeNode => {
  const parent = getComponentParent(component.id, project)
  const siblingIds = isDefined(parent) ? parent.children : []
  const componentIndex = siblingIds.indexOf(component.id)
  const nextSiblingId = componentIndex < 0 ? undefined : siblingIds[componentIndex + 1]

  const childComponentNodes = hasComponentChildren(component)
    ? component.children
        .map((childId) => project.components[childId])
        .filter(isDefined)
        .map((child) => createComponentTreeNode(project, child))
    : []

  const holeNodes = project.holes
    .filter((hole) => hole.componentId === component.id)
    .map((hole) => createHoleTreeNode(project, hole))

  const stitchLineNodes = project.stitchLines
    .filter((stitchLine) => stitchLine.targetType === 'component' && stitchLine.targetId === component.id)
    .map((stitchLine) => createStitchLineTreeNode(project, stitchLine))

  return {
    children: [...childComponentNodes, ...holeNodes, ...stitchLineNodes],
    component,
    id: getComponentNodeId(component.id),
    kind: 'component',
    nextSiblingId,
    parentId: parent?.id,
  }
}

export const createHoleTreeNode = (project: ProjectSchema, hole: HoleSchema): HoleTreeNode => {
  const stitchLineNodes = project.stitchLines
    .filter(
      (stitchLine) =>
        stitchLine.type === 'component-bounds-stitch-line' &&
        stitchLine.targetType === 'hole' &&
        stitchLine.targetId === hole.id,
    )
    .map((stitchLine) => createStitchLineTreeNode(project, stitchLine))

  return {
    children: stitchLineNodes,
    hole,
    id: getHoleNodeId(hole.id),
    kind: 'hole',
  }
}

export const createStitchLineTreeNode = (_project: ProjectSchema, stitchLine: StitchLineSchema): StitchLineTreeNode => {
  return {
    children: [],
    id: getStitchLineNodeId(stitchLine.id),
    kind: 'stitch-line',
    stitchLine,
  }
}

export const createTreeRootNode = (project: ProjectSchema): ComponentTreeNode => {
  const rootComponent = project.components[project.root]

  if (!isDefined(rootComponent)) {
    throw new Error(`Root component not found: ${project.root}`)
  }

  return {
    children: [createComponentTreeNode(project, rootComponent)],
    component: rootComponent,
    id: 'component-tree-root',
    kind: 'component',
    nextSiblingId: undefined,
    parentId: undefined,
  }
}
