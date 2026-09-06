import { Menu } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiRuler } from 'react-icons/pi'
import { useTranslation } from '../../../translations/translation'
import { ScalingDialog } from '../../ScalingDialog'

export const ScalingMenuGroup: FC = () => {
  const t = useTranslation()
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)
  const handleScalingButtonClick = useCallback(() => setScalingDialogOpen(true), [])

  console.log({ isScalingDialogOpen })

  return (
    <>
      <Menu.ItemGroup>
        <Menu.ItemGroupLabel>{t.editor.menus.view.scaling.name}</Menu.ItemGroupLabel>
        <Menu.Item value="scaling" onSelect={handleScalingButtonClick}>
          <PiRuler />
          <Menu.ItemText>{t.editor.menus.view.scaling.scaling}</Menu.ItemText>
        </Menu.Item>
      </Menu.ItemGroup>
      <ScalingDialog isOpen={isScalingDialogOpen} onOpenChange={setScalingDialogOpen} />
    </>
  )
}
