import { Menu } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from '../../../translations/translation'
import { BaseMenu } from '../BaseMenu'
import { ColorsMenuGroup } from '../groups/ColorsMenuGroup'
import { ScalingMenuGroup } from '../groups/ScalingMenuGroup'
import { StitchingVisibilityMenuGroup } from '../groups/StitchingVisibilityMenuGroup'

export const ViewMenu: FC = () => {
  const t = useTranslation()
  return (
    <BaseMenu title={t.editor.menus.view.name}>
      <StitchingVisibilityMenuGroup />
      <Menu.Separator />
      <ColorsMenuGroup />
      <Menu.Separator />
      <ScalingMenuGroup />
    </BaseMenu>
  )
}
