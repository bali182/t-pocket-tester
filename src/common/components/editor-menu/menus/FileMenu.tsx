import { FC } from 'react'
import { isElectron } from '../../../platform/isElectron'
import { useTranslation } from '../../../translations/translation'
import { BaseMenu } from '../BaseMenu'
import { DownloadMenuGroup } from '../groups/DownloadMenuGroup'
import { ElectronFileManagementMenuGroup } from '../groups/ElectronFileManagementMenuGroup'
import { ExportMenuGroup } from '../groups/ExportMenuGroup'

export const FileMenu: FC = () => {
  const t = useTranslation()
  return (
    <BaseMenu title={t.editor.menus.file.name}>
      {isElectron() ? <ElectronFileManagementMenuGroup /> : <DownloadMenuGroup />}
      <ExportMenuGroup />
    </BaseMenu>
  )
}
