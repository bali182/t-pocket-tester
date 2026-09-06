import { Menu } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { PiLineSegmentFill, PiNeedle } from 'react-icons/pi'
import { useProject } from '../../../hooks/useProject'
import { useProjectOperations } from '../../../hooks/useProjectOperations'
import { NumberEditorStepSchema } from '../../../schemas/settings'
import { useTranslation } from '../../../translations/translation'
import { StepMenuItem } from '../items/StepMenuItem'

export const StepIncrementMenuGroup: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { updateEditingSettings } = useProjectOperations()

  const handleStepSelect = useCallback(
    (numberEditorStep: NumberEditorStepSchema): void => updateEditingSettings({ numberEditorStep }),
    [updateEditingSettings],
  )
  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.edit.increment.name}</Menu.ItemGroupLabel>
      <StepMenuItem
        onSelect={handleStepSelect}
        selectedValue={project.editingSettings.numberEditorStep}
        subTitle={t.editor.menus.edit.increment.size(0.1)}
        title={t.editor.menus.edit.increment.small}
        icon={PiLineSegmentFill}
        iconScale={0.8}
        value={0.1}
      />
      <StepMenuItem
        onSelect={handleStepSelect}
        selectedValue={project.editingSettings.numberEditorStep}
        subTitle={t.editor.menus.edit.increment.size(1)}
        title={t.editor.menus.edit.increment.default}
        icon={PiLineSegmentFill}
        value={1}
      />
      <StepMenuItem
        onSelect={handleStepSelect}
        selectedValue={project.editingSettings.numberEditorStep}
        subTitle={t.editor.menus.edit.increment.size(project.stitchingSettings.stitchHoleDistance)}
        title={t.editor.menus.edit.increment.stitch}
        icon={PiNeedle}
        value="stitch-hole-distance"
      />
    </Menu.ItemGroup>
  )
}
