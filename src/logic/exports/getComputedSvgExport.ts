import type { ComponentSchema, PocketClusterSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedPocketClusterSchema } from '../../schemas/computed'
import type { CornerRadiusSchema } from '../../schemas/geometry'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
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
  subProject: SubProjectSchema,
  computedProject: ComputedSubProjectSchema,
  params: SvgExportParamsSchema,
): SvgExportSchema => {
  const elements = getSvgExportElementsForComponent(subProject, computedProject, subProject.root, params)
  const layout = layoutSvgExportElements(elements, params.gap)

  return {
    params,
    contentWidth: layout.contentWidth,
    contentHeight: layout.contentHeight,
    elements: layout.elements,
  }
}

export const getSvgExportElementsForComponent = (
  subProject: SubProjectSchema,
  computedProject: ComputedSubProjectSchema,
  componentId: string,
  params: SvgExportParamsSchema,
): SvgExportElementSchema[] => {
  const component = subProject.components[componentId]
  const computedComponent = computedProject.components[componentId]

  if (!isDefined(component) || !isDefined(computedComponent)) {
    throw new Error(`Component not found: ${componentId}`)
  }

  switch (component.type) {
    case 'root-panel':
    case 'panel':
      return getSvgExportPanelElements(subProject, computedProject, component, computedComponent, params)
    case 'pocket-cluster':
      return getSvgExportPocketElements(subProject, computedProject, component, computedComponent, params)
  }
}

const getSvgExportPanelElements = (
  subProject: SubProjectSchema,
  computedProject: ComputedSubProjectSchema,
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

  const panel = getSvgExportPanel(subProject, computedProject, component.id, params)
  const children = computedComponent.children.flatMap((child) => {
    return getSvgExportElementsForComponent(subProject, computedProject, child.componentId, params)
  })

  return [panel, ...children]
}

const getSvgExportPanel = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  componentId: string,
  params: SvgExportParamsSchema,
): SvgExportPanelSchema => {
  const component = subProject.components[componentId]
  const computedComponent = computedSubProject.components[componentId]

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
    stitchLines: getSvgExportStitchLines(subProject, computedSubProject, computedComponent, params.stitchLineMode),
  }
}

const getSvgExportPocketElements = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
  params: SvgExportParamsSchema,
): [SvgExportFrontPocketSchema, ...SvgExportTPocketSchema[]] => {
  if (component.type !== 'pocket-cluster' || computedComponent.type !== 'computed-pocket-cluster') {
    throw new Error(`Expected computed pocket cluster: ${component.id}`)
  }

  return [
    getSvgExportFrontPocket(subProject, computedSubProject, component, computedComponent, params),
    ...computedComponent.tPockets.map((pocket, pocketIndex) =>
      getSvgExportTPocket(subProject, computedSubProject, component, pocket, pocketIndex, params),
    ),
  ]
}

const getSvgExportFrontPocket = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
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
      subProject,
      computedSubProject,
      computedComponent.frontPocket,
      params.stitchLineMode,
    ),
  }
}

const getSvgExportTPocket = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
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
    stitchLines: getSvgExportStitchLines(subProject, computedSubProject, pocket, params.stitchLineMode),
  }
}
