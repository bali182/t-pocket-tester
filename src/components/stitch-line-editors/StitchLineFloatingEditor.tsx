import { type FC } from 'react'

import { useEditableStitchLine } from '../../hooks/useEditableStitchLine'
import type { StitchLineSchema } from '../../schemas/stitching'
import { getModelIcon } from '../../utils/getModelIcon'
import type { FloatingEditorAnchor } from '../../utils/svgElementUtils'
import { FloatingEditor } from '../common/FloatingEditor'
import { IdentityFloatingEditorHeader } from '../common/IdentityFloatingEditorHeader'
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
      <IdentityFloatingEditorHeader<StitchLineSchema>
        editable={editableStitchLine}
        icon={getModelIcon(editedStitchLine.type)}
        issues={validationIssues}
        menu={<StitchLineActionsMenu size="xs" stitchLine={editedStitchLine} />}
        onChange={setStitchLine}
      />
      <StitchLineEditor
        editable={editableStitchLine}
        issues={validationIssues}
        onChange={setStitchLine}
        resolvedEditable={resolvedEditableStitchLine}
        stitchLine={editedStitchLine}
      />
    </FloatingEditor>
  )
}
