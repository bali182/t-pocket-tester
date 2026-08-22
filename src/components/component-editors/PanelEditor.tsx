import { FC } from 'react'
import type { PanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { SectionGroup } from '../common/SectionGroup'
import { CornerRadiusSection } from './sections/CornerRadiusSection'
import { FillableSizeSection } from './sections/FillableSizeSection'
import { LayoutSection } from './sections/LayoutSection'
import { NameAndColorSection } from './sections/NameAndColorSection'

type PanelEditorProps = {
  baseColor: string
  component: PanelSchema
  editable: EditableSchema<PanelSchema>
  issues: ValidationIssuesSchema<PanelSchema>
  onChange: (updated: EditableSchema<PanelSchema>) => void
  onResetColor: () => void
}

export const PanelEditor: FC<PanelEditorProps> = ({
  baseColor,
  component,
  editable,
  issues,
  onChange,
  onResetColor,
}) => {
  return (
    <SectionGroup.Root>
      <NameAndColorSection
        baseColor={baseColor}
        editable={editable}
        issues={issues}
        onChange={onChange}
        onResetColor={onResetColor}
      />
      <FillableSizeSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection<PanelSchema> value={component} editable={editable} issues={issues} onChange={onChange} />
      <LayoutSection component={component} editable={editable} issues={issues} onChange={onChange} />
    </SectionGroup.Root>
  )
}
