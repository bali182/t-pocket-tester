import type { ClientRect, DropAnimationFunction } from '@dnd-kit/core'
import { useCallback, useRef, type RefObject } from 'react'

import { isDefined } from '../../../utils/isDefined'

type UseTreeDropAnimationResult = {
  dropTargetRectRef: RefObject<ClientRect | undefined>
  handleDropAnimation: DropAnimationFunction
}

type DropAnimationTransform = {
  scaleX: number
  scaleY: number
  x: number
  y: number
}

const toTransformValue = (transform: DropAnimationTransform): string =>
  `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`

export const useTreeDropAnimation = (): UseTreeDropAnimationResult => {
  const dropTargetRectRef = useRef<ClientRect | undefined>(undefined)

  const handleDropAnimation = useCallback<DropAnimationFunction>(async ({ active, dragOverlay, transform }) => {
    const targetRect = dropTargetRectRef.current
    dropTargetRectRef.current = undefined
    const isValidDrop = isDefined(targetRect)

    const finalTransform = isValidDrop
      ? getDropZoneFinalTransform(transform, dragOverlay.rect, targetRect)
      : getDefaultFinalTransform(transform, dragOverlay.rect, active.rect)

    const animation = dragOverlay.node.animate(
      [
        { opacity: 1, transform: toTransformValue(transform) },
        { opacity: 0, transform: toTransformValue(finalTransform) },
      ],
      { duration: isValidDrop ? 200 : 500, easing: 'ease', fill: 'forwards' },
    )

    await animation.finished
  }, [])

  return { dropTargetRectRef, handleDropAnimation }
}

const getDropZoneFinalTransform = (
  transform: DropAnimationTransform,
  overlayRect: ClientRect,
  targetRect: ClientRect,
): DropAnimationTransform => ({
  scaleX: 1,
  scaleY: 1,
  x: transform.x + targetRect.left + (targetRect.width - overlayRect.width) / 2 - overlayRect.left,
  y: transform.y + targetRect.top + (targetRect.height - overlayRect.height) / 2 - overlayRect.top,
})

const getDefaultFinalTransform = (
  transform: DropAnimationTransform,
  overlayRect: ClientRect,
  activeRect: ClientRect,
): DropAnimationTransform => ({
  scaleX: transform.scaleX !== 1 ? (activeRect.width * transform.scaleX) / overlayRect.width : transform.scaleX,
  scaleY: transform.scaleY !== 1 ? (activeRect.height * transform.scaleY) / overlayRect.height : transform.scaleY,
  x: transform.x - (overlayRect.left - activeRect.left),
  y: transform.y - (overlayRect.top - activeRect.top),
})
