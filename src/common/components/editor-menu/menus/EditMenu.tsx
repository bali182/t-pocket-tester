import { Menu } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from '../../../translations/translation'
import { BaseMenu } from '../BaseMenu'
import { StepIncrementMenuGroup } from '../groups/StepIncrementMenuGroup'
import { StitchingSettingsMenuGroup } from '../groups/StitchingSettingsMenuGroup'

export const EditMenu: FC = () => {
  const t = useTranslation()

  return (
    <BaseMenu title={t.editor.menus.edit.name} autoFocus>
      <StepIncrementMenuGroup />
      <Menu.Separator />
      <StitchingSettingsMenuGroup />
    </BaseMenu>
  )
}
