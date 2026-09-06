import { Menu } from '@chakra-ui/react'
import { useCommandsContext } from '../../../contexts/CommandsContext'
import { useProject } from '../../../hooks/useProject'
import { CommonCommandIdSchema } from '../../../schemas/command'
import { useTranslation } from '../../../translations/translation'
import { StitchVisibilityMenuItem } from '../items/StitchVisibilityMenuItem'

export const StitchingVisibilityMenuGroup = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { getCommand } = useCommandsContext<CommonCommandIdSchema>()

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.view.stitching.name}</Menu.ItemGroupLabel>
      <StitchVisibilityMenuItem
        label={t.editor.menus.view.stitching.stitchLinesVisible}
        value={project.stitchingSettings.stitchLinesVisible}
        command={getCommand('stitch-line-visibility')}
      />
      <StitchVisibilityMenuItem
        label={t.editor.menus.view.stitching.stitchHolesVisible}
        value={project.stitchingSettings.stitchHolesVisible}
        command={getCommand('stitch-hole-visibility')}
      />
      <StitchVisibilityMenuItem
        label={t.editor.menus.view.stitching.stitchesVisible}
        value={project.stitchingSettings.stitchesVisible}
        command={getCommand('stitches-visibility')}
      />
    </Menu.ItemGroup>
  )
}
