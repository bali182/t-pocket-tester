import { type FC } from 'react'

import { useEditableStitchLine } from '../../hooks/useEditableStitchLine'
import type { StitchLineSchema } from '../../schemas/stitching'
import { FloatingEditor } from '../common/FloatingEditor'
import { FloatingEditorHeader } from '../common/FloatingEditorHeader'
import { SectionGroup } from '../common/SectionGroup'
import { StitchLineEditor } from './StitchLineEditor'
import { StitchLineEditorHeaderMenu } from './StitchLineEditorHeaderMenu'

type StitchLineFloatingEditorProps = {
  anchorElement: SVGGraphicsElement
  onClose: () => void
  stitchLine: StitchLineSchema
}

export const StitchLineFloatingEditor: FC<StitchLineFloatingEditorProps> = ({ anchorElement, onClose, stitchLine }) => {
  const { editableStitchLine, resolvedEditableStitchLine, setStitchLine, stitchLine: editedStitchLine, validationIssues } =
    useEditableStitchLine(stitchLine.id)

  return (
    <FloatingEditor anchorElement={anchorElement} onClose={onClose}>
      <FloatingEditorHeader
        menu={<StitchLineEditorHeaderMenu onClose={onClose} stitchLine={editedStitchLine} />}
        title={`#${editedStitchLine.id}`}
      />
      <SectionGroup.Root>
        <StitchLineEditor
          editable={editableStitchLine}
          issues={validationIssues}
          onChange={setStitchLine}
          resolvedEditable={resolvedEditableStitchLine}
          stitchLine={editedStitchLine}
        />
      </SectionGroup.Root>
    </FloatingEditor>
  )
}
