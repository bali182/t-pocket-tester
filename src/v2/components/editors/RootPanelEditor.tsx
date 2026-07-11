import { FC } from 'react'
import type { RootPanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import type { ChildComponentType } from '../AddChildComponentMenu'
import { CornerRadiusSection } from './CornerRadiusSection'
import { LayoutSection } from './LayoutSection'
import { NameAndColorSection } from './NameAndColorSection'
import { ToolbarSection } from './ToolbarSection'
import { WidthAndHeightSizeSection } from './WidthAndHeightSizeSection'

type RootPanelEditorProps = {
  component: EditableSchema<RootPanelSchema>
  issues: ValidationIssuesSchema<RootPanelSchema>
  onAddChild: (type: ChildComponentType) => void
  onChange: (updated: EditableSchema<RootPanelSchema>) => void
}

export const RootPanelEditor: FC<RootPanelEditorProps> = ({ component, issues, onAddChild, onChange }) => {
  return (
    <>
      <ToolbarSection onAddChild={onAddChild} />
      <NameAndColorSection component={component} onChange={onChange} />
      <WidthAndHeightSizeSection component={component} issues={issues.size} onChange={onChange} />
      <CornerRadiusSection component={component} issues={issues} onChange={onChange} />
      <LayoutSection component={component} issues={issues.layout} onChange={onChange} />
    </>
  )
}
