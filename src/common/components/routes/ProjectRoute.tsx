import type { FC } from 'react'
import { PiWarningCircle } from 'react-icons/pi'

import { useOptionalProject } from '../../hooks/useOptionalProject'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { Editor } from '../Editor'
import { CommonEmptyState } from '../common/CommonEmptyState'

export const ProjectRoute: FC = () => {
  const { project } = useOptionalProject()
  const t = useTranslation()

  if (!isDefined(project)) {
    return (
      <CommonEmptyState
        description={t.projects.notFound.description}
        icon={<PiWarningCircle />}
        title={t.projects.notFound.title}
      />
    )
  }

  return <Editor />
}
