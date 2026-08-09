import BigNumber from 'bignumber.js'

import type { ComponentSchema, PocketClusterSchema } from '../../schemas/components'
import type { ComputedComponentSchema } from '../../schemas/computed'
import type { ProjectSchema } from '../../schemas/project'
import type {
  ComponentBoundsStitchLineSchema,
  ResolvedComponentBoundsStitchLineSchema,
  StitchSideSchema,
} from '../../schemas/stitching'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import { getResolvedStitchLine } from '../../utils/getResolvedStitchLine'
import { isDefined } from '../../utils/isDefined'
import { getNormalizedCornerRadius } from '../cornerRadiusUtils'
import { calculateComponentBoundsStitchLine } from '../stitching/calculateComponentBoundsStitchLine'
import type {
  ComponentAxisStitchGeometryRequirement,
  ComponentSizeRequirement,
  MagicSizeAxis,
  PocketStepRequirement,
  StitchGeometrySideRequirement,
  StitchOffsetKey,
  StitchOffsetRequirement,
  StitchRequirementCollection,
} from './types'

const ZERO = new BigNumber(0)

type ComponentRequirements = {
  sizeRequirements: ComponentSizeRequirement[]
  offsetRequirements: StitchOffsetRequirement[]
  geometrySides: StitchGeometrySideRequirement[]
}

export const collectStitchRequirements = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
): StitchRequirementCollection => {
  const collection: StitchRequirementCollection = {
    sizeRequirements: [],
    geometryRequirements: [],
    offsetRequirements: [],
    pocketStepRequirements: [],
    issues: [],
    skippedComponentIds: new Set<string>(),
  }
  const geometryRequirementsByAxis = new Map<string, ComponentAxisStitchGeometryRequirement>()

  for (const [componentId, component] of Object.entries(subProject.components)) {
    const computedComponent = computedSubProject.components[componentId]
    if (!isDefined(computedComponent)) continue
    const stitchLines = getComponentStitchLines(componentId, project, subProject)
    if (stitchLines.length === 0) continue

    if (!hasCompatibleStitchConfiguration(stitchLines)) {
      console.log(`Magic stitch line fix skipped ${component.name}: incompatible stitch configurations.`)
      addIssue(collection, componentId, 'incompatible-stitch-configurations')
      continue
    }

    for (const stitchLine of stitchLines) {
      const requirements = getStitchLineRequirements(component, computedComponent, stitchLine)
      collection.sizeRequirements.push(...requirements.sizeRequirements)
      collection.offsetRequirements.push(...requirements.offsetRequirements)
      for (const side of requirements.geometrySides) {
        const key = `${side.componentId}:${side.axis}`
        const existing = geometryRequirementsByAxis.get(key)
        if (isDefined(existing)) {
          existing.sides.push(side)
        } else {
          const currentSize =
            side.axis === 'width' ? computedComponent.boundingRect.width : computedComponent.boundingRect.height
          geometryRequirementsByAxis.set(key, {
            componentId: component.id,
            axis: side.axis,
            currentSize,
            sides: [side],
          })
        }
      }
    }

    if (component.type === 'pocket-cluster') {
      const pocketRequirement = getPocketStepRequirement(component, computedComponent, stitchLines)
      if (isDefined(pocketRequirement)) collection.pocketStepRequirements.push(pocketRequirement)
    }
  }
  collection.geometryRequirements.push(...geometryRequirementsByAxis.values())
  return collection
}

const getComponentStitchLines = (componentId: string, project: ProjectSchema, subProject: SubProjectSchema) =>
  subProject.stitchLines
    .filter(
      (stitchLine): stitchLine is ComponentBoundsStitchLineSchema =>
        stitchLine.type === 'component-bounds-stitch-line' &&
        stitchLine.targetType === 'component' &&
        stitchLine.targetId === componentId,
    )
    .map((stitchLine) => {
      const resolved = getResolvedStitchLine(stitchLine, project.stitchingSettings)
      if (resolved.type !== 'component-bounds-stitch-line') throw new Error('Expected a component bounds stitch line')
      return resolved
    })

const hasCompatibleStitchConfiguration = (stitchLines: ResolvedComponentBoundsStitchLineSchema[]) => {
  const first = stitchLines[0]
  return (
    !isDefined(first) ||
    stitchLines.every(
      (line) => line.stitchMargin === first.stitchMargin && line.stitchHoleDistance === first.stitchHoleDistance,
    )
  )
}

