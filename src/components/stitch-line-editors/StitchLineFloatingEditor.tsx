import { type FC } from 'react'

import { useEditableStitchLine } from '../../hooks/useEditableStitchLine'
import type { StitchLineSchema } from '../../schemas/stitching'
import type { FloatingEditorAnchor } from '../../utils/svgElementUtils'
import { FloatingEditor } from '../common/FloatingEditor'
import { FloatingEditorHeader } from '../common/FloatingEditorHeader'
import { SectionGroup } from '../common/SectionGroup'
import { StitchLineActionsMenu } from '../StitchLineActionsMenu'
import { StitchLineEditor } from './StitchLineEditor'

type StitchLineFloatingEditorProps = {
  anchorElement: FloatingEditorAnchor
  onClose: () => void
  stitchLine: StitchLineSchema
}

export const StitchLineFloatingEditor: FC<StitchLineFloatingEditorProps> = ({ anchorElement, onClose, stitchLine }) => {
  const {
    editableStitchLine,
    resolvedEditableStitchLine,
    setStitchLine,
    stitchLine: editedStitchLine,
    validationIssues,
  } = useEditableStitchLine(stitchLine.id)

  return (
    <FloatingEditor anchorElement={anchorElement} onClose={onClose}>
      <FloatingEditorHeader
        menu={<StitchLineActionsMenu size="xs" stitchLine={editedStitchLine} />}
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
