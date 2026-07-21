import { EmptyState } from '@chakra-ui/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useLayoutEffect, type FC } from 'react'
import { PiWarningCircle } from 'react-icons/pi'
import { useParams } from 'react-router-dom'

import { projectAtom } from '../../state/projectAtom'
import { projectsAtom } from '../../state/projectsAtom'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { Editor } from '../Editor'

export const ProjectRoute: FC = () => {
  const { projectId } = useParams()
  const t = useTranslation()
  const projects = useAtomValue(projectsAtom)
  const activeProject = useAtomValue(projectAtom)
  const setProject = useSetAtom(projectAtom)
  const project = projects.find((candidate) => candidate.id === projectId)

  useLayoutEffect(() => {
    if (isDefined(project)) {
      setProject(project)
    }
  }, [project, setProject])

  if (!isDefined(project)) {
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

  if (!isDefined(activeProject) || activeProject.id !== project.id) {
    return null
  }

  return <Editor />
}