const getStitchLineRequirements = (
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
  stitchLine: ResolvedComponentBoundsStitchLineSchema,
): ComponentRequirements => {
  const sizeRequirements: ComponentSizeRequirement[] = []
  const offsetRequirements: StitchOffsetRequirement[] = []
  const distance = new BigNumber(stitchLine.stitchHoleDistance)
  const margin = new BigNumber(stitchLine.stitchMargin)
  const geometrySides: StitchGeometrySideRequirement[] = []
  if (!distance.isGreaterThan(ZERO)) return { sizeRequirements, offsetRequirements, geometrySides }

  if (areAllCornersConnected(stitchLine) && !hasRoundedStitchCorner(component, stitchLine)) {
    sizeRequirements.push(
      createSharpRequirement(component.id, 'width', computedComponent.boundingRect.width, margin, distance),
      createSharpRequirement(component.id, 'height', computedComponent.boundingRect.height, margin, distance),
    )
    return { sizeRequirements, offsetRequirements, geometrySides }
  }

  if (areAllCornersConnected(stitchLine) && hasRoundedStitchCorner(component, stitchLine)) {
    const roundedRequirements = getRoundedClosedRouteRequirements(component, computedComponent, stitchLine)
    sizeRequirements.push(...roundedRequirements)
    return { sizeRequirements, offsetRequirements, geometrySides }
  }

  for (const side of getSelectedSides(stitchLine)) {
    const startKey = getSideStartOffsetKey(side)
    const endKey = getSideEndOffsetKey(side)
    geometrySides.push({
      componentId: component.id,
      axis: getSideAxis(side),
      stitchLineId: stitchLine.id,
      stitchMargin: margin,
      stitchHoleDistance: distance,
      start: createEndpointRequirement(
        startKey,
        new BigNumber(stitchLine[startKey]),
        isSideStartConnectedToCorner(stitchLine, side),
        margin,
        distance,
      ),
      end: createEndpointRequirement(
        endKey,
        new BigNumber(stitchLine[endKey]),
        isSideEndConnectedToCorner(stitchLine, side),
        margin,
        distance,
      ),
    })
  }
  return { sizeRequirements, offsetRequirements, geometrySides }
}

const createEndpointRequirement = (
  key: StitchOffsetKey,
  originalOffset: BigNumber,
  isCorner: boolean,
  margin: BigNumber,
  distance: BigNumber,
) => {
  const minimumEdgeDistance = BigNumber.minimum(distance.dividedBy(2), margin)
  const isOutside = originalOffset.isGreaterThan(margin)
  return {
    key,
    originalOffset,
    normalizedOffset: isCorner ? ZERO : getNormalizedFreeEndpointOffset(originalOffset, margin, distance),
    isFlexible: !isCorner && !isOutside,
    maximumOffset: margin.minus(minimumEdgeDistance),
  }
}

const getPocketStepRequirement = (
  pocketCluster: PocketClusterSchema,
  computedComponent: ComputedComponentSchema,
  stitchLines: ResolvedComponentBoundsStitchLineSchema[],
): PocketStepRequirement | undefined => {
  const line = stitchLines.find((candidate) => isPerpendicularPocketStitchLine(pocketCluster, candidate))
  if (!isDefined(line)) return undefined
  const distance = new BigNumber(line.stitchHoleDistance)
  if (!distance.isGreaterThan(ZERO)) return undefined
  const value = BigNumber.maximum(getNearestMultiple(new BigNumber(pocketCluster.pocketStep), distance), distance)
  const stackAxis: MagicSizeAxis =
    pocketCluster.orientation === 'up' || pocketCluster.orientation === 'down' ? 'height' : 'width'
  return {
    componentId: pocketCluster.id,
    value: value.toNumber(),
    stackAxis,
    minimumStackSize: value.times(new BigNumber(pocketCluster.pocketCount).minus(1)),
  }
}

const getRoundedClosedRouteRequirements = (
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
  stitchLine: ResolvedComponentBoundsStitchLineSchema,
): ComponentSizeRequirement[] => {
  const distance = new BigNumber(stitchLine.stitchHoleDistance)
  const initialWidth = computedComponent.boundingRect.width
  const initialHeight = computedComponent.boundingRect.height
  let candidate = {
    width: initialWidth,
    height: initialHeight,
    error: getClosedRouteError(component, computedComponent, stitchLine, initialWidth, initialHeight),
  }
  let step = distance.dividedBy(2)

  // This searches only virtual route geometry. It does not apply or recompute layout.
  while (step.isGreaterThan('0.0000001')) {
    let improved = true
    while (improved) {
      improved = false
      const candidates = [
        { width: candidate.width.plus(step), height: candidate.height },
        { width: candidate.width.minus(step), height: candidate.height },
        { width: candidate.width, height: candidate.height.plus(step) },
        { width: candidate.width, height: candidate.height.minus(step) },
      ].filter((size) => size.width.isGreaterThan(0) && size.height.isGreaterThan(0))
      for (const size of candidates) {
        const error = getClosedRouteError(component, computedComponent, stitchLine, size.width, size.height)
        if (error.isLessThan(candidate.error)) {
          candidate = { ...size, error }
          improved = true
        }
      }
    }
    step = step.dividedBy(2)
  }
  if (candidate.error.isGreaterThan('0.000001')) return []
  return [
    { componentId: component.id, axis: 'width', targetSize: candidate.width },
    { componentId: component.id, axis: 'height', targetSize: candidate.height },
  ]
}

