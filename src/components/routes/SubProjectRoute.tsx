import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'
import { useNavigate, useParams } from 'react-router'
import { DrawAreaContext } from '../../contexts/DrawAreaContext'
import { useEditorDrawArea } from '../../hooks/useEditorDrawArea'
import { useOptionalSubProject } from '../../hooks/useOptionalSubProject'
import { useRecentProjectOperations } from '../../hooks/useRecentProjectOperations'
import type { SubProjectRouteParams } from '../../schemas/routeParams'
import { pendingSubProjectDeletionAtom } from '../../state/pendigDeletionAtoms'
import { isDefined } from '../../utils/isDefined'
import { EditorContent } from '../EditorContent'

export const SubProjectRoute: FC = () => {
  const { projectId, subProjectId } = useParams<SubProjectRouteParams>()
  const pendingSubProjectDeletion = useAtomValue(pendingSubProjectDeletionAtom)
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
    if (isDefined(pendingSubProjectDeletion) && pendingSubProjectDeletion.subProjectId === subProjectId) {
      return <PendingSubProjectDeletionRedirect redirectPath={pendingSubProjectDeletion.redirectPath} />
    }
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

type PendingSubProjectDeletionRedirectProps = {
  redirectPath: string
}

const PendingSubProjectDeletionRedirect: FC<PendingSubProjectDeletionRedirectProps> = ({ redirectPath }) => {
  const navigate = useNavigate()
  const setPendingSubProjectDeletion = useSetAtom(pendingSubProjectDeletionAtom)

  useEffect(() => {
    navigate(redirectPath, { replace: true })

    return () => {
      setPendingSubProjectDeletion(undefined)
    }
  }, [navigate, redirectPath, setPendingSubProjectDeletion])

  return null
}
