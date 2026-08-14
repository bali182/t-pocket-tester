import { type FC } from 'react'

import { useEditableMagicFixConfigEntry } from '../../../hooks/useEditableMagicFixConfigEntry'
import type { MagicFixPanelConfigSchema } from '../../../schemas/magicFixConfig'
import { validateMagicFixPanelConfig } from '../../../validators/validateMagicFixConfig'
import { SectionGroup } from '../../common/SectionGroup'
import { AutoDimensionsSection } from '../sections/AutoDimensionsSection'
import { CornerRadiusSection } from '../sections/CornerRadiusSection'
import { DimensionsSection } from '../sections/DimensionsSection'
import { LayoutGapSection } from '../sections/LayoutGapSection'
import { PreferredMinimumDistanceSection } from '../sections/PreferredMinimumDistanceSection'

type MagicFixPanelConfigEditorProps = {
  config: MagicFixPanelConfigSchema
  onChange: (config: MagicFixPanelConfigSchema) => void
}

export const MagicFixPanelConfigEditor: FC<MagicFixPanelConfigEditorProps> = ({ config, onChange }) => {
  const { editableConfig, setConfig, validationIssues } = useEditableMagicFixConfigEntry({
    config,
    onChange,
    validate: validateMagicFixPanelConfig,
  })

  return (
    <SectionGroup.Root>
      <PreferredMinimumDistanceSection
        config={config}
        editable={editableConfig}
        issues={validationIssues}
        onChange={setConfig}
      />
      <LayoutGapSection config={config} editable={editableConfig} issues={validationIssues} onChange={setConfig} />
      <DimensionsSection config={config} editable={editableConfig} issues={validationIssues} onChange={setConfig} />
      <AutoDimensionsSection config={config} editable={editableConfig} issues={validationIssues} onChange={setConfig} />
      <CornerRadiusSection config={config} editable={editableConfig} issues={validationIssues} onChange={setConfig} />
    </SectionGroup.Root>
  )
}
