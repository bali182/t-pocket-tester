import { Button, Card, HStack, IconButton, Menu, Portal, Separator } from '@chakra-ui/react'
import { useCallback, useRef, useState } from 'react'
import { PiCaretDown, PiCaretLeft, PiExport, PiRuler } from 'react-icons/pi'
import { Link } from 'react-router'
import { defaultPdfExportParams } from '../defaultStates'
import { useOptionalSubProject } from '../hooks/useOptionalSubProject'
import { useProject } from '../hooks/useProject'
import { exportPdf } from '../logic/exports/exportPdf'
import { getComputedPdfExport } from '../logic/exports/getComputedPdfExport'
import { useTranslation } from '../translations/translation'
import { isDefined } from '../utils/isDefined'
import { ProjectSettingsPopover } from './ProjectSettingsPopover'
import { ScalingDialog } from './ScalingDialog'
import { SvgExportDialog } from './SvgExportDialog'

export const EditorMenu = () => {
  const t = useTranslation()
  const { project } = useProject()
  const activeSubProject = useOptionalSubProject()
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const handleScalingButtonClick = useCallback(() => setScalingDialogOpen(true), [])

  const handleSvgExportClick = useCallback(() => setSvgExportDialogOpen(true), [])
  const handlePdfExportClick = useCallback(() => {
    if (!isDefined(activeSubProject)) {
      return
    }
    const pdfExport = getComputedPdfExport(
      project,
      activeSubProject.subProject,
      activeSubProject.computedSubProject,
      defaultPdfExportParams,
    )
    if (pdfExport.layout.type !== 'successful-pdf-export') {
      return
    }
    exportPdf(project, activeSubProject.subProject, defaultPdfExportParams, pdfExport.elements, pdfExport.layout)
  }, [activeSubProject, project])

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
                    <Menu.Item
                      disabled={!isDefined(activeSubProject)}
                      value="export-svg"
                      onClick={handleSvgExportClick}
                    >
                      <PiExport />
                      <Menu.ItemText>{t.common.actions.exportSvg}</Menu.ItemText>
                    </Menu.Item>
                    <Menu.Item
                      disabled={!isDefined(activeSubProject)}
                      value="export-pdf"
                      onClick={handlePdfExportClick}
                    >
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
        {isDefined(activeSubProject) && (
          <SvgExportDialog isOpen={isSvgExportDialogOpen} onOpenChange={setSvgExportDialogOpen} />
        )}
      </>
    </>
  )
}
