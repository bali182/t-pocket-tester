import type {
  ComponentSchema,
  PanelSchema,
  PocketClusterSchema,
  RootPanelSchema,
} from '../schemas/components'
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

export const getComputedProject = (project: ProjectSchema): ComputedProjectSchema => {
  const rootComponent = project.components[project.root]

  if (!isDefined(rootComponent) || rootComponent.type !== 'root-panel') {
    throw new Error(`Root component not found: ${project.root}`)
  }

  const computedComponents: Record<string, ComputedComponentSchema> = {}
  const rootBoundingRect: RectSchema = {
    x: 0,
    y: 0,
    width: rootComponent.size.width,
    height: rootComponent.size.height,
  }
  const root = computeRootPanel(rootComponent, rootBoundingRect, project, computedComponents)

  return {
    id: project.id,
    name: project.name,
    root: root.componentId,
    components: computedComponents,
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
    type: 'root-panel',
    componentId: rootPanel.id,
    boundingRect,
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
    type: 'panel',
    componentId: panel.id,
    boundingRect,
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
    type: 'pocket-cluster',
    componentId: pocketCluster.id,
    boundingRect,
    frontPocket: geometry.topPocketRect,
    tPockets: geometry.tPocketPolygons,
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
