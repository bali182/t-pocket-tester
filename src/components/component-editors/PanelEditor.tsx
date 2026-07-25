import { FC } from 'react'
import type { PanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CornerRadiusSection } from './sections/CornerRadiusSection'
import { FillableSizeSection } from './sections/FillableSizeSection'
import { LayoutSection } from './sections/LayoutSection'
import { NameAndColorSection } from './sections/NameAndColorSection'

type PanelEditorProps = {
  component: PanelSchema
  editable: EditableSchema<PanelSchema>
  issues: ValidationIssuesSchema<PanelSchema>
  onChange: (updated: EditableSchema<PanelSchema>) => void
}

export const PanelEditor: FC<PanelEditorProps> = ({ component, editable, issues, onChange }) => {
  return (
    <>
      <NameAndColorSection editable={editable} issues={issues} onChange={onChange} />
      <FillableSizeSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <LayoutSection component={component} editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
