import BigNumber from 'bignumber.js'

import type { ComponentSchema, PanelSchema, RootPanelSchema } from '../../schemas/components'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import { isDefined } from '../../utils/isDefined'
import type { ComponentSizeRequirement, MagicSizeAxis, StitchRequirementCollection } from './types'

const EPSILON = new BigNumber('0.000001')

type ParentReference = { parentId: string }
type DirectRequirement = ComponentSizeRequirement
type MainAxisRequirement = { componentId: string; parentId: string; axis: MagicSizeAxis; targetSize: BigNumber }
type LayoutResolution = {
  componentSizes: Map<string, Partial<Record<MagicSizeAxis, number>>>
  layoutGaps: Map<string, number>
  conflictingComponentIds: Set<string>
  pocketStepDoesNotFitComponentIds: Set<string>
}

export const resolveLayoutRequirements = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  requirements: StitchRequirementCollection,
): LayoutResolution => {
  const parents = getParents(subProject)
  const direct: DirectRequirement[] = []
  const mainAxis: MainAxisRequirement[] = []
  const conflicts = new Set<string>()
  const pocketStepDoesNotFit = new Set<string>()

  for (const requirement of requirements.sizeRequirements) {
    addSizeRequirement(requirement, subProject, parents, direct, mainAxis)
  }
  for (const requirement of requirements.pocketStepRequirements) {
    const computed = computedSubProject.components[requirement.componentId]
    if (!isDefined(computed)) continue
    const current = requirement.stackAxis === 'width' ? computed.boundingRect.width : computed.boundingRect.height
    if (requirement.minimumStackSize.isGreaterThan(current)) {
      addSizeRequirement(
        { componentId: requirement.componentId, axis: requirement.stackAxis, targetSize: requirement.minimumStackSize },
        subProject,
        parents,
        direct,
        mainAxis,
      )
    }
  }

  const componentSizes = new Map<string, Partial<Record<MagicSizeAxis, number>>>()
  const layoutGaps = new Map<string, number>()
  const directByVariable = groupByVariable(direct)
  const selectedDirect = new Map<string, DirectRequirement>()
  for (const [key, group] of directByVariable) {
    const selected = selectClosestGroup(group, subProject, computedSubProject)
    selectedDirect.set(key, selected)
    for (const requirement of group) {
      if (!requirement.targetSize.minus(selected.targetSize).absoluteValue().isLessThanOrEqualTo(EPSILON))
        conflicts.add(requirement.componentId)
    }
  }

  // A main-axis fill requirement is an equation between its parent's size and gap.
  // We keep the chosen parent size if it has its own stitch requirement, otherwise preserve the gap.
  const mainByParentAxis = new Map<string, MainAxisRequirement[]>()
  for (const requirement of mainAxis) {
    const key = `${requirement.parentId}:${requirement.axis}`
    const group = mainByParentAxis.get(key) ?? []
    group.push(requirement)
    mainByParentAxis.set(key, group)
  }
  for (const [key, group] of mainByParentAxis) {
    const parent = subProject.components[group[0]?.parentId ?? '']
    if (!isDefined(parent) || parent.type === 'pocket-cluster') continue
    const axis = group[0]?.axis
    if (!isDefined(axis)) continue
    const selected = selectClosestMainGroup(group, subProject, computedSubProject)
    for (const requirement of group) {
      if (!requirement.targetSize.minus(selected.targetSize).absoluteValue().isLessThanOrEqualTo(EPSILON))
        conflicts.add(requirement.componentId)
    }
    const fixedTotal = getFixedMainAxisSize(parent, axis, subProject)
    const autoCount = getAutoMainAxisChildCount(parent, axis, subProject)
    const gapCount = new BigNumber(parent.children.length - 1)
    if (autoCount === 0) continue
    const requiredContent = fixedTotal.plus(selected.targetSize.times(autoCount))
    const directRequirement = selectedDirect.get(key)
    const parentCurrent = getCurrentAxisSize(parent, axis, computedSubProject)
    if (!isDefined(parentCurrent)) continue
    if (isDefined(directRequirement)) {
      const nextGap = directRequirement.targetSize.minus(requiredContent).dividedBy(gapCount)
      if (nextGap.isNegative()) {
        for (const requirement of group) conflicts.add(requirement.componentId)
        continue
      }
      layoutGaps.set(parent.id, nextGap.toNumber())
    } else {
      const targetParentSize = requiredContent.plus(new BigNumber(parent.layoutGap).times(gapCount))
      selectedDirect.set(key, { componentId: selected.componentId, axis, targetSize: targetParentSize })
    }
  }

  for (const directRequirement of selectedDirect.values()) {
    if (conflicts.has(directRequirement.componentId)) continue
    setComponentAxis(
      componentSizes,
      directRequirement.componentId,
      directRequirement.axis,
      directRequirement.targetSize.toNumber(),
    )
  }
  for (const requirement of requirements.pocketStepRequirements) {
    if (conflicts.has(requirement.componentId)) pocketStepDoesNotFit.add(requirement.componentId)
  }
  return {
    componentSizes,
    layoutGaps,
    conflictingComponentIds: conflicts,
    pocketStepDoesNotFitComponentIds: pocketStepDoesNotFit,
  }
}

