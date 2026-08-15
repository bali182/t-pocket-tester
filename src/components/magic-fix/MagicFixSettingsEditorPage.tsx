import { Tabs } from '@chakra-ui/react'
import { FC } from 'react'
import { MagicFixConfigSchema } from '../../schemas/magicFixConfig'
import { SubProjectSchema } from '../../schemas/subProject'
import { useTranslation } from '../../translations/translation'
import { MagicFixAdvancedSettingsEditor } from './MagicFixAdvancedSettingsEditor'
import { MagicFixBasicSettingsEditor } from './MagicFixBasicSettingsEditor'

export type MagicFixSettingsEditorPageProps = {
  config: MagicFixConfigSchema
  subProject: SubProjectSchema
  onChange: (config: MagicFixConfigSchema) => void
}

export const MagicFixSettingsEditorPage: FC<MagicFixSettingsEditorPageProps> = ({ config, onChange, subProject }) => {
  const t = useTranslation()
  return (
    <Tabs.Root defaultValue="basic" display="flex" flexDirection="column" height="full" minHeight="0">
      <Tabs.List alignItems="center" flexShrink="0">
        <Tabs.Trigger value="basic">{t.magicFix.dialog.settings.tabs.basic}</Tabs.Trigger>
        <Tabs.Trigger value="advanced">{t.magicFix.dialog.settings.tabs.advanced}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.ContentGroup flex="1" minHeight="0">
        <Tabs.Content height="full" value="basic" pt={0}>
          <MagicFixBasicSettingsEditor config={config} onChange={onChange} />
        </Tabs.Content>
        <Tabs.Content height="full" value="advanced" pt={0}>
          <MagicFixAdvancedSettingsEditor subProject={subProject} onChange={onChange} config={config} />
        </Tabs.Content>
      </Tabs.ContentGroup>
    </Tabs.Root>
  )
}
