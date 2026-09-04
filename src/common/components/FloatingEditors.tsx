import { FC, useMemo } from 'react'
import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { useSubProject } from '../hooks/useSubProject'
import { getComponentAnchor, getHoleAnchor, getStitchLineAnchor } from '../utils/floatingEditorAnchorUtils'
import { isDefined } from '../utils/isDefined'
import { ComponentFloatingEditor } from './component-editors/ComponentFloatingEditor'
import { HoleFloatingEditor } from './hole-editors/HoleFloatingEditor'
import { StitchLineFloatingEditor } from './stitch-line-editors/StitchLineFloatingEditor'

export const FloatingEditors: FC = () => {
  const { selection } = useDrawAreaContext()
  const { subProject } = useSubProject()
  const { selectedComponent, selectedHole, selectedStitchLine, clearSelection } = selection

  const componentAnchorElement = useMemo(() => {
    return isDefined(selectedComponent) ? getComponentAnchor(selectedComponent, subProject) : undefined
  }, [selectedComponent, subProject])

  const stitchLineAnchorElement = useMemo(() => {
    return isDefined(selectedStitchLine) ? getStitchLineAnchor(selectedStitchLine, subProject) : undefined
  }, [selectedStitchLine, subProject])

  const holeAnchorElement = useMemo(() => {
    return isDefined(selectedHole) ? getHoleAnchor(selectedHole, subProject) : undefined
  }, [selectedHole, subProject])

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
