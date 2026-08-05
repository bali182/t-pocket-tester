import { EmptyState } from '@chakra-ui/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useLayoutEffect, type FC } from 'react'
import { PiWarningCircle } from 'react-icons/pi'
import { useParams } from 'react-router'

import { useProjects } from '../../hooks/useProjects'
import { subProjectAtom } from '../../state/subProjectAtom'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { Editor } from '../Editor'

export const SubProjectRoute: FC = () => {
  const { projectId } = useParams()
  const t = useTranslation()
  const { projects } = useProjects()
  const activeSubProject = useAtomValue(subProjectAtom)
  const setProject = useSetAtom(subProjectAtom)
  const subProject = projects.find((candidate) => candidate.id === projectId)

  useLayoutEffect(() => {
    if (isDefined(subProject)) {
      setProject(subProject)
    }
  }, [subProject, setProject])

  if (!isDefined(subProject)) {
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

  if (!isDefined(activeSubProject) || activeSubProject.id !== subProject.id) {
    return null
  }

  return <Editor />
}