const addSizeRequirement = (
  requirement: ComponentSizeRequirement,
  subProject: SubProjectSchema,
  parents: Map<string, ParentReference>,
  direct: DirectRequirement[],
  mainAxis: MainAxisRequirement[],
): void => {
  const component = subProject.components[requirement.componentId]
  if (!isDefined(component)) return
  if (component.type === 'root-panel' || !isAutoOnAxis(component, requirement.axis)) {
    direct.push(requirement)
    return
  }
  const parentReference = parents.get(component.id)
  const parent = isDefined(parentReference) ? subProject.components[parentReference.parentId] : undefined
  if (!isDefined(parent) || parent.type === 'pocket-cluster') return
  if (parent.layoutOrientation !== getOrientation(requirement.axis)) {
    addSizeRequirement(
      { componentId: parent.id, axis: requirement.axis, targetSize: requirement.targetSize },
      subProject,
      parents,
      direct,
      mainAxis,
    )
    return
  }
  mainAxis.push({
    componentId: requirement.componentId,
    parentId: parent.id,
    axis: requirement.axis,
    targetSize: requirement.targetSize,
  })
}

const getParents = (subProject: SubProjectSchema) => {
  const parents = new Map<string, ParentReference>()
  for (const component of Object.values(subProject.components)) {
    if (component.type === 'pocket-cluster') continue
    for (const childId of component.children) parents.set(childId, { parentId: component.id })
  }
  return parents
}
const groupByVariable = (requirements: DirectRequirement[]) => {
  const groups = new Map<string, DirectRequirement[]>()
  for (const requirement of requirements) {
    const key = `${requirement.componentId}:${requirement.axis}`
    const group = groups.get(key) ?? []
    group.push(requirement)
    groups.set(key, group)
  }
  return groups
}
const selectClosestGroup = (
  requirements: DirectRequirement[],
  subProject: SubProjectSchema,
  computed: ComputedSubProjectSchema,
) =>
  requirements.reduce((best, candidate) => {
    const current =
      getCurrentAxisSize(subProject.components[candidate.componentId], candidate.axis, computed) ?? new BigNumber(0)
    const score = requirements
      .reduce(
        (sum, requirement) => sum.plus(requirement.targetSize.minus(candidate.targetSize).absoluteValue()),
        new BigNumber(0),
      )
      .plus(candidate.targetSize.minus(current).absoluteValue())
    const bestScore = requirements
      .reduce(
        (sum, requirement) => sum.plus(requirement.targetSize.minus(best.targetSize).absoluteValue()),
        new BigNumber(0),
      )
      .plus(best.targetSize.minus(current).absoluteValue())
    return score.isLessThan(bestScore) ||
      (score.isEqualTo(bestScore) && candidate.targetSize.isGreaterThan(best.targetSize))
      ? candidate
      : best
  })
const selectClosestMainGroup = (
  requirements: MainAxisRequirement[],
  subProject: SubProjectSchema,
  computed: ComputedSubProjectSchema,
) =>
  requirements.reduce((best, candidate) => {
    const current =
      getCurrentAxisSize(subProject.components[candidate.componentId], candidate.axis, computed) ?? new BigNumber(0)
    const score = requirements
      .reduce(
        (sum, requirement) => sum.plus(requirement.targetSize.minus(candidate.targetSize).absoluteValue()),
        new BigNumber(0),
      )
      .plus(candidate.targetSize.minus(current).absoluteValue())
    const bestScore = requirements
      .reduce(
        (sum, requirement) => sum.plus(requirement.targetSize.minus(best.targetSize).absoluteValue()),
        new BigNumber(0),
      )
      .plus(best.targetSize.minus(current).absoluteValue())
    return score.isLessThan(bestScore) ||
      (score.isEqualTo(bestScore) && candidate.targetSize.isGreaterThan(best.targetSize))
      ? candidate
      : best
  })
const getFixedMainAxisSize = (
  parent: PanelSchema | RootPanelSchema,
  axis: MagicSizeAxis,
  subProject: SubProjectSchema,
) =>
  parent.children.reduce((total, childId) => {
    const child = subProject.components[childId]
    return isDefined(child) && !isAutoOnAxis(child, axis) ? total.plus(child[axis]) : total
  }, new BigNumber(0))
const getAutoMainAxisChildCount = (
  parent: PanelSchema | RootPanelSchema,
  axis: MagicSizeAxis,
  subProject: SubProjectSchema,
) =>
  parent.children.filter((childId) => {
    const child = subProject.components[childId]
    return isDefined(child) && isAutoOnAxis(child, axis)
  }).length
const getCurrentAxisSize = (
  component: ComponentSchema | undefined,
  axis: MagicSizeAxis,
  computed: ComputedSubProjectSchema,
) =>
  isDefined(component)
    ? axis === 'width'
      ? computed.components[component.id]?.boundingRect.width
      : computed.components[component.id]?.boundingRect.height
    : undefined
const isAutoOnAxis = (component: ComponentSchema, axis: MagicSizeAxis) =>
  component.type !== 'root-panel' && (axis === 'width' ? component.autoWidth : component.autoHeight)
const getOrientation = (axis: MagicSizeAxis) => (axis === 'width' ? 'horizontal' : 'vertical')
const setComponentAxis = (
  updates: Map<string, Partial<Record<MagicSizeAxis, number>>>,
  componentId: string,
  axis: MagicSizeAxis,
  value: number,
) => updates.set(componentId, { ...(updates.get(componentId) ?? {}), [axis]: value })
