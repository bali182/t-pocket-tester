import { type FC } from 'react'

import type { StitchLineSchema } from '../../schemas/stitching'
import { FloatingEditor } from '../common/FloatingEditor'
import { FloatingEditorHeader } from '../common/FloatingEditorHeader'
import { StitchLineEditorHeaderMenu } from './StitchLineEditorHeaderMenu'

type StitchLineFloatingEditorProps = {
  anchorElement: SVGGraphicsElement
  onClose: () => void
  stitchLine: StitchLineSchema
}

export const StitchLineFloatingEditor: FC<StitchLineFloatingEditorProps> = ({ anchorElement, onClose, stitchLine }) => {
  return (
    <FloatingEditor anchorElement={anchorElement} onClose={onClose}>
      <FloatingEditorHeader
        menu={<StitchLineEditorHeaderMenu onClose={onClose} stitchLine={stitchLine} />}
        title={`#${stitchLine.id}`}
      />
    </FloatingEditor>
  )
}
