import { type FC } from 'react'

import { useEditableHole } from '../../hooks/useEditableHole'
import type { HoleSchema } from '../../schemas/hole'
import type { FloatingEditorAnchor } from '../../utils/svgElementUtils'
import { FloatingEditor } from '../common/FloatingEditor'
import { FloatingEditorHeader } from '../common/FloatingEditorHeader'
import { SectionGroup } from '../common/SectionGroup'
import { HoleActionsMenu } from '../tree/HoleActionsMenu'
import { HoleEditor } from './HoleEditor'

type HoleFloatingEditorProps = {
  anchorElement: FloatingEditorAnchor
  hole: HoleSchema
  onClose: () => void
}

export const HoleFloatingEditor: FC<HoleFloatingEditorProps> = ({ anchorElement, hole, onClose }) => {
  const { editableHole, hole: editedHole, setHole, validationIssues } = useEditableHole(hole.id)

  return (
    <FloatingEditor anchorElement={anchorElement} onClose={onClose}>
      <FloatingEditorHeader menu={<HoleActionsMenu hole={editedHole} size="xs" />} title={`#${editedHole.id}`} />
      <SectionGroup.Root>
        <HoleEditor
          editable={editableHole}
          hole={editedHole}
          issues={validationIssues}
          onChange={setHole}
        />
      </SectionGroup.Root>
    </FloatingEditor>
  )
}
