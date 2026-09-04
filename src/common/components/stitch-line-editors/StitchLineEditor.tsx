import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type {
  ComponentBoundsStitchLineSchema,
  PocketClusterStitchLineSchema,
  StitchLineCommonConfigSchema,
  StitchLineSchema,
} from '../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { ComponentBoundsStitchLineEditor } from './ComponentBoundsStitchLineEditor'
import { PocketClusterStitchLineEditor } from './PocketClusterStitchLineEditor'

type StitchLineEditorProps = {
  editable: EditableSchema<StitchLineSchema>
  issues: ValidationIssuesSchema<StitchLineSchema>
  onChange: (updated: EditableSchema<StitchLineSchema>) => void
  resolvedEditable: EditableSchema<StitchLineCommonConfigSchema> & EditableSchema<StitchLineSchema>
  stitchLine: StitchLineSchema
}

export const StitchLineEditor: FC<StitchLineEditorProps> = ({
  editable,
  issues,
  onChange,
  resolvedEditable,
  stitchLine,
}) => {
  const handleReset = useCallback(
    (key: keyof StitchLineCommonConfigSchema): void => {
      const updatedEditable = { ...editable }
      delete updatedEditable[key]
      onChange(updatedEditable)
    },
    [editable, onChange],
  )

  switch (stitchLine.type) {
    case 'component-bounds-stitch-line':
      return (
        <ComponentBoundsStitchLineEditor
          value={stitchLine}
          editable={editable as EditableSchema<ComponentBoundsStitchLineSchema>}
          issues={issues as ValidationIssuesSchema<ComponentBoundsStitchLineSchema>}
          onChange={onChange}
          onReset={handleReset}
          resolvedEditable={
            resolvedEditable as EditableSchema<StitchLineCommonConfigSchema> &
              EditableSchema<ComponentBoundsStitchLineSchema>
          }
        />
      )
    case 'pocket-cluster-stitch-line':
      return (
        <PocketClusterStitchLineEditor
          editable={editable as EditableSchema<PocketClusterStitchLineSchema>}
          issues={issues as ValidationIssuesSchema<PocketClusterStitchLineSchema>}
          onChange={onChange}
          onReset={handleReset}
          resolvedEditable={
            resolvedEditable as EditableSchema<StitchLineCommonConfigSchema> &
              EditableSchema<PocketClusterStitchLineSchema>
          }
        />
      )
  }
}
