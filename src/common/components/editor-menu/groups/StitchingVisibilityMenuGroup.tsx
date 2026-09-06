import { Menu } from '@chakra-ui/react'
import { useProject } from '../../../hooks/useProject'
import { useProjectOperations } from '../../../hooks/useProjectOperations'
import { useTranslation } from '../../../translations/translation'
import { StitchVisibilityMenuItem } from '../items/StitchVisibilityMenuItem'

export const StitchingVisibilityMenuGroup = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { updateStitchingSettings } = useProjectOperations()

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.view.stitching.name}</Menu.ItemGroupLabel>
      <StitchVisibilityMenuItem
        field="stitchLinesVisible"
        label={t.editor.menus.view.stitching.stitchLinesVisible}
        onChange={updateStitchingSettings}
        value={project.stitchingSettings.stitchLinesVisible}
      />
      <StitchVisibilityMenuItem
        field="stitchHolesVisible"
        label={t.editor.menus.view.stitching.stitchHolesVisible}
        onChange={updateStitchingSettings}
        value={project.stitchingSettings.stitchHolesVisible}
      />
      <StitchVisibilityMenuItem
        field="stitchesVisible"
        label={t.editor.menus.view.stitching.stitchesVisible}
        onChange={updateStitchingSettings}
        value={project.stitchingSettings.stitchesVisible}
      />
    </Menu.ItemGroup>
  )
}
