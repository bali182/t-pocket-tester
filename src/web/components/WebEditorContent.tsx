import { type FC } from 'react'

import { EditorContent } from '../../common/components/EditorContent'
import { WebEditorMenu } from './editor-menu/WebEditorMenu'

type WebEditorContentProps = {
  subProjectId: string | undefined
}

export const WebEditorContent: FC<WebEditorContentProps> = ({ subProjectId }) => {
  return <EditorContent menu={<WebEditorMenu />} subProjectId={subProjectId} />
}
