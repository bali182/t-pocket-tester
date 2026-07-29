import BigNumber from 'bignumber.js'

import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type {
  ComputedComponentSchema,
  ComputedPanelSchema,
  ComputedPocketClusterSchema,
  ComputedRootPanelSchema,
} from '../schemas/computed'
import type { RectSchema } from '../schemas/geometry'
import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import type { ResolvedStitchLineSchema } from '../schemas/stitching'
import { getResolvedStitchLine } from '../utils/getResolvedStitchLine'
import { isDefined } from '../utils/isDefined'
import { calculateLayoutBoundingBoxes } from './calculateLayoutBoundingBoxes'
import { calculateHoles } from './calculateHoles'
import { calculatePocketClusterGeometry } from './calculatePocketClusterGeometry'
import { calculateRectPath } from './calculateRectPath'
import { getNormalizedCornerRadius } from './getNormalizedCornerRadius'
import { calculateStitchLines } from './stitching/calculateStitchLines'

export const getComputedProject = (project: ProjectSchema): ComputedProjectSchema => {
  console.log(project)

  const rootComponent = project.components[project.root]

  if (!isDefined(rootComponent) || rootComponent.type !== 'root-panel') {
    throw new Error(`Root component not found: ${project.root}`)
  }

  const computedComponents: Record<string, ComputedComponentSchema> = {}
  const resolvedStitchLines = project.stitchLines.map((stitchLine) =>
    getResolvedStitchLine(stitchLine, project.stitchingSettings),
  )
  const rootBoundingRect: RectSchema = {
    x: new BigNumber(0),
    y: new BigNumber(0),
    width: new BigNumber(rootComponent.width),
    height: new BigNumber(rootComponent.height),
  }
  const root = computeRootPanel(rootComponent, rootBoundingRect, project, resolvedStitchLines, computedComponents)
  const holes = calculateHoles(project.holes, computedComponents)
  const stitchLines = calculateStitchLines(resolvedStitchLines, project.components, computedComponents)

  return {
    id: project.id,
    name: project.name,
    root: root.componentId,
    components: computedComponents,
    holes,
    stitchLines,
  }
}

const computeComponent = (
  component: ComponentSchema,
  boundingRect: RectSchema,
  project: ProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedComponentSchema => {
  switch (component.type) {
    case 'root-panel':
      return computeRootPanel(component, boundingRect, project, resolvedStitchLines, computedComponents)
    case 'panel':
      return computePanel(component, boundingRect, project, resolvedStitchLines, computedComponents)
    case 'pocket-cluster':
      return computePocketCluster(component, boundingRect, resolvedStitchLines, computedComponents)
  }
}

const computeRootPanel = (
  rootPanel: RootPanelSchema,
  boundingRect: RectSchema,
  project: ProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedRootPanelSchema => {
  const computed: ComputedRootPanelSchema = {
    type: 'computed-root-panel',
    componentId: rootPanel.id,
    boundingRect,
    path: calculateRectPath(boundingRect, getNormalizedCornerRadius(rootPanel)),
    children: computeLayoutChildren(rootPanel, boundingRect, project, resolvedStitchLines, computedComponents),
  }

  computedComponents[rootPanel.id] = computed

  return computed
}

const computePanel = (
  panel: PanelSchema,
  boundingRect: RectSchema,
  project: ProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedPanelSchema => {
  const computed: ComputedPanelSchema = {
    type: 'computed-panel',
    componentId: panel.id,
    boundingRect,
    path: calculateRectPath(boundingRect, getNormalizedCornerRadius(panel)),
    children: computeLayoutChildren(panel, boundingRect, project, resolvedStitchLines, computedComponents),
  }

  computedComponents[panel.id] = computed

  return computed
}

const computePocketCluster = (
  pocketCluster: PocketClusterSchema,
  boundingRect: RectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedPocketClusterSchema => {
  const geometry = calculatePocketClusterGeometry(pocketCluster, boundingRect, resolvedStitchLines)
  const computed: ComputedPocketClusterSchema = {
    type: 'computed-pocket-cluster',
    componentId: pocketCluster.id,
    boundingRect,
    path: calculateRectPath(boundingRect, getNormalizedCornerRadius(pocketCluster)),
    frontPocket: geometry.frontPocket,
    tPockets: geometry.tPockets,
  }

  computedComponents[pocketCluster.id] = computed

  return computed
}

const computeLayoutChildren = (
  component: RootPanelSchema | PanelSchema,
  boundingRect: RectSchema,
  project: ProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedComponentSchema[] => {
  return calculateLayoutBoundingBoxes(component, project, boundingRect).map(([child, childBoundingRect]) =>
    computeComponent(child, childBoundingRect, project, resolvedStitchLines, computedComponents),
  )
}
