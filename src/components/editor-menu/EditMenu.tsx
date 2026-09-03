import { Button, Menu, Portal } from '@chakra-ui/react'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { PiCaretDown, PiLineSegmentFill, PiNeedle } from 'react-icons/pi'
import { useProject } from '../../hooks/useProject'
import { useProjectOperations } from '../../hooks/useProjectOperations'
import { portalRef } from '../../portalRef'
import { NumberEditorStepSchema } from '../../schemas/settings'
import { useTranslation } from '../../translations/translation'
import { StepMenuItem } from './StepMenuItem'
import { StitchingSettingsMenuItems } from './StitchingSettingsMenuItems'

export const EditMenu: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { updateEditingSettings, updateStitchingSettings } = useProjectOperations()
  const [isOpen, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleStepSelect = useCallback(
    (numberEditorStep: NumberEditorStepSchema): void => updateEditingSettings({ numberEditorStep }),
    [updateEditingSettings],
  )

  // Menu focuses the first tabbable descendant in its own animation frame. Run after it and only when opening:
  // rerunning after an input value update would steal focus from the edited input.
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frameId = requestAnimationFrame(() => contentRef.current?.focus())
    return () => cancelAnimationFrame(frameId)
  }, [isOpen])

  return (
    <>
      <Menu.Root onOpenChange={(details) => setOpen(details.open)}>
        <Menu.Trigger asChild>
          <Button size="sm" variant="ghost">
            <PiCaretDown />
            {t.editor.menus.edit.name}
          </Button>
        </Menu.Trigger>
        <Portal container={portalRef}>
          <Menu.Positioner>
            <Menu.Content ref={contentRef}>
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
              <Menu.Separator />
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>{t.editor.menus.edit.stitching.name}</Menu.ItemGroupLabel>
                <StitchingSettingsMenuItems onChange={updateStitchingSettings} value={project.stitchingSettings} />
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  )
}
