import { Button, Menu, Portal } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiCaretDown, PiRuler } from 'react-icons/pi'
import {
  cardColors,
  modelColors,
  selectionColors,
  stitchHoleColors,
  stitchLineColors,
  strokeColors,
} from '../../data/colors'
import { useColors } from '../../hooks/useColors'
import { useProject } from '../../hooks/useProject'
import { useProjectOperations } from '../../hooks/useProjectOperations'
import { portalRef } from '../../portalRef'
import { useTranslation } from '../../translations/translation'
import { ScalingDialog } from '../ScalingDialog'
import { ColorPickerMenuItem } from './ColorPickerMenuItem'
import { StitchVisibilityMenuItem } from './StitchVisibilityMenuItem'

export const ViewMenu: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { updateColorSettings, updateStitchingSettings } = useProjectOperations()
  const leatherColorValues = useColors(modelColors)
  const threadColorValues = useColors(modelColors)
  const stitchHoleColorValues = useColors(stitchHoleColors)
  const stitchLineColorValues = useColors(stitchLineColors)
  const strokeColorValues = useColors(strokeColors)
  const selectionColorValues = useColors(selectionColors)
  const cardColorValues = useColors(cardColors)
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)

  const handleScalingButtonClick = useCallback(() => setScalingDialogOpen(true), [])

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button size="sm" variant="ghost">
            <PiCaretDown />
            {t.editor.menus.view.name}
          </Button>
        </Menu.Trigger>
        <Portal container={portalRef}>
          <Menu.Positioner>
            <Menu.Content>
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
              <Menu.Separator />
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>{t.editor.menus.view.colors.name}</Menu.ItemGroupLabel>
                <ColorPickerMenuItem
                  colors={leatherColorValues}
                  field="leatherColor"
                  label={t.editor.menus.view.colors.leatherColor}
                  onChange={updateColorSettings}
                  value={project.colorSettings.leatherColor}
                />
                <ColorPickerMenuItem
                  colors={strokeColorValues}
                  field="strokeColor"
                  label={t.editor.menus.view.colors.strokeColor}
                  onChange={updateColorSettings}
                  value={project.colorSettings.strokeColor}
                />
                <ColorPickerMenuItem
                  colors={cardColorValues}
                  field="cardColor"
                  label={t.editor.menus.view.colors.cardColor}
                  onChange={updateColorSettings}
                  value={project.colorSettings.cardColor}
                />
                <ColorPickerMenuItem
                  colors={stitchHoleColorValues}
                  field="stitchHoleColor"
                  label={t.editor.menus.view.colors.stitchHoleColor}
                  onChange={updateColorSettings}
                  value={project.colorSettings.stitchHoleColor}
                />
                <ColorPickerMenuItem
                  colors={stitchLineColorValues}
                  field="stitchLineColor"
                  label={t.editor.menus.view.colors.stitchLineColor}
                  onChange={updateColorSettings}
                  value={project.colorSettings.stitchLineColor}
                />
                <ColorPickerMenuItem
                  colors={threadColorValues}
                  field="threadColor"
                  label={t.editor.menus.view.colors.threadColor}
                  onChange={updateColorSettings}
                  value={project.colorSettings.threadColor}
                />
                <ColorPickerMenuItem
                  colors={selectionColorValues}
                  field="selectionColor"
                  label={t.editor.menus.view.colors.selectionColor}
                  onChange={updateColorSettings}
                  value={project.colorSettings.selectionColor}
                />
              </Menu.ItemGroup>
              <Menu.Separator />
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>{t.editor.menus.view.scaling.name}</Menu.ItemGroupLabel>
                <Menu.Item value="scaling" onSelect={handleScalingButtonClick}>
                  <PiRuler />
                  <Menu.ItemText>{t.editor.menus.view.scaling.scaling}</Menu.ItemText>
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <ScalingDialog isOpen={isScalingDialogOpen} onOpenChange={setScalingDialogOpen} />
    </>
  )
}
