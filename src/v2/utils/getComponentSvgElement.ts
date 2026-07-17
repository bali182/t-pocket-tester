export const getComponentSvgElement = (componentId: string): SVGGraphicsElement | undefined => {
  return document.querySelector<SVGGraphicsElement>(`[data-component-id="${CSS.escape(componentId)}"]`) ?? undefined
}
