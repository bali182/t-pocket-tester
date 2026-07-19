import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { PocketClusterStitchLineSchema } from '../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { BasicSettingsSection } from './sections/BasicSettingsSection'
import { PocketClusterStitchLineSettingsSection } from './sections/PocketClusterStitchLineSettingsSection'
import { StitchingSettingsSection } from './sections/StitchingSettingsSection'

type PocketClusterStitchLineEditorProps = {
  editable: EditableSchema<PocketClusterStitchLineSchema>
  issues: ValidationIssuesSchema<PocketClusterStitchLineSchema>
  onChange: (updated: EditableSchema<PocketClusterStitchLineSchema>) => void
}

export const PocketClusterStitchLineEditor: FC<PocketClusterStitchLineEditorProps> = ({ editable, issues, onChange }) => {
  return (
    <>
      <BasicSettingsSection<PocketClusterStitchLineSchema>
        componentTypes={['pocket-cluster']}
        editable={editable}
        issues={issues}
        onChange={onChange}
      />
      <PocketClusterStitchLineSettingsSection editable={editable} issues={issues} onChange={onChange} />
      <StitchingSettingsSection<PocketClusterStitchLineSchema> editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
