import { EmptyState } from '@chakra-ui/react'
import type { FC } from 'react'
import { PiWarningCircle } from 'react-icons/pi'

import { useOptionalProject } from '../../hooks/useOptionalProject'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { Editor } from '../Editor'

export const ProjectRoute: FC = () => {
  const { project } = useOptionalProject()
  const t = useTranslation()

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

  return <Editor />
}
