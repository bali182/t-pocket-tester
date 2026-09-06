import { Menu } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiExport } from 'react-icons/pi'
import { useProject } from '../../../hooks/useProject'
import { useTranslation } from '../../../translations/translation'
import { PdfExportDialog } from '../../PdfExportDialog'
import { SvgExportDialog } from '../../SvgExportDialog'

export const ExportMenuGroup: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const [isPdfExportDialogOpen, setPdfExportDialogOpen] = useState<boolean>(false)
  const isExportEnabled = project.subProjects.length > 0

  const handleSvgExportClick = useCallback(() => setSvgExportDialogOpen(true), [])
  const handlePdfExportClick = useCallback(() => setPdfExportDialogOpen(true), [])

  return (
    <>
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
      {/* Own modals */}
      {isExportEnabled && <SvgExportDialog isOpen={isSvgExportDialogOpen} onOpenChange={setSvgExportDialogOpen} />}
      {isExportEnabled && <PdfExportDialog isOpen={isPdfExportDialogOpen} onOpenChange={setPdfExportDialogOpen} />}
    </>
  )
}
