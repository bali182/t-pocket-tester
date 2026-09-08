import { type FC } from 'react'

import { EditorContent } from '../../common/components/EditorContent'
import { useProjects } from '../hooks/useProjects'
import { WebEditorMenu } from './editor-menu/WebEditorMenu'

type WebEditorContentProps = {
  subProjectId: string | undefined
}

export const WebEditorContent: FC<WebEditorContentProps> = ({ subProjectId }) => {
  const { projects } = useProjects()

  return <EditorContent menu={<WebEditorMenu />} projects={projects} subProjectId={subProjectId} />
}
