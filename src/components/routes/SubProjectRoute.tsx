import { EmptyState } from '@chakra-ui/react'
import type { FC } from 'react'
import { PiWarningCircle } from 'react-icons/pi'
import { useOptionalSubProject } from '../../hooks/useOptionalSubProject'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { EditorContent } from '../EditorContent'

export const SubProjectRoute: FC = () => {
  const t = useTranslation()
  const subProject = useOptionalSubProject()

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

  return <EditorContent />
}
