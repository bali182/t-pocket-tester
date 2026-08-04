import { Button, Card, HStack, IconButton, Menu, Portal, Separator } from '@chakra-ui/react'
import { useCallback, useRef, useState } from 'react'
import { PiCaretDown, PiCaretLeft, PiExport, PiRuler } from 'react-icons/pi'
import { Link } from 'react-router'
import { defaultPdfExportParams } from '../defaultStates'
import { useProject } from '../hooks/useProject'
import { exportPdf } from '../logic/exports/exportPdf'
import { getComputedPdfExport } from '../logic/exports/getComputedPdfExport'
import { useTranslation } from '../translations/translation'
import { ProjectSettingsPopover } from './ProjectSettingsPopover'
import { ScalingDialog } from './ScalingDialog'
import { SvgExportDialog } from './SvgExportDialog'

export const EditorMenu = () => {
  const t = useTranslation()
  const { computedProject, project } = useProject()
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const projectMenuRef = useRef<HTMLDivElement>(null)
  const handleScalingButtonClick = useCallback(() => setScalingDialogOpen(true), [])

  const handleSvgExportClick = useCallback(() => setSvgExportDialogOpen(true), [])
  const handlePdfExportClick = useCallback(() => {
    const pdfExport = getComputedPdfExport(project, computedProject, defaultPdfExportParams)
    if (pdfExport.layout.type !== 'successful-pdf-export') {
      return
    }
    void exportPdf(project, defaultPdfExportParams, pdfExport.elements, pdfExport.layout)
  }, [computedProject, project])

  return (
    <>
      <Card.Root ref={projectMenuRef} position="absolute" left="3" top="2" right="3">
        <Card.Body padding="2" flexDirection="row" alignItems="center">
          <Link to={`/projects`}>
            <IconButton size="sm" variant="ghost">
              <PiCaretLeft />
            </IconButton>
          </Link>
          <ProjectSettingsPopover
            anchorRef={projectMenuRef}
            trigger={
              <Button size="sm" variant="ghost">
                {project.name}
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
