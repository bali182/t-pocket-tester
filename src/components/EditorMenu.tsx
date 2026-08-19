import { Button, Card, HStack, IconButton, Menu, Portal, Separator } from '@chakra-ui/react'
import { useCallback, useRef, useState } from 'react'
import { PiCaretDown, PiCaretLeft, PiExport, PiRuler } from 'react-icons/pi'
import { Link } from 'react-router'
import { appRoutes } from '../appRoutes'
import { useProject } from '../hooks/useProject'
import { useTranslation } from '../translations/translation'
import { PdfExportDialog } from './PdfExportDialog'
import { ProjectSettingsPopover } from './ProjectSettingsPopover'
import { ScalingDialog } from './ScalingDialog'
import { SvgExportDialog } from './SvgExportDialog'

export const EditorMenu = () => {
  const t = useTranslation()
  const { project } = useProject()
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const [isPdfExportDialogOpen, setPdfExportDialogOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isExportEnabled = project.subProjects.length > 0

  const handleScalingButtonClick = useCallback(() => setScalingDialogOpen(true), [])

  const handleSvgExportClick = useCallback(() => setSvgExportDialogOpen(true), [])

  const handlePdfExportClick = useCallback(() => setPdfExportDialogOpen(true), [])

  return (
    <>
      <Card.Root ref={menuRef}>
        <Card.Body padding="2" flexDirection="row" alignItems="center">
          <Link to={appRoutes.projects}>
            <IconButton size="sm" variant="ghost">
              <PiCaretLeft />
            </IconButton>
          </Link>
          <ProjectSettingsPopover
            anchorRef={menuRef}
            trigger={
              <Button size="sm" variant="ghost">
                {project.name}
              </Button>
            }
          />
          <Separator orientation="vertical" height="5" ml="3" mr="3" />
          <HStack gap="1">
            {/* File menu */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="sm" variant="ghost">
                  <PiCaretDown />
                  {t.editor.menus.file}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item disabled={!isExportEnabled} value="export-svg" onSelect={handleSvgExportClick}>
                      <PiExport />
                      <Menu.ItemText>{t.common.actions.exportSvg}</Menu.ItemText>
                    </Menu.Item>
                    <Menu.Item disabled={!isExportEnabled} value="export-pdf" onSelect={handlePdfExportClick}>
                      <PiExport />
                      <Menu.ItemText>{t.common.actions.exportPdf}</Menu.ItemText>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            {/* Edit menu */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="sm" variant="ghost">
                  <PiCaretDown />
                  {t.editor.menus.edit}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>{/* TODO */}</Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            {/* View menu */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="sm" variant="ghost">
                  <PiCaretDown />
                  {t.editor.menus.view}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="scaling" onSelect={handleScalingButtonClick}>
                      <PiRuler />
                      <Menu.ItemText>{t.common.actions.scaling}</Menu.ItemText>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Modals */}
      <>
        <ScalingDialog isOpen={isScalingDialogOpen} onOpenChange={setScalingDialogOpen} />
        {isExportEnabled && <SvgExportDialog isOpen={isSvgExportDialogOpen} onOpenChange={setSvgExportDialogOpen} />}
        {isExportEnabled && <PdfExportDialog isOpen={isPdfExportDialogOpen} onOpenChange={setPdfExportDialogOpen} />}
      </>
    </>
  )
}
