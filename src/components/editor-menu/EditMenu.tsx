import { Button, Menu, Portal } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { PiCaretDown } from 'react-icons/pi'
import { useProject } from '../../hooks/useProject'
import { useProjectOperations } from '../../hooks/useProjectOperations'
import { portalRef } from '../../portalRef'
import { NumberEditorStepSchema } from '../../schemas/settings'
import { useTranslation } from '../../translations/translation'
import { StepMenuItem } from './StepMenuItem'

export const EditMenu: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { updateEditingSettings } = useProjectOperations()

  const handleStepSelect = useCallback(
    (numberEditorStep: NumberEditorStepSchema): void => updateEditingSettings({ numberEditorStep }),
    [updateEditingSettings],
  )

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button size="sm" variant="ghost">
            <PiCaretDown />
            {t.editor.menus.edit.name}
          </Button>
        </Menu.Trigger>
        <Portal container={portalRef}>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>{t.editor.menus.edit.increment.name}</Menu.ItemGroupLabel>
                <StepMenuItem
                  onSelect={handleStepSelect}
                  selectedValue={project.editingSettings.numberEditorStep}
                  subTitle={t.editor.menus.edit.increment.size(0.01)}
                  title={t.editor.menus.edit.increment.tiny}
                  value={0.01}
                />
                <StepMenuItem
                  onSelect={handleStepSelect}
                  selectedValue={project.editingSettings.numberEditorStep}
                  subTitle={t.editor.menus.edit.increment.size(0.1)}
                  title={t.editor.menus.edit.increment.small}
                  value={0.1}
                />
                <StepMenuItem
                  onSelect={handleStepSelect}
                  selectedValue={project.editingSettings.numberEditorStep}
                  subTitle={t.editor.menus.edit.increment.size(1)}
                  title={t.editor.menus.edit.increment.default}
                  value={1}
                />
                <StepMenuItem
                  onSelect={handleStepSelect}
                  selectedValue={project.editingSettings.numberEditorStep}
                  subTitle={t.editor.menus.edit.increment.size(project.stitchingSettings.stitchHoleDistance)}
                  title={t.editor.menus.edit.increment.stitch}
                  value="stitch-hole-distance"
                />
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  )
}
