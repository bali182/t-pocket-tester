import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import { isDefined } from '../../utils/isDefined'
import { resolveLayoutRequirements } from './resolveLayoutRequirements'
import { resolveStitchGeometryRequirements } from './resolveStitchGeometryRequirements'
import type { MagicStitchLineFixPlan, StitchRequirementCollection } from './types'

export const buildMagicStitchLineFixPlan = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  requirements: StitchRequirementCollection,
): MagicStitchLineFixPlan => {
  const geometryResolution = resolveStitchGeometryRequirements(requirements.geometryRequirements)
  const resolution = resolveLayoutRequirements(subProject, computedSubProject, {
    ...requirements,
    sizeRequirements: [...requirements.sizeRequirements, ...geometryResolution.sizeRequirements],
    offsetRequirements: [...requirements.offsetRequirements, ...geometryResolution.offsetRequirements],
  })
  const skipped = new Set(requirements.skippedComponentIds)
  const issues = [...requirements.issues]
  for (const componentId of resolution.pocketStepDoesNotFitComponentIds) {
    if (!skipped.has(componentId)) {
      skipped.add(componentId)
      const component = subProject.components[componentId]
      console.log(`Magic stitch line fix skipped ${component?.name ?? componentId}: pocket step does not fit.`)
      issues.push({ componentId, reason: 'pocket-step-does-not-fit' })
    }
  }
  for (const componentId of geometryResolution.conflictingComponentIds) {
    if (!skipped.has(componentId)) {
      skipped.add(componentId)
      issues.push({ componentId, reason: 'conflicting-stitch-geometry' })
    }
  }
  for (const componentId of resolution.conflictingComponentIds) {
    if (!skipped.has(componentId)) {
      skipped.add(componentId)
      issues.push({ componentId, reason: 'conflicting-layout-constraints' })
    }
  }
  const componentUpdates = new Map()
  for (const [componentId, axes] of resolution.componentSizes) {
    if (skipped.has(componentId)) continue
    const component = subProject.components[componentId]
    if (isDefined(component)) componentUpdates.set(componentId, { ...component, ...axes })
  }
  for (const [componentId, gap] of resolution.layoutGaps) {
    const component = componentUpdates.get(componentId) ?? subProject.components[componentId]
    if (isDefined(component) && component.type !== 'pocket-cluster')
      componentUpdates.set(componentId, { ...component, layoutGap: gap })
  }
  for (const requirement of requirements.pocketStepRequirements) {
    if (skipped.has(requirement.componentId)) continue
    const component = componentUpdates.get(requirement.componentId) ?? subProject.components[requirement.componentId]
    if (isDefined(component) && component.type === 'pocket-cluster')
      componentUpdates.set(requirement.componentId, { ...component, pocketStep: requirement.value })
  }
  const stitchLineUpdates = new Map()
  for (const requirement of [...requirements.offsetRequirements, ...geometryResolution.offsetRequirements]) {
    if (skipped.has(requirement.componentId)) continue
    const updates = stitchLineUpdates.get(requirement.stitchLineId) ?? {}
    stitchLineUpdates.set(requirement.stitchLineId, { ...updates, [requirement.key]: requirement.value })
  }
  return { componentUpdates, stitchLineUpdates, issues }
}
