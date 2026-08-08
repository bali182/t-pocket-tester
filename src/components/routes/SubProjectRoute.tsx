import { EmptyState } from '@chakra-ui/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'
import { PiWarningCircle } from 'react-icons/pi'
import { useNavigate, useParams } from 'react-router'
import { useOptionalSubProject } from '../../hooks/useOptionalSubProject'
import type { SubProjectRouteParams } from '../../schemas/routeParams'
import { pendingSubProjectDeletionAtom } from '../../state/pendigDeletionAtoms'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { EditorContent } from '../EditorContent'

export const SubProjectRoute: FC = () => {
  const t = useTranslation()
  const { subProjectId } = useParams<SubProjectRouteParams>()
  const pendingSubProjectDeletion = useAtomValue(pendingSubProjectDeletionAtom)
  const { subProject, computedSubProject } = useOptionalSubProject()

  if (!isDefined(subProject) || !isDefined(computedSubProject)) {
    if (isDefined(pendingSubProjectDeletion) && pendingSubProjectDeletion.subProjectId === subProjectId) {
      return (
        <PendingSubProjectDeletionRedirect
          redirectPath={pendingSubProjectDeletion.redirectPath}
        />
      )
    }

    return (
      <EmptyState.Root height="100%">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <PiWarningCircle />
          </EmptyState.Indicator>
          <EmptyState.Title>{t.projects.notFound.title}</EmptyState.Title>
          <EmptyState.Description textAlign="center">{t.projects.notFound.description}</EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return <EditorContent />
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
