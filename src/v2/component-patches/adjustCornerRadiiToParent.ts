import BigNumber from 'bignumber.js'

import { getNormalizedCornerRadius } from '../logic/getNormalizedCornerRadius'
import type { ComponentSchema, PanelSchema, RootPanelSchema } from '../schemas/components'
import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'

export const adjustCornerRadiiToParent = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
): ProjectSchema => {
  if (!project.editingSettings.adjustCornerRadiiToParent) {
    return project
  }

  let components = project.components

  const visitChildren = (parent: RootPanelSchema | PanelSchema): void => {
    const parentBoundingRect = computedProject.components[parent.id].boundingRect
    const parentCorners = getNormalizedCornerRadius(parent)

    const parentLeft = parentBoundingRect.x
    const parentTop = parentBoundingRect.y
    const parentWidth = parentBoundingRect.width
    const parentHeight = parentBoundingRect.height
    const parentRight = parentLeft.plus(parentWidth)
    const parentBottom = parentTop.plus(parentHeight)

    const parentTopLeftRadius = new BigNumber(parentCorners.topLeft)
    const parentTopRightRadius = new BigNumber(parentCorners.topRight)
    const parentBottomLeftRadius = new BigNumber(parentCorners.bottomLeft)
    const parentBottomRightRadius = new BigNumber(parentCorners.bottomRight)

    for (const childId of parent.children) {
      const child = components[childId]

      if (!isDefined(child)) {
        throw new Error(`Child component not found: ${childId}`)
      }

      const childBoundingRect = computedProject.components[childId].boundingRect

      const childLeft = childBoundingRect.x
      const childTop = childBoundingRect.y
      const childWidth = childBoundingRect.width
      const childHeight = childBoundingRect.height
      const childRight = childLeft.plus(childWidth)
      const childBottom = childTop.plus(childHeight)

      const touchesLeft = childLeft.isEqualTo(parentLeft)
      const touchesRight = childRight.isEqualTo(parentRight)
      const touchesTop = childTop.isEqualTo(parentTop)
      const touchesBottom = childBottom.isEqualTo(parentBottom)

      const touchesTopLeft = touchesTop && touchesLeft
      const touchesTopRight = touchesTop && touchesRight
      const touchesBottomLeft = touchesBottom && touchesLeft
      const touchesBottomRight = touchesBottom && touchesRight

      const topLeftRadius =
        touchesTopLeft && new BigNumber(child.topLeftRadius).isLessThan(parentTopLeftRadius)
          ? parentTopLeftRadius.toNumber()
          : child.topLeftRadius

      const topRightRadius =
        touchesTopRight && new BigNumber(child.topRightRadius).isLessThan(parentTopRightRadius)
          ? parentTopRightRadius.toNumber()
          : child.topRightRadius

      const bottomLeftRadius =
        touchesBottomLeft && new BigNumber(child.bottomLeftRadius).isLessThan(parentBottomLeftRadius)
          ? parentBottomLeftRadius.toNumber()
          : child.bottomLeftRadius

      const bottomRightRadius =
        touchesBottomRight && new BigNumber(child.bottomRightRadius).isLessThan(parentBottomRightRadius)
          ? parentBottomRightRadius.toNumber()
          : child.bottomRightRadius

      const borderRadiusTargets = [
        new BigNumber(child.borderRadius),
        ...(touchesTopLeft ? [parentTopLeftRadius] : []),
        ...(touchesTopRight ? [parentTopRightRadius] : []),
        ...(touchesBottomLeft ? [parentBottomLeftRadius] : []),
        ...(touchesBottomRight ? [parentBottomRightRadius] : []),
      ]

      const maximumBorderRadius = BigNumber.maximum(...borderRadiusTargets)
      const borderRadius = maximumBorderRadius.isEqualTo(child.borderRadius)
        ? child.borderRadius
        : maximumBorderRadius.toNumber()

      const borderRadiiMatch =
        topLeftRadius === child.topLeftRadius &&
        topRightRadius === child.topRightRadius &&
        bottomLeftRadius === child.bottomLeftRadius &&
        bottomRightRadius === child.bottomRightRadius &&
        borderRadius === child.borderRadius

      const updatedChild: ComponentSchema = borderRadiiMatch
        ? child
        : {
            ...child,
            borderRadius,
            topLeftRadius,
            topRightRadius,
            bottomLeftRadius,
            bottomRightRadius,
          }

      if (updatedChild !== child) {
        if (components === project.components) {
          components = { ...project.components }
        }

        components[childId] = updatedChild
      }

      if (hasChildren(updatedChild)) {
        visitChildren(updatedChild)
      }
    }
  }

  const root = components[project.root]

  if (!isDefined(root) || root.type !== 'root-panel') {
    throw new Error(`Root component not found: ${project.root}`)
  }

  visitChildren(root)

  return components === project.components ? project : { ...project, components }
}
