import type { ComponentSchema, PocketClusterSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedPocketClusterSchema } from '../../schemas/computed'
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
import { getSvgExportStitchLines } from './getSvgExportStitchLines'
import { layoutSvgExportElements } from './layoutSvgExportElements'

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

const getSvgExportElementsForComponent = (
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

  return {
    type: 'svg-export-panel',
    component,
    boundingRect: computedComponent.boundingRect,
    path: computedComponent.path,
    stitchLines: getSvgExportStitchLines(
      project,
      computedProject,
      computedComponent.path,
      component.id,
      params.stitchLineMode,
    ),
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
  return {
    type: 'svg-export-front-pocket',
    ownerComponent,
    pocket: computedComponent.frontPocket,
    stitchLines: getSvgExportStitchLines(
      project,
      computedProject,
      computedComponent.frontPocket.path,
      ownerComponent.id,
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
  return {
    type: 'svg-export-t-pocket',
    ownerComponent,
    pocketIndex,
    pocket,
    stitchLines: getSvgExportStitchLines(
      project,
      computedProject,
      pocket.path,
      ownerComponent.id,
      params.stitchLineMode,
    ),
  }
}
