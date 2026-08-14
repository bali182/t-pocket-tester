import { type FC } from 'react'

import { useEditableMagicFixConfigEntry } from '../../../hooks/useEditableMagicFixConfigEntry'
import type { MagicFixPocketClusterConfigSchema } from '../../../schemas/magicFixConfig'
import { validateMagicFixPocketClusterConfig } from '../../../validators/validateMagicFixConfig'
import { SectionGroup } from '../../common/SectionGroup'
import { AutoDimensionsSection } from '../sections/AutoDimensionsSection'
import { CornerRadiusSection } from '../sections/CornerRadiusSection'
import { DimensionsSection } from '../sections/DimensionsSection'
import { PocketStepSection } from '../sections/PocketStepSection'
import { PreferredMinimumDistanceSection } from '../sections/PreferredMinimumDistanceSection'

type MagicFixPocketClusterConfigEditorProps = {
  config: MagicFixPocketClusterConfigSchema
  onChange: (config: MagicFixPocketClusterConfigSchema) => void
}

export const MagicFixPocketClusterConfigEditor: FC<MagicFixPocketClusterConfigEditorProps> = ({ config, onChange }) => {
  const { editableConfig, setConfig, validationIssues } = useEditableMagicFixConfigEntry({
    config,
    onChange,
    validate: validateMagicFixPocketClusterConfig,
  })

  return (
    <SectionGroup.Root>
      <PreferredMinimumDistanceSection
        config={config}
        editable={editableConfig}
        issues={validationIssues}
        onChange={setConfig}
      />
      <DimensionsSection config={config} editable={editableConfig} issues={validationIssues} onChange={setConfig} />
      <AutoDimensionsSection config={config} editable={editableConfig} issues={validationIssues} onChange={setConfig} />
      <CornerRadiusSection config={config} editable={editableConfig} issues={validationIssues} onChange={setConfig} />
      <PocketStepSection config={config} editable={editableConfig} issues={validationIssues} onChange={setConfig} />
    </SectionGroup.Root>
  )
}
