import {
  Button,
  Card,
  ColorSwatch,
  HStack,
  Icon,
  IconButton,
  Menu,
  Portal,
  Separator,
  Switch,
  Text,
} from '@chakra-ui/react'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import {
  PiCaretDown,
  PiCaretLeft,
  PiExport,
  PiEye,
  PiEyeSlash,
  PiMoon,
  PiNeedle,
  PiPalette,
  PiRuler,
  PiSun,
  PiWalletDuotone,
} from 'react-icons/pi'
import { Link } from 'react-router'
import { appRoutes } from '../appRoutes'
import {
  cardColors,
  modelColors,
  selectionColors,
  stitchHoleColors,
  stitchLineColors,
  strokeColors,
} from '../data/colors'
import { useColors, type ColorValue } from '../hooks/useColors'
import { useProject } from '../hooks/useProject'
import { useProjectOperations } from '../hooks/useProjectOperations'
import { useTheme } from '../hooks/useTheme'
import { portalRef } from '../portalRef'
import type { ColorSettingsSchema } from '../schemas/settings'
import type { StitchingVisibilityConfigSchema, StitchLineCommonConfigSchema } from '../schemas/stitching'
import { useTranslation } from '../translations/translation'
import { isDefined } from '../utils/isDefined'
import { MenuColorSwatchItem, SelectableColorSwatch } from './common/SelectableColorSwatch'
import { PdfExportDialog } from './PdfExportDialog'
import { ProjectSettingsPopover } from './ProjectSettingsPopover'
import { ScalingDialog } from './ScalingDialog'
import { SvgExportDialog } from './SvgExportDialog'

export const EditorMenu = () => {
  const { project } = useProject()
  const { theme, setTheme } = useTheme()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleThemeChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => setTheme(details.checked ? 'dark' : 'light'),
    [setTheme],
  )

  return (
    <>
      <Card.Root ref={menuRef}>
        <Card.Body padding="2" flexDirection="row" alignItems="center">
          <Link to={appRoutes.projects}>
            <IconButton size="sm" variant="ghost" mr="1" borderRadius="full">
              <PiCaretLeft />
            </IconButton>
          </Link>
          <ProjectSettingsPopover
            anchorRef={menuRef}
            trigger={
              <Button flexShrink="1" minWidth="0" size="sm" variant="ghost">
                <PiWalletDuotone />
                <Text maxWidth="sm" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                  {project.name}
                </Text>
              </Button>
            }
          />
          <Separator orientation="vertical" height="5" ml="3" mr="3" />
          <HStack gap="1">
            <FileMenu />
            <EditMenu />
            <ViewMenu />
          </HStack>
          <Separator orientation="vertical" height="5" ml="3" mr="7" />
          <Switch.Root checked={theme === 'dark'} onCheckedChange={handleThemeChange} size="lg">
            <Switch.HiddenInput />
            <Switch.Control bg="bg.emphasized" _checked={{ bg: 'bg.emphasized' }}>
              <Switch.Thumb bg="bg.panel" _checked={{ bg: 'bg.panel' }} />
              <Switch.Indicator fallback={<PiSun />}>
                <PiMoon />
              </Switch.Indicator>
            </Switch.Control>
          </Switch.Root>
        </Card.Body>
      </Card.Root>
    </>
  )
}

const FileMenu: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const [isPdfExportDialogOpen, setPdfExportDialogOpen] = useState<boolean>(false)
  const isExportEnabled = project.subProjects.length > 0

  const handleSvgExportClick = useCallback(() => setSvgExportDialogOpen(true), [])
  const handlePdfExportClick = useCallback(() => setPdfExportDialogOpen(true), [])

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button size="sm" variant="ghost">
            <PiCaretDown />
            {t.editor.menus.file.name}
          </Button>
        </Menu.Trigger>
        <Portal container={portalRef}>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>{t.editor.menus.file.export.name}</Menu.ItemGroupLabel>
                <Menu.Item disabled={!isExportEnabled} value="export-svg" onSelect={handleSvgExportClick}>
                  <PiExport />
                  <Menu.ItemText>{t.editor.menus.file.export.svg}</Menu.ItemText>
                </Menu.Item>
                <Menu.Item disabled={!isExportEnabled} value="export-pdf" onSelect={handlePdfExportClick}>
                  <PiExport />
                  <Menu.ItemText>{t.editor.menus.file.export.pdf}</Menu.ItemText>
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {/* Own modals */}
      {isExportEnabled && <SvgExportDialog isOpen={isSvgExportDialogOpen} onOpenChange={setSvgExportDialogOpen} />}
      {isExportEnabled && <PdfExportDialog isOpen={isPdfExportDialogOpen} onOpenChange={setPdfExportDialogOpen} />}
    </>
  )
}

