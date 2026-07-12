import { FC } from 'react'
import type { PanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CornerRadiusSection } from './CornerRadiusSection'
import { FillableSizeSection } from './FillableSizeSection'
import { LayoutSection } from './LayoutSection'
import { NameAndColorSection } from './NameAndColorSection'

type PanelEditorProps = {
  component: PanelSchema
  editable: EditableSchema<PanelSchema>
  issues: ValidationIssuesSchema<PanelSchema>
  onChange: (updated: EditableSchema<PanelSchema>) => void
}

export const PanelEditor: FC<PanelEditorProps> = ({ component, editable, issues, onChange }) => {
  return (
    <>
      <NameAndColorSection editable={editable} onChange={onChange} />
      <FillableSizeSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <LayoutSection component={component} editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
