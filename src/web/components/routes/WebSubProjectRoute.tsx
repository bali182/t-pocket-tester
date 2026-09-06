import { useEffect, type FC } from 'react'
import { useParams } from 'react-router'

import { EditorContent } from '../../../common/components/EditorContent'
import { DrawAreaContext } from '../../../common/contexts/DrawAreaContext'
import { useEditorDrawArea } from '../../../common/hooks/useEditorDrawArea'
import { useOptionalSubProject } from '../../../common/hooks/useOptionalSubProject'
import { useRecentProjectOperations } from '../../../common/hooks/useRecentProjectOperations'
import { isDefined } from '../../../common/utils/isDefined'
import type { WebSubProjectRouteParamsSchema } from '../../schemas/webRouteParams'

export const WebSubProjectRoute: FC = () => {
  const { projectId, subProjectId } = useParams<WebSubProjectRouteParamsSchema>()
  const { subProject } = useOptionalSubProject()
  const { markOpened } = useRecentProjectOperations()
  const subProjectExists = isDefined(subProject)

  useEffect(() => {
    if (!subProjectExists || !isDefined(projectId) || !isDefined(subProjectId)) {
      return
    }

    markOpened(projectId, subProjectId)
  }, [subProjectExists, markOpened, projectId, subProjectId])

  if (!subProjectExists) {
    return <EditorContent subProjectId={subProjectId} />
  }

  return <ExistingWebSubProjectRoute subProjectId={subProjectId} />
}

type ExistingWebSubProjectRouteProps = {
  subProjectId: string | undefined
}

const ExistingWebSubProjectRoute: FC<ExistingWebSubProjectRouteProps> = ({ subProjectId }) => {
  const drawAreaContext = useEditorDrawArea()

  return (
    <DrawAreaContext.Provider value={drawAreaContext}>
      <EditorContent subProjectId={subProjectId} />
    </DrawAreaContext.Provider>
  )
}
