import { type FC } from 'react'

import type { PanelSchema, PocketClusterSchema, RootPanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { SectionGroup } from '../common/SectionGroup'
import { AnchorSection } from './sections/AnchorSection'
import { CornerRadiusSection } from './sections/CornerRadiusSection'
import { FillableSizeSection } from './sections/FillableSizeSection'
import { NameAndColorSection } from './sections/NameAndColorSection'
import { PocketClusterSettingsSection } from './sections/PocketClusterSettingsSection'
import { SqueezeSection } from './sections/SqueezeSection'
import { TPocketShapeSection } from './sections/TPocketShapeSection'

type PocketClusterEditorProps = {
  baseColor: string
  component: PocketClusterSchema
  editable: EditableSchema<PocketClusterSchema>
  issues: ValidationIssuesSchema<PocketClusterSchema>
  onChange: (updated: EditableSchema<PocketClusterSchema>) => void
  onResetColor: () => void
  parent: RootPanelSchema | PanelSchema
}

export const PocketClusterEditor: FC<PocketClusterEditorProps> = ({
  baseColor,
  component,
  editable,
  issues,
  onChange,
  onResetColor,
  parent,
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
      <AnchorSection<PocketClusterSchema> parent={parent} editable={editable} issues={issues} onChange={onChange} />
      <SqueezeSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection<PocketClusterSchema>
        value={component}
        editable={editable}
        issues={issues}
        onChange={onChange}
      />
      <PocketClusterSettingsSection component={component} editable={editable} issues={issues} onChange={onChange} />
      <TPocketShapeSection component={component} editable={editable} issues={issues} onChange={onChange} />
    </SectionGroup.Root>
  )
}
