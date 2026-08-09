import BigNumber from 'bignumber.js'

import type {
  ComponentAxisStitchGeometryRequirement,
  ComponentSizeRequirement,
  StitchGeometryEndpointRequirement,
  StitchOffsetRequirement,
} from './types'

const EPSILON = new BigNumber('0.000001')

type GeometryResolution = {
  sizeRequirements: ComponentSizeRequirement[]
  offsetRequirements: StitchOffsetRequirement[]
  conflictingComponentIds: Set<string>
}

type GeometryCandidate = {
  size: BigNumber
  offsetRequirements: StitchOffsetRequirement[]
  offsetDelta: BigNumber
}

export const resolveStitchGeometryRequirements = (
  requirements: ComponentAxisStitchGeometryRequirement[],
): GeometryResolution => {
  const sizeRequirements: ComponentSizeRequirement[] = []
  const offsetRequirements: StitchOffsetRequirement[] = []
  const conflictingComponentIds = new Set<string>()

  for (const requirement of requirements) {
    const candidate = getBestCandidate(requirement)
    if (!candidate) {
      conflictingComponentIds.add(requirement.componentId)
      continue
    }
    sizeRequirements.push({
      componentId: requirement.componentId,
      axis: requirement.axis,
      targetSize: candidate.size,
    })
    offsetRequirements.push(...candidate.offsetRequirements)
  }
  return { sizeRequirements, offsetRequirements, conflictingComponentIds }
}

const getBestCandidate = (requirement: ComponentAxisStitchGeometryRequirement): GeometryCandidate | undefined => {
  const sizes = getCandidateSizes(requirement)
  let best: GeometryCandidate | undefined
  for (const size of sizes) {
    const candidate = getCandidateForSize(requirement, size)
    if (!candidate) continue
    if (!best || isBetterCandidate(candidate, best, requirement.currentSize)) best = candidate
  }
  return best
}

const getCandidateSizes = (requirement: ComponentAxisStitchGeometryRequirement): BigNumber[] => {
  const sizes = [requirement.currentSize]
  for (const side of requirement.sides) {
    if (side.start.isFlexible || side.end.isFlexible) continue
    const base = side.stitchMargin.times(2).minus(side.start.normalizedOffset).minus(side.end.normalizedOffset)
    const currentCount = requirement.currentSize
      .minus(base)
      .dividedBy(side.stitchHoleDistance)
      .integerValue(BigNumber.ROUND_HALF_UP)
    for (let adjustment = -2; adjustment <= 2; adjustment += 1) {
      sizes.push(base.plus(currentCount.plus(adjustment).times(side.stitchHoleDistance)))
    }
  }
  return sizes.filter((size) => size.isGreaterThan(0))
}

const getCandidateForSize = (
  requirement: ComponentAxisStitchGeometryRequirement,
  size: BigNumber,
): GeometryCandidate | undefined => {
  const offsetRequirements: StitchOffsetRequirement[] = []
  let offsetDelta = new BigNumber(0)
  for (const side of requirement.sides) {
    const sideResolution = resolveSide(side, size)
    if (!sideResolution) return undefined
    offsetRequirements.push(...sideResolution.offsetRequirements)
    offsetDelta = offsetDelta.plus(sideResolution.offsetDelta)
  }
  return { size, offsetRequirements, offsetDelta }
}

const resolveSide = (side: ComponentAxisStitchGeometryRequirement['sides'][number], size: BigNumber) => {
  const baseLength = size.minus(side.stitchMargin.times(2))
  const estimatedCount = baseLength
    .plus(side.start.normalizedOffset)
    .plus(side.end.normalizedOffset)
    .dividedBy(side.stitchHoleDistance)
    .integerValue(BigNumber.ROUND_HALF_UP)
  let best: { offsetRequirements: StitchOffsetRequirement[]; offsetDelta: BigNumber } | undefined
  for (let adjustment = -2; adjustment <= 2; adjustment += 1) {
    const requiredOffsetSum = estimatedCount.plus(adjustment).times(side.stitchHoleDistance).minus(baseLength)
    const resolution = resolveEndpoints(side.start, side.end, requiredOffsetSum, side.componentId, side.stitchLineId)
    if (!resolution) continue
    if (!best || resolution.offsetDelta.isLessThan(best.offsetDelta)) best = resolution
  }
  return best
}

