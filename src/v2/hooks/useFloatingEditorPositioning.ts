import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react'
import { useEffect, type RefObject } from 'react'

const viewportBoundaryPadding = 8

export const useFloatingEditorPositioning = (
  anchorElement: SVGGraphicsElement,
  arrowRef: RefObject<SVGSVGElement | null>,
) => {
  const floating = useFloating({
    placement: 'right-start',
    middleware: [
      offset(10),
      flip({
        fallbackPlacements: ['left-start', 'bottom', 'top', 'right-start'],
        padding: viewportBoundaryPadding,
      }),
      shift({ padding: viewportBoundaryPadding }),
      arrow({ element: arrowRef }),
    ],
    strategy: 'fixed',
  })

  useEffect(() => {
    floating.refs.setReference(anchorElement)
    floating.update()
  }, [anchorElement, floating.refs, floating.update])

  useEffect(() => {
    const floatingElement = floating.refs.floating.current

    if (!floatingElement) {
      return undefined
    }

    return autoUpdate(anchorElement, floatingElement, floating.update)
  }, [anchorElement, floating.refs.floating, floating.update])

  return floating
}
