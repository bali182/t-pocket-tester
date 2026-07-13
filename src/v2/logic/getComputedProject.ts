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
import { isDefined } from '../utils/isDefined'
import { calculateLayoutBoundingBoxes } from './calculateLayoutBoundingBoxes'
import { calculatePocketClusterGeometry } from './calculatePocketClusterGeometry'
import { calculateRectPath } from './calculateRectPath'
import { calculateStitchLines } from './calculateStitchLines'
import { getNormalizedCornerRadius } from './getNormalizedCornerRadius'

export const getComputedProject = (project: ProjectSchema): ComputedProjectSchema => {
  const rootComponent = project.components[project.root]

  if (!isDefined(rootComponent) || rootComponent.type !== 'root-panel') {
    throw new Error(`Root component not found: ${project.root}`)
  }

  const computedComponents: Record<string, ComputedComponentSchema> = {}
  const rootBoundingRect: RectSchema = {
    x: new BigNumber(0),
    y: new BigNumber(0),
    width: new BigNumber(rootComponent.width),
    height: new BigNumber(rootComponent.height),
  }
  const root = computeRootPanel(rootComponent, rootBoundingRect, project, computedComponents)
  const stitchLines = calculateStitchLines(project.stitchLines, project.components, computedComponents)

  return {
    id: project.id,
    name: project.name,
    root: root.componentId,
    components: computedComponents,
    stitchLines,
  }
}

const computeComponent = (
  component: ComponentSchema,
  boundingRect: RectSchema,
  project: ProjectSchema,
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedComponentSchema => {
  switch (component.type) {
    case 'root-panel':
      return computeRootPanel(component, boundingRect, project, computedComponents)
    case 'panel':
      return computePanel(component, boundingRect, project, computedComponents)
    case 'pocket-cluster':
      return computePocketCluster(component, boundingRect, computedComponents)
  }
}

const computeRootPanel = (
  rootPanel: RootPanelSchema,
  boundingRect: RectSchema,
  project: ProjectSchema,
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedRootPanelSchema => {
  const computed: ComputedRootPanelSchema = {
    type: 'computed-root-panel',
    componentId: rootPanel.id,
    boundingRect,
    path: calculateRectPath(boundingRect, getNormalizedCornerRadius(rootPanel)),
    children: computeLayoutChildren(rootPanel, boundingRect, project, computedComponents),
  }

  computedComponents[rootPanel.id] = computed

  return computed
}

const computePanel = (
  panel: PanelSchema,
  boundingRect: RectSchema,
  project: ProjectSchema,
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedPanelSchema => {
  const computed: ComputedPanelSchema = {
    type: 'computed-panel',
    componentId: panel.id,
    boundingRect,
    path: calculateRectPath(boundingRect, getNormalizedCornerRadius(panel)),
    children: computeLayoutChildren(panel, boundingRect, project, computedComponents),
  }

  computedComponents[panel.id] = computed

  return computed
}

const computePocketCluster = (
  pocketCluster: PocketClusterSchema,
  boundingRect: RectSchema,
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedPocketClusterSchema => {
  const geometry = calculatePocketClusterGeometry(pocketCluster, boundingRect)
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
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedComponentSchema[] => {
  return calculateLayoutBoundingBoxes(component, project, boundingRect).map(([child, childBoundingRect]) =>
    computeComponent(child, childBoundingRect, project, computedComponents),
  )
}
