import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type {
  ComponentBoundsStitchLineSchema,
  PocketClusterStitchLineSchema,
  StitchLineSchema,
} from '../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { ComponentBoundsStitchLineEditor } from './ComponentBoundsStitchLineEditor'
import { PocketClusterStitchLineEditor } from './PocketClusterStitchLineEditor'

type StitchLineEditorProps = {
  editable: EditableSchema<StitchLineSchema>
  issues: ValidationIssuesSchema<StitchLineSchema>
  onChange: (updated: EditableSchema<StitchLineSchema>) => void
  stitchLine: StitchLineSchema
}

export const StitchLineEditor: FC<StitchLineEditorProps> = ({ editable, issues, onChange, stitchLine }) => {
  switch (stitchLine.type) {
    case 'component-bounds-stitch-line':
      return (
        <ComponentBoundsStitchLineEditor
          editable={editable as EditableSchema<ComponentBoundsStitchLineSchema>}
          issues={issues as ValidationIssuesSchema<ComponentBoundsStitchLineSchema>}
          onChange={onChange}
        />
      )
    case 'pocket-cluster-stitch-line':
      return (
        <PocketClusterStitchLineEditor
          editable={editable as EditableSchema<PocketClusterStitchLineSchema>}
          issues={issues as ValidationIssuesSchema<PocketClusterStitchLineSchema>}
          onChange={onChange}
        />
      )
  }
}
