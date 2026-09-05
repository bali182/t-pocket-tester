import { useEffect, type FC } from 'react'
import { useParams } from 'react-router'

import { EditorContent } from '../../../common/components/EditorContent'
import { DrawAreaContext } from '../../../common/contexts/DrawAreaContext'
import { useEditorDrawArea } from '../../../common/hooks/useEditorDrawArea'
import { useOptionalProject } from '../../../common/hooks/useOptionalProject'
import { useOptionalSubProject } from '../../../common/hooks/useOptionalSubProject'
import { useRecentProjectOperations } from '../../../common/hooks/useRecentProjectOperations'
import { isDefined } from '../../../common/utils/isDefined'
import type { ElectronSubProjectRouteParamsSchema } from '../../schemas/electronRouteParams'

export const ElectronSubProjectRoute: FC = () => {
  const { subProjectId } = useParams<ElectronSubProjectRouteParamsSchema>()
  const { project } = useOptionalProject()
  const { subProject } = useOptionalSubProject()
  const { markProjectOpened } = useRecentProjectOperations()
  const subProjectExists = isDefined(subProject)

  useEffect(() => {
    if (!subProjectExists || !isDefined(project) || !isDefined(subProjectId)) {
      return
    }

    markProjectOpened(project.id, subProjectId)
  }, [markProjectOpened, project, subProjectExists, subProjectId])

  if (!subProjectExists) {
    return <EditorContent subProjectId={subProjectId} />
  }

  return <ExistingElectronSubProjectRoute subProjectId={subProjectId} />
}

type ExistingElectronSubProjectRouteProps = {
  subProjectId: string | undefined
}

const ExistingElectronSubProjectRoute: FC<ExistingElectronSubProjectRouteProps> = ({ subProjectId }) => {
  const drawAreaContext = useEditorDrawArea()

  return (
    <DrawAreaContext.Provider value={drawAreaContext}>
      <EditorContent subProjectId={subProjectId} />
    </DrawAreaContext.Provider>
  )
}
