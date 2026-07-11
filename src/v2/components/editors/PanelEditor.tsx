import { FC } from 'react'
import type { PanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import type { ChildComponentType } from '../AddChildComponentMenu'
import { CornerRadiusSection } from './CornerRadiusSection'
import { FillableSizeSection } from './FillableSizeSection'
import { LayoutSection } from './LayoutSection'
import { NameAndColorSection } from './NameAndColorSection'
import { ToolbarSection } from './ToolbarSection'

type PanelEditorProps = {
  component: PanelSchema
  editable: EditableSchema<PanelSchema>
  issues: ValidationIssuesSchema<PanelSchema>
  onAddChild: (type: ChildComponentType) => void
  onChange: (updated: EditableSchema<PanelSchema>) => void
  onRemoveComponent: () => void
}

export const PanelEditor: FC<PanelEditorProps> = ({ component, editable, issues, onAddChild, onChange, onRemoveComponent }) => {
  return (
    <>
      <ToolbarSection onAddChild={onAddChild} onRemoveComponent={onRemoveComponent} />
      <NameAndColorSection editable={editable} onChange={onChange} />
      <FillableSizeSection component={component} editable={editable} issues={issues.size} onChange={onChange} />
      <CornerRadiusSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <LayoutSection component={component} editable={editable} issues={issues.layout} onChange={onChange} />
    </>
  )
}
