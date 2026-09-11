import { Menu } from '@chakra-ui/react'
import { useCommandsContext } from '../../../contexts/CommandsContext'
import { useGlobalSettings } from '../../../hooks/useGlobalSettings'
import { CommonCommandIdSchema } from '../../../schemas/command'
import { useTranslation } from '../../../translations/translation'
import { StitchVisibilityMenuItem } from '../items/StitchVisibilityMenuItem'

export const StitchingVisibilityMenuGroup = () => {
  const t = useTranslation()
  const { settings } = useGlobalSettings()
  const { getCommand } = useCommandsContext<CommonCommandIdSchema>()

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.view.stitching.name}</Menu.ItemGroupLabel>
      <StitchVisibilityMenuItem
        label={t.editor.menus.view.stitching.stitchLinesVisible}
        value={settings.view.stitchLinesVisible}
        command={getCommand('stitch-line-visibility')}
      />
      <StitchVisibilityMenuItem
        label={t.editor.menus.view.stitching.stitchHolesVisible}
        value={settings.view.stitchHolesVisible}
        command={getCommand('stitch-hole-visibility')}
      />
      <StitchVisibilityMenuItem
        label={t.editor.menus.view.stitching.stitchesVisible}
        value={settings.view.stitchesVisible}
        command={getCommand('stitches-visibility')}
      />
    </Menu.ItemGroup>
  )
}
