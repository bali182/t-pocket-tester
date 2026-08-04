import type { ComponentSchema, PocketClusterSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedPocketClusterSchema } from '../../schemas/computed'
import type { CornerRadiusSchema } from '../../schemas/geometry'
import type { ComputedProjectSchema, ProjectSchema } from '../../schemas/project'
import type {
  SvgExportElementSchema,
  SvgExportFrontPocketSchema,
  SvgExportPanelSchema,
  SvgExportParamsSchema,
  SvgExportSchema,
  SvgExportTPocketSchema,
} from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'
import { calculateRectPath } from '../calculateRectPath'
import { getSvgExportChildMarkerPaths } from './getSvgExportChildMarkerPaths'
import { getSvgExportCutHelperBoundingRect } from './getSvgExportCutHelperBoundingRect'
import { getSvgExportStitchLines } from './getSvgExportStitchLines'
import { layoutSvgExportElements } from './layoutSvgExportElements'

const zeroCornerRadius: CornerRadiusSchema = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0,
}

export const getComputedSvgExport = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  params: SvgExportParamsSchema,
): SvgExportSchema => {
  const elements = getSvgExportElementsForComponent(project, computedProject, project.root, params)
  const layout = layoutSvgExportElements(elements, params.gap)

  return {
    params,
    contentWidth: layout.contentWidth,
    contentHeight: layout.contentHeight,
    elements: layout.elements,
  }
}

export const getSvgExportElementsForComponent = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  componentId: string,
  params: SvgExportParamsSchema,
): SvgExportElementSchema[] => {
  const component = project.components[componentId]
  const computedComponent = computedProject.components[componentId]

  if (!isDefined(component) || !isDefined(computedComponent)) {
    throw new Error(`Component not found: ${componentId}`)
  }

  switch (component.type) {
    case 'root-panel':
    case 'panel':
      return getSvgExportPanelElements(project, computedProject, component, computedComponent, params)
    case 'pocket-cluster':
      return getSvgExportPocketElements(project, computedProject, component, computedComponent, params)
  }
}

const getSvgExportPanelElements = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
  params: SvgExportParamsSchema,
): SvgExportElementSchema[] => {
  if (
    (component.type !== 'root-panel' && component.type !== 'panel') ||
    (computedComponent.type !== 'computed-root-panel' && computedComponent.type !== 'computed-panel')
  ) {
    throw new Error(`Expected computed panel: ${component.id}`)
  }

  const panel = getSvgExportPanel(project, computedProject, component.id, params)
  const children = computedComponent.children.flatMap((child) => {
    return getSvgExportElementsForComponent(project, computedProject, child.componentId, params)
  })

  return [panel, ...children]
}

const getSvgExportPanel = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  componentId: string,
  params: SvgExportParamsSchema,
): SvgExportPanelSchema => {
  const component = project.components[componentId]
  const computedComponent = computedProject.components[componentId]

  if (
    !isDefined(component) ||
    !isDefined(computedComponent) ||
    (component.type !== 'root-panel' && component.type !== 'panel') ||
    (computedComponent.type !== 'computed-root-panel' && computedComponent.type !== 'computed-panel')
  ) {
    throw new Error(`Expected panel component: ${componentId}`)
  }

  const cutHelperBoundingRect = getSvgExportCutHelperBoundingRect(
    computedComponent.boundingRect,
    params.cutHelperDistance,
  )

  return {
    type: 'svg-export-panel',
    id: component.id,
    component,
    boundingRect: computedComponent.boundingRect,
    ...(isDefined(cutHelperBoundingRect)
      ? {
          cutHelper: calculateRectPath(cutHelperBoundingRect, zeroCornerRadius),
          cutHelperBoundingRect,
        }
      : {}),
    path: computedComponent.path,
    childMarkerPaths: params.childMarkers
      ? getSvgExportChildMarkerPaths(computedComponent.children, computedComponent.boundingRect)
      : [],
    stitchLines: getSvgExportStitchLines(project, computedProject, computedComponent, params.stitchLineMode),
  }
}

const getSvgExportPocketElements = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
  params: SvgExportParamsSchema,
): [SvgExportFrontPocketSchema, ...SvgExportTPocketSchema[]] => {
  if (component.type !== 'pocket-cluster' || computedComponent.type !== 'computed-pocket-cluster') {
    throw new Error(`Expected computed pocket cluster: ${component.id}`)
  }

  return [
    getSvgExportFrontPocket(project, computedProject, component, computedComponent, params),
    ...computedComponent.tPockets.map((pocket, pocketIndex) =>
      getSvgExportTPocket(project, computedProject, component, pocket, pocketIndex, params),
    ),
  ]
}

const getSvgExportFrontPocket = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  ownerComponent: PocketClusterSchema,
  computedComponent: ComputedPocketClusterSchema,
  params: SvgExportParamsSchema,
): SvgExportFrontPocketSchema => {
  const cutHelperBoundingRect = getSvgExportCutHelperBoundingRect(
    computedComponent.frontPocket.boundingRect,
    params.cutHelperDistance,
  )

  return {
    type: 'svg-export-front-pocket',
    id: `${ownerComponent.id}--front-pocket`,
    ownerComponent,
    pocket: computedComponent.frontPocket,
    ...(isDefined(cutHelperBoundingRect)
      ? {
          cutHelper: calculateRectPath(cutHelperBoundingRect, zeroCornerRadius),
          cutHelperBoundingRect,
        }
      : {}),
    stitchLines: getSvgExportStitchLines(
      project,
      computedProject,
      computedComponent.frontPocket,
      params.stitchLineMode,
    ),
  }
}

const getSvgExportTPocket = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  ownerComponent: PocketClusterSchema,
  pocket: ComputedPocketClusterSchema['tPockets'][number],
  pocketIndex: number,
  params: SvgExportParamsSchema,
): SvgExportTPocketSchema => {
  const cutHelperBoundingRect = getSvgExportCutHelperBoundingRect(pocket.boundingRect, params.cutHelperDistance)

  return {
    type: 'svg-export-t-pocket',
    id: `${ownerComponent.id}--t-pocket-${pocketIndex}`,
    ownerComponent,
    pocketIndex,
    pocket,
    ...(isDefined(cutHelperBoundingRect)
      ? {
          cutHelper: calculateRectPath(cutHelperBoundingRect, zeroCornerRadius),
          cutHelperBoundingRect,
        }
      : {}),
    stitchLines: getSvgExportStitchLines(project, computedProject, pocket, params.stitchLineMode),
  }
}
