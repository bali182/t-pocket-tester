import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { CircleHoleSchema, HoleSchema, RectHoleSchema } from '../../schemas/hole'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CircleHoleEditor } from './CircleHoleEditor'
import { RectHoleEditor } from './RectHoleEditor'

type HoleEditorProps = {
  editable: EditableSchema<HoleSchema>
  hole: HoleSchema
  issues: ValidationIssuesSchema<HoleSchema>
  onChange: (updated: EditableSchema<HoleSchema>) => void
}

export const HoleEditor: FC<HoleEditorProps> = ({ editable, hole, issues, onChange }) => {
  switch (hole.type) {
    case 'rect-hole':
      return (
        <RectHoleEditor
          editable={editable as EditableSchema<RectHoleSchema>}
          issues={issues as ValidationIssuesSchema<RectHoleSchema>}
          onChange={onChange}
        />
      )
    case 'circle-hole':
      return (
        <CircleHoleEditor
          editable={editable as EditableSchema<CircleHoleSchema>}
          issues={issues as ValidationIssuesSchema<CircleHoleSchema>}
          onChange={onChange}
        />
      )
  }
}
