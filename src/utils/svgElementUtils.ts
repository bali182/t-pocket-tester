export type FloatingEditorAnchor = {
  contextElement: SVGGraphicsElement
  getBoundingClientRect: () => DOMRect
}

const getComponentSvgElement = (componentId: string): SVGGraphicsElement | undefined => {
  return document.querySelector<SVGGraphicsElement>(`[data-component-id="${CSS.escape(componentId)}"]`) ?? undefined
}

const getHoleHighlightElement = (holeId: string): SVGGElement | undefined => {
  return document.querySelector<SVGPathElement>(`[data-hole-id="${CSS.escape(holeId)}"]`) ?? undefined
}

const getStitchLineRouteElements = (stitchLineId: string): SVGGElement[] => {
  return Array.from(document.querySelectorAll<SVGGElement>(`[data-stitch-line-id="${CSS.escape(stitchLineId)}"]`))
}

export const getSvgElementFloatingAnchor = (element: SVGGraphicsElement): FloatingEditorAnchor => {
  return {
    contextElement: element,
    getBoundingClientRect: () => element.getBoundingClientRect(),
  }
}

export const getHoleFloatingAnchor = (holeId: string): FloatingEditorAnchor | undefined => {
  const holeElement = getHoleHighlightElement(holeId)
  return holeElement === undefined ? undefined : getSvgElementFloatingAnchor(holeElement)
}

export const getComponentFloatingAchor = (componentId: string): FloatingEditorAnchor | undefined => {
  const holeElement = getComponentSvgElement(componentId)
  return holeElement === undefined ? undefined : getSvgElementFloatingAnchor(holeElement)
}

export const getStitchLineFloatingAnchor = (stitchLineId: string): FloatingEditorAnchor | undefined => {
  const routeElements = getStitchLineRouteElements(stitchLineId)
  const contextElement = routeElements[0]

  if (contextElement === undefined) {
    return undefined
  }

  return {
    contextElement,
    getBoundingClientRect: () => getUnionBoundingClientRect(getStitchLineRouteElements(stitchLineId)),
  }
}

const getUnionBoundingClientRect = (elements: SVGGElement[]): DOMRect => {
  const firstRect = elements[0]?.getBoundingClientRect()

  if (firstRect === undefined) {
    return new DOMRect()
  }

  let left = firstRect.left
  let top = firstRect.top
  let right = firstRect.right
  let bottom = firstRect.bottom

  for (const element of elements.slice(1)) {
    const rect = element.getBoundingClientRect()
    left = Math.min(left, rect.left)
    top = Math.min(top, rect.top)
    right = Math.max(right, rect.right)
    bottom = Math.max(bottom, rect.bottom)
  }

  return new DOMRect(left, top, right - left, bottom - top)
}
