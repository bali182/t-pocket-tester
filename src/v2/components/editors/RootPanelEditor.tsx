import { FC } from 'react'
import type { RootPanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CornerRadiusSection } from './CornerRadiusSection'
import { LayoutSection } from './LayoutSection'
import { NameAndColorSection } from './NameAndColorSection'
import { WidthAndHeightSizeSection } from './WidthAndHeightSizeSection'

type RootPanelEditorProps = {
  component: RootPanelSchema
  editable: EditableSchema<RootPanelSchema>
  issues: ValidationIssuesSchema<RootPanelSchema>
  onChange: (updated: EditableSchema<RootPanelSchema>) => void
}

export const RootPanelEditor: FC<RootPanelEditorProps> = ({ component, editable, issues, onChange }) => {
  return (
    <>
      <NameAndColorSection editable={editable} onChange={onChange} />
      <WidthAndHeightSizeSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <LayoutSection component={component} editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