type NumberEditStepItem = {
  key: string
  isSelected: boolean
  title: string
  subTitle: string
  action: () => void
}

const EditMenu: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { updateEditingSettings } = useProjectOperations()

  const stepMenuItems = useMemo(
    (): NumberEditStepItem[] => [
      {
        key: '0.01',
        isSelected: project.editingSettings.numberEditorStep === 0.01,
        title: t.editor.menus.edit.step.tiny,
        subTitle: t.editor.menus.edit.step.size(0.01),
        action: () => updateEditingSettings({ numberEditorStep: 0.01 }),
      },
      {
        key: '0.1',
        isSelected: project.editingSettings.numberEditorStep === 0.1,
        title: t.editor.menus.edit.step.small,
        subTitle: t.editor.menus.edit.step.size(0.1),
        action: () => updateEditingSettings({ numberEditorStep: 0.1 }),
      },
      {
        key: '1',
        isSelected: project.editingSettings.numberEditorStep === 1,
        title: t.editor.menus.edit.step.default,
        subTitle: t.editor.menus.edit.step.size(1),
        action: () => updateEditingSettings({ numberEditorStep: 1 }),
      },
      {
        key: 'stitch-hole-distance',
        isSelected: project.editingSettings.numberEditorStep === 'stitch-hole-distance',
        title: t.editor.menus.edit.step.stitch,
        subTitle: t.editor.menus.edit.step.size(project.stitchingSettings.stitchHoleDistance),
        action: () => updateEditingSettings({ numberEditorStep: 'stitch-hole-distance' }),
      },
    ],
    [
      project.editingSettings.numberEditorStep,
      project.stitchingSettings.stitchHoleDistance,
      t.editor.menus.edit.step,
      updateEditingSettings,
    ],
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
                <Menu.ItemGroupLabel>{t.editor.menus.edit.step.name}</Menu.ItemGroupLabel>
                {stepMenuItems.map(({ key, subTitle, title, isSelected, action }) => (
                  <Menu.Item
                    value={key}
                    key={key}
                    onSelect={action}
                    background={isSelected ? 'bg.emphasized' : undefined}
                  >
                    <Menu.ItemText fontWeight={isSelected ? 'semibold' : undefined}>{title}</Menu.ItemText>
                    <Menu.ItemCommand fontWeight={isSelected ? 'bold' : undefined}>{subTitle}</Menu.ItemCommand>
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  )
}

const ViewMenu: FC = () => {
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

type StitchVisibilityMenuItemProps = {
  value: boolean
  label: string
  field: keyof StitchingVisibilityConfigSchema
  onChange: (update: Partial<StitchLineCommonConfigSchema>) => void
}

const StitchVisibilityMenuItem: FC<StitchVisibilityMenuItemProps> = ({ onChange, field, value, label }) => {
  const toggle = useCallback(() => onChange({ [field]: !value }), [field, onChange, value])

  return (
    <Menu.Item onSelect={toggle} value={field} closeOnSelect={false}>
      <PiNeedle />
      <Menu.ItemText mr="2">{label}</Menu.ItemText>
      {value ? <PiEye /> : <Icon as={PiEyeSlash} color="fg.muted" />}
    </Menu.Item>
  )
}

type ColorPickerMenuItemProps = {
  colors: ColorValue[]
  field: keyof ColorSettingsSchema
  label: string
  onChange: (update: Partial<ColorSettingsSchema>) => void
  value: string
}

const ColorPickerMenuItem: FC<ColorPickerMenuItemProps> = ({ colors, field, label, onChange, value }) => {
  const handleColorChange = useCallback(
    (color: string | undefined): void => {
      if (!isDefined(color)) {
        return
      }
      onChange({ [field]: color })
    },
    [field, onChange],
  )

  return (
    <Menu.Root positioning={{ placement: 'right-start' }}>
      <Menu.TriggerItem>
        <PiPalette />
        <Menu.ItemText mr="2">{label}</Menu.ItemText>
        <ColorSwatch size="sm" value={value} />
      </Menu.TriggerItem>
      <Portal container={portalRef}>
        <Menu.Positioner>
          <Menu.Content p="3" width="fit-content">
            <SelectableColorSwatch
              Item={MenuColorSwatchItem}
              canReset={false}
              colors={colors}
              onChange={handleColorChange}
              value={value}
            />
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
