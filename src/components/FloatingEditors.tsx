import { FC, useMemo } from 'react'
import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { isDefined } from '../utils/isDefined'
import {
  getComponentFloatingAnchor,
  getHoleFloatingAnchor,
  getStitchLineFloatingAnchor,
} from '../utils/svgElementUtils'
import { ComponentFloatingEditor } from './component-editors/ComponentFloatingEditor'
import { HoleFloatingEditor } from './hole-editors/HoleFloatingEditor'
import { StitchLineFloatingEditor } from './stitch-line-editors/StitchLineFloatingEditor'

export const FloatingEditors: FC = () => {
  const { selection } = useDrawAreaContext()
  const { selectedComponent, selectedHole, selectedStitchLine, clearSelection } = selection

  const componentAnchorElement = useMemo(() => {
    return isDefined(selectedComponent) ? getComponentFloatingAnchor(selectedComponent.id) : undefined
  }, [selectedComponent])

  const stitchLineAnchorElement = useMemo(() => {
    return isDefined(selectedStitchLine) ? getStitchLineFloatingAnchor(selectedStitchLine.id) : undefined
  }, [selectedStitchLine])

  const holeAnchorElement = useMemo(() => {
    return isDefined(selectedHole) ? getHoleFloatingAnchor(selectedHole.id) : undefined
  }, [selectedHole])

  return (
    <>
      {isDefined(selectedComponent) && isDefined(componentAnchorElement) && (
        <ComponentFloatingEditor
          component={selectedComponent}
          anchorElement={componentAnchorElement}
          onClose={clearSelection}
        />
      )}
      {isDefined(selectedStitchLine) && isDefined(stitchLineAnchorElement) && (
        <StitchLineFloatingEditor
          stitchLine={selectedStitchLine}
          anchorElement={stitchLineAnchorElement}
          onClose={clearSelection}
        />
      )}
      {isDefined(selectedHole) && isDefined(holeAnchorElement) && (
        <HoleFloatingEditor hole={selectedHole} anchorElement={holeAnchorElement} onClose={clearSelection} />
      )}
    </>
  )
}
