import BigNumber from 'bignumber.js'

import { getComponentChildren } from '../operations/subProject/utils/getComponentChildren'
import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type {
  ComputedComponentSchema,
  ComputedPanelSchema,
  ComputedPocketClusterSchema,
  ComputedRootPanelSchema,
} from '../schemas/computed'
import type { CornerRadiusSchema, RectSchema } from '../schemas/geometry'
import type { ResolvedStitchLineSchema, StitchLineCommonConfigSchema } from '../schemas/stitching'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { getResolvedStitchLine } from '../utils/getResolvedStitchLine'
import { isDefined } from '../utils/isDefined'
import { applyHolePathsToComputedComponents } from './applyHolePathsToComputedComponents'
import { calculateGap } from './calculateGap'
import { calculateHoles } from './calculateHoles'
import { calculateLayoutBoundingBoxes } from './calculateLayoutBoundingBoxes'
import { calculatePocketClusterGeometry } from './calculatePocketClusterGeometry'
import { calculateRectPath } from './calculateRectPath'
import { getCornerRadius } from './cornerRadiusUtils'
import { getAdjustedCornerRadius } from './getAdjustedCornerRadius'
import { normalizePocketCluster } from './normalizePocketCluster'
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
  parentBoundingRect: RectSchema | undefined,
  parentCornerRadius: CornerRadiusSchema | undefined,
  subProject: SubProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedComponentSchema => {
  if (component.type === 'root-panel' || !isDefined(parentBoundingRect) || !isDefined(parentCornerRadius)) {
    throw new Error('Unexpected parameters')
  }
  switch (component.type) {
    case 'panel':
      return computePanel(
        component,
        boundingRect,
        parentBoundingRect,
        parentCornerRadius,
        subProject,
        resolvedStitchLines,
        computedComponents,
      )
    case 'pocket-cluster':
      return computePocketCluster(
        component,
        boundingRect,
        parentBoundingRect,
        parentCornerRadius,
        resolvedStitchLines,
        computedComponents,
      )
  }
}

const computeRootPanel = (
  rootPanel: RootPanelSchema,
  boundingRect: RectSchema,
  subProject: SubProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedRootPanelSchema => {
  const cornerRadius = getAdjustedCornerRadius({ boundingRect, cornerRadius: getCornerRadius(rootPanel) })
  const path = calculateRectPath(boundingRect, cornerRadius)
  const layoutChildren = assertLayoutChildren(getComponentChildren(rootPanel, subProject))
  const computedLayoutGap = calculateGap(layoutChildren, boundingRect, rootPanel)
  const children = computeLayoutChildren(
    rootPanel,
    boundingRect,
    cornerRadius,
    computedLayoutGap,
    layoutChildren,
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
    cornerRadius,
    computedLayoutGap,
  }

  computedComponents[rootPanel.id] = computed

  return computed
}

const computePanel = (
  panel: PanelSchema,
  boundingRect: RectSchema,
  parentBoundingRect: RectSchema,
  parentCornerRadius: CornerRadiusSchema,
  subProject: SubProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedPanelSchema => {
  const cornerRadius = getAdjustedCornerRadius({
    boundingRect,
    cornerRadius: getCornerRadius(panel),
    parentBoundingRect,
    parentCornerRadius,
  })
  const path = calculateRectPath(boundingRect, cornerRadius)
  const layoutChildren = assertLayoutChildren(getComponentChildren(panel, subProject))
  const computedLayoutGap = calculateGap(layoutChildren, boundingRect, panel)
  const children = computeLayoutChildren(
    panel,
    boundingRect,
    cornerRadius,
    computedLayoutGap,
    layoutChildren,
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
    cornerRadius,
    computedLayoutGap,
  }

  computedComponents[panel.id] = computed

  return computed
}

const computePocketCluster = (
  pocketCluster: PocketClusterSchema,
  boundingRect: RectSchema,
  parentBoundingRect: RectSchema,
  parentCornerRadius: CornerRadiusSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedPocketClusterSchema => {
  const cornerRadius = getAdjustedCornerRadius({
    boundingRect,
    cornerRadius: getCornerRadius(pocketCluster),
    parentBoundingRect,
    parentCornerRadius,
    radiusCap: new BigNumber(pocketCluster.pocketStep),
  })
  const normalizedPocketCluster = normalizePocketCluster(pocketCluster, boundingRect)
  const geometry = calculatePocketClusterGeometry(
    normalizedPocketCluster,
    boundingRect,
    cornerRadius,
    resolvedStitchLines,
  )
  const path = calculateRectPath(boundingRect, cornerRadius)
  const computed: ComputedPocketClusterSchema = {
    type: 'computed-pocket-cluster',
    componentId: pocketCluster.id,
    boundingRect,
    path,
    uncutPath: path,
    cornerRadius,
    frontPocket: geometry.frontPocket,
    tPockets: geometry.tPockets,
  }

  computedComponents[pocketCluster.id] = computed

  return computed
}

const computeLayoutChildren = (
  component: RootPanelSchema | PanelSchema,
  boundingRect: RectSchema,
  cornerRadius: CornerRadiusSchema,
  computedLayoutGap: BigNumber,
  children: (PanelSchema | PocketClusterSchema)[],
  subProject: SubProjectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedComponentSchema[] => {
  const boundingBoxes = calculateLayoutBoundingBoxes({
    component,
    children,
    computedGap: computedLayoutGap,
    boundingRect,
  })

  return children.map((child) =>
    computeComponent(
      child,
      boundingBoxes[child.id],
      boundingRect,
      cornerRadius,
      subProject,
      resolvedStitchLines,
      computedComponents,
    ),
  )
}

const assertLayoutChildren = (children: ComponentSchema[]): (PanelSchema | PocketClusterSchema)[] => {
  return children.map((child) => {
    if (child.type !== 'panel' && child.type !== 'pocket-cluster') {
      throw new Error(`Unsupported child component type: ${child.type}`)
    }

    return child
  })
}