const getClosedRouteError = (
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
  stitchLine: ResolvedComponentBoundsStitchLineSchema,
  width: BigNumber,
  height: BigNumber,
): BigNumber => {
  const line = calculateComponentBoundsStitchLine(stitchLine, {
    componentId: component.id,
    boundingRect: { ...computedComponent.boundingRect, width, height },
    cornerRadius: getNormalizedCornerRadius(component),
  })
  const holes = line.routes.flatMap((route) => route.holes)
  const first = holes[0]
  const last = holes[holes.length - 1]
  if (!isDefined(first) || !isDefined(last)) return new BigNumber(Infinity)
  const closure = first.center.x
    .minus(last.center.x)
    .pow(2)
    .plus(first.center.y.minus(last.center.y).pow(2))
    .squareRoot()
  return closure.minus(stitchLine.stitchHoleDistance).absoluteValue()
}

const areAllCornersConnected = (line: ResolvedComponentBoundsStitchLineSchema) =>
  line.top &&
  line.right &&
  line.bottom &&
  line.left &&
  line.topLeftCorner &&
  line.topRightCorner &&
  line.bottomRightCorner &&
  line.bottomLeftCorner
const hasRoundedStitchCorner = (component: ComponentSchema, line: ResolvedComponentBoundsStitchLineSchema) => {
  const radii = component.individualRadii
    ? [component.topLeftRadius, component.topRightRadius, component.bottomRightRadius, component.bottomLeftRadius]
    : [component.borderRadius]
  return areAllCornersConnected(line) && radii.some((radius) => new BigNumber(radius).isGreaterThan(line.stitchMargin))
}
const createSharpRequirement = (
  componentId: string,
  axis: MagicSizeAxis,
  currentSize: BigNumber,
  margin: BigNumber,
  distance: BigNumber,
): ComponentSizeRequirement => ({
  componentId,
  axis,
  targetSize: margin.times(2).plus(getNearestMultiple(currentSize.minus(margin.times(2)), distance)),
})
const getSelectedSides = (line: ResolvedComponentBoundsStitchLineSchema): StitchSideSchema[] => {
  const sides: StitchSideSchema[] = []
  if (line.top) sides.push('top')
  if (line.right) sides.push('right')
  if (line.bottom) sides.push('bottom')
  if (line.left) sides.push('left')
  return sides
}
const isSideStartConnectedToCorner = (line: ResolvedComponentBoundsStitchLineSchema, side: StitchSideSchema) =>
  ({
    top: line.topLeftCorner,
    right: line.topRightCorner,
    bottom: line.bottomRightCorner,
    left: line.bottomLeftCorner,
  })[side]
const isSideEndConnectedToCorner = (line: ResolvedComponentBoundsStitchLineSchema, side: StitchSideSchema) =>
  ({
    top: line.topRightCorner,
    right: line.bottomRightCorner,
    bottom: line.bottomLeftCorner,
    left: line.topLeftCorner,
  })[side]
const getSideStartOffsetKey = (side: StitchSideSchema): StitchOffsetKey => {
  switch (side) {
    case 'top':
      return 'topStartOffset'
    case 'right':
      return 'rightStartOffset'
    case 'bottom':
      return 'bottomStartOffset'
    case 'left':
      return 'leftStartOffset'
  }
}
const getSideEndOffsetKey = (side: StitchSideSchema): StitchOffsetKey => {
  switch (side) {
    case 'top':
      return 'topEndOffset'
    case 'right':
      return 'rightEndOffset'
    case 'bottom':
      return 'bottomEndOffset'
    case 'left':
      return 'leftEndOffset'
  }
}
const getSideAxis = (side: StitchSideSchema): MagicSizeAxis =>
  side === 'top' || side === 'bottom' ? 'width' : 'height'
const getNormalizedFreeEndpointOffset = (offset: BigNumber, margin: BigNumber, distance: BigNumber) => {
  const minimum = BigNumber.minimum(distance.dividedBy(2), margin)
  if (offset.isGreaterThan(margin)) {
    const first = margin.plus(distance.dividedBy(2))
    return first.plus(
      BigNumber.maximum(getNearestInteger(offset.minus(first).dividedBy(distance)), ZERO).times(distance),
    )
  }
  return BigNumber.minimum(offset, margin.minus(minimum))
}
const getNearestInteger = (value: BigNumber) => {
  const lower = value.integerValue(BigNumber.ROUND_FLOOR)
  const upper = value.integerValue(BigNumber.ROUND_CEIL)
  return upper.minus(value).absoluteValue().isLessThanOrEqualTo(value.minus(lower).absoluteValue()) ? upper : lower
}
const getNearestMultiple = (value: BigNumber, step: BigNumber) => {
  const safe = BigNumber.maximum(value, ZERO)
  return getNearestInteger(safe.dividedBy(step)).times(step)
}
const isPerpendicularPocketStitchLine = (
  cluster: PocketClusterSchema,
  line: ResolvedComponentBoundsStitchLineSchema,
) =>
  cluster.orientation === 'up' || cluster.orientation === 'down' ? line.left || line.right : line.top || line.bottom
const addIssue = (
  collection: StitchRequirementCollection,
  componentId: string,
  reason: 'incompatible-stitch-configurations',
) => {
  if (collection.skippedComponentIds.has(componentId)) return
  collection.skippedComponentIds.add(componentId)
  collection.issues.push({ componentId, reason })
}
