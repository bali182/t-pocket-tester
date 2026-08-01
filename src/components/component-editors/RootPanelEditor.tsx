import { FC } from 'react'
import type { RootPanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CornerRadiusSection } from './sections/CornerRadiusSection'
import { LayoutSection } from './sections/LayoutSection'
import { NameAndColorSection } from './sections/NameAndColorSection'
import { WidthAndHeightSizeSection } from './sections/WidthAndHeightSizeSection'

type RootPanelEditorProps = {
  baseColor: string
  component: RootPanelSchema
  editable: EditableSchema<RootPanelSchema>
  issues: ValidationIssuesSchema<RootPanelSchema>
  onChange: (updated: EditableSchema<RootPanelSchema>) => void
  onResetColor: () => void
}

export const RootPanelEditor: FC<RootPanelEditorProps> = ({
  baseColor,
  component,
  editable,
  issues,
  onChange,
  onResetColor,
}) => {
  return (
    <>
      <NameAndColorSection
        baseColor={baseColor}
        editable={editable}
        issues={issues}
        onChange={onChange}
        onResetColor={onResetColor}
      />
      <WidthAndHeightSizeSection<RootPanelSchema> editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection<RootPanelSchema> editable={editable} issues={issues} onChange={onChange} />
      <LayoutSection component={component} editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
