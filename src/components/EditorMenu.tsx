import { Button, Card, HStack, IconButton, Menu, Portal, Separator } from '@chakra-ui/react'
import { useCallback, useRef, useState } from 'react'
import { PiCaretDown, PiCaretLeft, PiExport, PiRuler } from 'react-icons/pi'
import { Link } from 'react-router'
import { defaultPdfExportParams } from '../defaultStates'
import { useSubProject } from '../hooks/useSubProject'
import { exportPdf } from '../logic/exports/exportPdf'
import { getComputedPdfExport } from '../logic/exports/getComputedPdfExport'
import { useTranslation } from '../translations/translation'
import { ProjectSettingsPopover } from './ProjectSettingsPopover'
import { ScalingDialog } from './ScalingDialog'
import { SvgExportDialog } from './SvgExportDialog'

export const EditorMenu = () => {
  const t = useTranslation()
  const { computedSubProject, subProject } = useSubProject()
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const handleScalingButtonClick = useCallback(() => setScalingDialogOpen(true), [])

  const handleSvgExportClick = useCallback(() => setSvgExportDialogOpen(true), [])
  const handlePdfExportClick = useCallback(() => {
    const pdfExport = getComputedPdfExport(subProject, computedSubProject, defaultPdfExportParams)
    if (pdfExport.layout.type !== 'successful-pdf-export') {
      return
    }
    void exportPdf(subProject, defaultPdfExportParams, pdfExport.elements, pdfExport.layout)
  }, [computedSubProject, subProject])

  return (
    <>
      <Card.Root ref={menuRef}>
        <Card.Body padding="2" flexDirection="row" alignItems="center">
          <Link to={`/projects`}>
            <IconButton size="sm" variant="ghost">
              <PiCaretLeft />
            </IconButton>
          </Link>
          <ProjectSettingsPopover
            anchorRef={menuRef}
            trigger={
              <Button size="sm" variant="ghost">
                {subProject.name}
              </Button>
            }
          />
          <Separator orientation="vertical" height="5" ml="3" mr="3" />
          <HStack gap="1">
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
                    <Menu.Item value="export-svg" onClick={handleSvgExportClick}>
                      <PiExport />
                      <Menu.ItemText>{t.common.actions.exportSvg}</Menu.ItemText>
                    </Menu.Item>
                    <Menu.Item value="export-pdf" onClick={handlePdfExportClick}>
                      <PiExport />
                      <Menu.ItemText>{t.common.actions.exportPdf}</Menu.ItemText>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
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
                    <Menu.Item value="scaling" onClick={handleScalingButtonClick}>
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
        <SvgExportDialog isOpen={isSvgExportDialogOpen} onOpenChange={setSvgExportDialogOpen} />
      </>
    </>
  )
}
