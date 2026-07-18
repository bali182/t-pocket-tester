import { type FC } from 'react'

import type { PocketClusterSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CornerRadiusSection } from './sections/CornerRadiusSection'
import { FillableSizeSection } from './sections/FillableSizeSection'
import { NameAndColorSection } from './sections/NameAndColorSection'
import { PocketClusterSettingsSection } from './sections/PocketClusterSettingsSection'
import { TPocketShapeSection } from './sections/TPocketShapeSection'

type PocketClusterEditorProps = {
  component: PocketClusterSchema
  editable: EditableSchema<PocketClusterSchema>
  issues: ValidationIssuesSchema<PocketClusterSchema>
  onChange: (updated: EditableSchema<PocketClusterSchema>) => void
}

export const PocketClusterEditor: FC<PocketClusterEditorProps> = ({
  component,
  editable,
  issues,
  onChange,
}) => {
  return (
    <>
      <NameAndColorSection editable={editable} issues={issues} onChange={onChange} />
      <FillableSizeSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <PocketClusterSettingsSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <TPocketShapeSection component={component} editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
