import { type FC } from 'react'

import { EditorContent } from '../../common/components/EditorContent'
import { ElectronEditorMenu } from './editor-menu/ElectronEditorMenu'

type ElectronEditorContentProps = {
  subProjectId: string | undefined
}

export const ElectronEditorContent: FC<ElectronEditorContentProps> = ({ subProjectId }) => {
  return <EditorContent menu={<ElectronEditorMenu />} subProjectId={subProjectId} />
}
