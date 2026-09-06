import { Menu } from '@chakra-ui/react'
import { FC } from 'react'
import { PiLineSegmentFill, PiNeedle } from 'react-icons/pi'
import { useCommandsContext } from '../../../contexts/CommandsContext'
import { useProject } from '../../../hooks/useProject'
import { CommonCommandIdSchema } from '../../../schemas/command'
import { useTranslation } from '../../../translations/translation'
import { StepMenuItem } from '../items/StepMenuItem'

export const StepIncrementMenuGroup: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { getCommand } = useCommandsContext<CommonCommandIdSchema>()

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.edit.increment.name}</Menu.ItemGroupLabel>
      <StepMenuItem
        selectedValue={project.editingSettings.numberEditorStep}
        subTitle={t.editor.menus.edit.increment.size(0.1)}
        title={t.editor.menus.edit.increment.small}
        icon={PiLineSegmentFill}
        iconScale={0.8}
        value={0.1}
        command={getCommand('increment-small')}
      />
      <StepMenuItem
        selectedValue={project.editingSettings.numberEditorStep}
        subTitle={t.editor.menus.edit.increment.size(1)}
        title={t.editor.menus.edit.increment.default}
        icon={PiLineSegmentFill}
        value={1}
        command={getCommand('increment-medium')}
      />
      <StepMenuItem
        selectedValue={project.editingSettings.numberEditorStep}
        subTitle={t.editor.menus.edit.increment.size(project.stitchingSettings.stitchHoleDistance)}
        title={t.editor.menus.edit.increment.stitch}
        icon={PiNeedle}
        value="stitch-hole-distance"
        command={getCommand('increment-stitch-hole-distance')}
      />
    </Menu.ItemGroup>
  )
}
