import { type FC } from 'react'

import { useEditableMagicFixConfigEntry } from '../../../hooks/useEditableMagicFixConfigEntry'
import type { MagicFixRootPanelConfigSchema } from '../../../schemas/magicFixConfig'
import { validateMagicFixRootPanelConfig } from '../../../validators/validateMagicFixConfig'
import { SectionGroup } from '../../common/SectionGroup'
import { CornerRadiusSection } from '../sections/CornerRadiusSection'
import { DimensionsSection } from '../sections/DimensionsSection'
import { LayoutGapSection } from '../sections/LayoutGapSection'
import { PreferredMinimumDistanceSection } from '../sections/PreferredMinimumDistanceSection'

type MagicFixRootPanelConfigEditorProps = {
  config: MagicFixRootPanelConfigSchema
  onChange: (config: MagicFixRootPanelConfigSchema) => void
}

export const MagicFixRootPanelConfigEditor: FC<MagicFixRootPanelConfigEditorProps> = ({ config, onChange }) => {
  const { editableConfig, setConfig, validationIssues } = useEditableMagicFixConfigEntry({
    config,
    onChange,
    validate: validateMagicFixRootPanelConfig,
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
      <CornerRadiusSection config={config} editable={editableConfig} issues={validationIssues} onChange={setConfig} />
    </SectionGroup.Root>
  )
}
