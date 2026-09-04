import { useEffect, type FC } from 'react'
import { useParams } from 'react-router'
import { DrawAreaContext } from '../../contexts/DrawAreaContext'
import { useEditorDrawArea } from '../../hooks/useEditorDrawArea'
import { useOptionalSubProject } from '../../hooks/useOptionalSubProject'
import { useRecentProjectOperations } from '../../hooks/useRecentProjectOperations'
import type { SubProjectRouteParams } from '../../schemas/routeParams'
import { isDefined } from '../../utils/isDefined'
import { EditorContent } from '../EditorContent'

export const SubProjectRoute: FC = () => {
  const { projectId, subProjectId } = useParams<SubProjectRouteParams>()
  const { subProject } = useOptionalSubProject()
  const { markProjectOpened } = useRecentProjectOperations()
  const subProjectExists = isDefined(subProject)

  useEffect(() => {
    if (!subProjectExists || !isDefined(projectId) || !isDefined(subProjectId)) {
      return
    }

    markProjectOpened(projectId, subProjectId)
  }, [subProjectExists, markProjectOpened, projectId, subProjectId])

  if (!subProjectExists) {
    return <EditorContent subProjectId={subProjectId} />
  }

  return <ExistingSubProjectRoute subProjectId={subProjectId} />
}

type ExistingSubProjectRouteProps = {
  subProjectId: string | undefined
}

const ExistingSubProjectRoute: FC<ExistingSubProjectRouteProps> = ({ subProjectId }) => {
  const drawAreaContext = useEditorDrawArea()
  return (
    <DrawAreaContext.Provider value={drawAreaContext}>
      <EditorContent subProjectId={subProjectId} />
    </DrawAreaContext.Provider>
  )
}
