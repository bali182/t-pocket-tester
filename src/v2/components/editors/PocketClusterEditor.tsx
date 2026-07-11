import { type FC } from 'react'

import type { PocketClusterSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CornerRadiusSection } from './CornerRadiusSection'
import { FillableSizeSection } from './FillableSizeSection'
import { NameAndColorSection } from './NameAndColorSection'
import { PocketClusterSettingsSection } from './PocketClusterSettingsSection'
import { ToolbarSection } from './ToolbarSection'
import { TPocketShapeSection } from './TPocketShapeSection'

type PocketClusterEditorProps = {
  component: EditableSchema<PocketClusterSchema>
  issues: ValidationIssuesSchema<PocketClusterSchema>
  onChange: (updated: EditableSchema<PocketClusterSchema>) => void
  onRemoveComponent: () => void
}

export const PocketClusterEditor: FC<PocketClusterEditorProps> = ({
  component,
  issues,
  onChange,
  onRemoveComponent,
}) => {
  return (
    <>
      <ToolbarSection onRemoveComponent={onRemoveComponent} />
      <NameAndColorSection component={component} onChange={onChange} />
      <FillableSizeSection component={component} issues={issues.size} onChange={onChange} />
      <CornerRadiusSection component={component} issues={issues} onChange={onChange} />
      <PocketClusterSettingsSection component={component} issues={issues} onChange={onChange} />
      <TPocketShapeSection component={component} issues={issues} onChange={onChange} />
    </>
  )
}
