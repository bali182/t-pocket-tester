import { type FC } from 'react'

import { EditorContent } from '../../common/components/EditorContent'
import type { ProjectSchema } from '../../common/schemas/project'
import { ElectronEditorMenu } from './editor-menu/ElectronEditorMenu'

type ElectronEditorContentProps = {
  subProjectId: string | undefined
}

const noProjects: readonly ProjectSchema[] = []

export const ElectronEditorContent: FC<ElectronEditorContentProps> = ({ subProjectId }) => {
  return <EditorContent menu={<ElectronEditorMenu />} projects={noProjects} subProjectId={subProjectId} />
}
