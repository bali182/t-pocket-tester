import { type FC } from 'react'

import type { PocketClusterSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CornerRadiusSection } from './CornerRadiusSection'
import { FillableSizeSection } from './FillableSizeSection'
import { NameAndColorSection } from './NameAndColorSection'
import { PocketClusterSettingsSection } from './PocketClusterSettingsSection'
import { TPocketShapeSection } from './TPocketShapeSection'

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
      <NameAndColorSection editable={editable} onChange={onChange} />
      <FillableSizeSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <PocketClusterSettingsSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <TPocketShapeSection component={component} editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
