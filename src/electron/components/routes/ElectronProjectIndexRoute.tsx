import { useEffect, type FC } from 'react'

import { EditorContent } from '../../../common/components/EditorContent'
import { useProject } from '../../../common/hooks/useProject'
import { useRecentProjectOperations } from '../../../common/hooks/useRecentProjectOperations'

export const ElectronProjectIndexRoute: FC = () => {
  const { project } = useProject()
  const { markProjectOpened } = useRecentProjectOperations()

  useEffect(() => {
    markProjectOpened(project.id)
  }, [markProjectOpened, project.id])

  return <EditorContent subProjectId={undefined} />
}
