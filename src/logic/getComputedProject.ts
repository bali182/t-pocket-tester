import BigNumber from 'bignumber.js'

import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type {
  ComputedComponentSchema,
  ComputedPanelSchema,
  ComputedPocketClusterSchema,
  ComputedRootPanelSchema,
} from '../schemas/computed'
import type { RectSchema } from '../schemas/geometry'
import type { ResolvedStitchLineSchema, StitchLineCommonConfigSchema } from '../schemas/stitching'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { getResolvedStitchLine } from '../utils/getResolvedStitchLine'
import { isDefined } from '../utils/isDefined'
import { applyHolePathsToComputedComponents } from './applyHolePathsToComputedComponents'
import { calculateHoles } from './calculateHoles'
import { calculateLayoutBoundingBoxes } from './calculateLayoutBoundingBoxes'
import { calculatePocketClusterGeometry } from './calculatePocketClusterGeometry'
import { calculateRectPath } from './calculateRectPath'
import { getNormalizedCornerRadius } from './cornerRadiusUtils'
import { calculateStitchLines } from './stitching/calculateStitchLines'

export const getComputedSubProject = (
  subProject: SubProjectSchema,
  stitchingSettings: StitchLineCommonConfigSchema,
): ComputedSubProjectSchema => {
  const rootComponent = subProject.components[subProject.root]

  if (!isDefined(rootComponent) || rootComponent.type !== 'root-panel') {
    throw new Error(`Root component not found: ${subProject.root}`)
  }

  const computedComponents: Record<string, ComputedComponentSchema> = {}
  const resolvedStitchLines = subProject.stitchLines.map((stitchLine) =>
    getResolvedStitchLine(stitchLine, stitchingSettings),
  )
  const rootBoundingRect: RectSchema = {
    x: new BigNumber(0),
    y: new BigNumber(0),
    width: new BigNumber(rootComponent.width),
    height: new BigNumber(rootComponent.height),
  }
  const root = computeRootPanel(rootComponent, rootBoundingRect, subProject, resolvedStitchLines, computedComponents)
  const holes = calculateHoles(subProject.holes, computedComponents)
  const stitchLines = calculateStitchLines(
    resolvedStitchLines,
    subProject.components,
    computedComponents,
    subProject.holes,
    holes,
  )
  applyHolePathsToComputedComponents(computedComponents, holes)

  return {
    id: subProject.id,
    root: root.componentId,
    components: computedComponents,
    holes,
    stitchLines,
  }
}

const computeComponent = (
  component: ComponentSchema,
  boundingRect: RectSchema,
  subProject: SubProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedComponentSchema => {
  switch (component.type) {
    case 'root-panel':
      return computeRootPanel(component, boundingRect, subProject, resolvedStitchLines, computedComponents)
    case 'panel':
      return computePanel(component, boundingRect, subProject, resolvedStitchLines, computedComponents)
    case 'pocket-cluster':
      return computePocketCluster(component, boundingRect, resolvedStitchLines, computedComponents)
  }
}

const computeRootPanel = (
  rootPanel: RootPanelSchema,
  boundingRect: RectSchema,
  subProject: SubProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedRootPanelSchema => {
  const path = calculateRectPath(boundingRect, getNormalizedCornerRadius(rootPanel))
  const { children, computedLayoutGap } = computeLayoutChildren(
    rootPanel,
    boundingRect,
    subProject,
    resolvedStitchLines,
    computedComponents,
  )
  const computed: ComputedRootPanelSchema = {
    type: 'computed-root-panel',
    componentId: rootPanel.id,
    boundingRect,
    path,
    uncutPath: path,
    children,
    computedLayoutGap,
  }

  computedComponents[rootPanel.id] = computed

  return computed
}

const computePanel = (
  panel: PanelSchema,
  boundingRect: RectSchema,
  subProject: SubProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedPanelSchema => {
  const path = calculateRectPath(boundingRect, getNormalizedCornerRadius(panel))
  const { children, computedLayoutGap } = computeLayoutChildren(
    panel,
    boundingRect,
    subProject,
    resolvedStitchLines,
    computedComponents,
  )
  const computed: ComputedPanelSchema = {
    type: 'computed-panel',
    componentId: panel.id,
    boundingRect,
    path,
    uncutPath: path,
    children,
    computedLayoutGap,
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
  const path = calculateRectPath(boundingRect, getNormalizedCornerRadius(pocketCluster))
  const computed: ComputedPocketClusterSchema = {
    type: 'computed-pocket-cluster',
    componentId: pocketCluster.id,
    boundingRect,
    path,
    uncutPath: path,
    frontPocket: geometry.frontPocket,
    tPockets: geometry.tPockets,
  }

  computedComponents[pocketCluster.id] = computed

  return computed
}

type ComputedLayoutChildren = {
  children: ComputedComponentSchema[]
  computedLayoutGap: BigNumber
}

const computeLayoutChildren = (
  component: RootPanelSchema | PanelSchema,
  boundingRect: RectSchema,
  subProject: SubProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedLayoutChildren => {
  const [boundingBoxes, computedLayoutGap] = calculateLayoutBoundingBoxes(component, subProject, boundingRect)

  return {
    children: boundingBoxes.map(([child, childBoundingRect]) =>
      computeComponent(child, childBoundingRect, subProject, resolvedStitchLines, computedComponents),
    ),
    computedLayoutGap,
  }
}
