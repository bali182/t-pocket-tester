import { Menu } from '@chakra-ui/react'
import { FC } from 'react'
import {
  cardColors,
  modelColors,
  selectionColors,
  stitchHoleColors,
  stitchLineColors,
  strokeColors,
} from '../../../data/colors'
import { useColors } from '../../../hooks/useColors'
import { useProject } from '../../../hooks/useProject'
import { useProjectOperations } from '../../../hooks/useProjectOperations'
import { useTranslation } from '../../../translations/translation'
import { ColorPickerMenuItem } from '../items/ColorPickerMenuItem'

export const ColorsMenuGroup: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { updateColorSettings } = useProjectOperations()
  const leatherColorValues = useColors(modelColors)
  const threadColorValues = useColors(modelColors)
  const stitchHoleColorValues = useColors(stitchHoleColors)
  const stitchLineColorValues = useColors(stitchLineColors)
  const strokeColorValues = useColors(strokeColors)
  const selectionColorValues = useColors(selectionColors)
  const cardColorValues = useColors(cardColors)

  return (
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
  )
}