const resolveEndpoints = (
  start: StitchGeometryEndpointRequirement,
  end: StitchGeometryEndpointRequirement,
  requiredSum: BigNumber,
  componentId: string,
  stitchLineId: string,
) => {
  if (!start.isFlexible && !end.isFlexible) {
    if (!start.normalizedOffset.plus(end.normalizedOffset).minus(requiredSum).absoluteValue().isGreaterThan(EPSILON)) {
      return {
        offsetRequirements: getOffsetRequirements(
          [
            { endpoint: start, value: start.normalizedOffset },
            { endpoint: end, value: end.normalizedOffset },
          ],
          componentId,
          stitchLineId,
        ),
        offsetDelta: new BigNumber(0),
      }
    }
    return undefined
  }
  const fixedStart = start.isFlexible ? new BigNumber(0) : start.normalizedOffset
  const fixedEnd = end.isFlexible ? new BigNumber(0) : end.normalizedOffset
  const flexibleSum = requiredSum.minus(fixedStart).minus(fixedEnd)
  const values = getFlexibleEndpointValues(start, end, flexibleSum)
  if (!values) return undefined
  const endpoints = [
    { endpoint: start, value: values.start },
    { endpoint: end, value: values.end },
  ]
  const offsetRequirements = getOffsetRequirements(endpoints, componentId, stitchLineId)
  const offsetDelta = endpoints.reduce(
    (sum, { endpoint, value }) => sum.plus(value.minus(endpoint.originalOffset).absoluteValue()),
    new BigNumber(0),
  )
  return { offsetRequirements, offsetDelta }
}

const getOffsetRequirements = (
  endpoints: { endpoint: StitchGeometryEndpointRequirement; value: BigNumber }[],
  componentId: string,
  stitchLineId: string,
): StitchOffsetRequirement[] =>
  endpoints.flatMap(({ endpoint, value }) =>
    !value.isEqualTo(endpoint.originalOffset)
      ? [{ componentId, stitchLineId, key: endpoint.key, value: value.toNumber() }]
      : [],
  )

const getFlexibleEndpointValues = (
  start: StitchGeometryEndpointRequirement,
  end: StitchGeometryEndpointRequirement,
  sum: BigNumber,
) => {
  if (!start.isFlexible) return { start: start.normalizedOffset, end: sum }
  if (!end.isFlexible) return { start: sum, end: end.normalizedOffset }
  const startUpperDelta = start.maximumOffset.minus(start.originalOffset)
  const endUpperDelta = end.maximumOffset.minus(end.originalOffset)
  const delta = sum.minus(start.originalOffset).minus(end.originalOffset)
  const lower = delta.minus(endUpperDelta)
  const upper = startUpperDelta
  if (lower.isGreaterThan(upper)) return undefined
  const startDelta = BigNumber.minimum(BigNumber.maximum(new BigNumber(0), lower), upper)
  return { start: start.originalOffset.plus(startDelta), end: end.originalOffset.plus(delta).minus(startDelta) }
}

const isBetterCandidate = (candidate: GeometryCandidate, current: GeometryCandidate, originalSize: BigNumber) => {
  const candidateSizeDelta = candidate.size.minus(originalSize).absoluteValue()
  const currentSizeDelta = current.size.minus(originalSize).absoluteValue()
  return (
    candidateSizeDelta.isLessThan(currentSizeDelta) ||
    (candidateSizeDelta.isEqualTo(currentSizeDelta) &&
      (candidate.offsetDelta.isLessThan(current.offsetDelta) ||
        (candidate.offsetDelta.isEqualTo(current.offsetDelta) && candidate.size.isGreaterThan(current.size))))
  )
}
