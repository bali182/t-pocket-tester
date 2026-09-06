import type { FC } from 'react'
import { PiWarningCircle } from 'react-icons/pi'

import { CommonEmptyState } from '../../../common/components/common/CommonEmptyState'
import { EditorContext, useEditorContext } from '../../../common/contexts/EditorContext'
import { useTranslation } from '../../../common/translations/translation'
import { isDefined } from '../../../common/utils/isDefined'
import { useWebEditorContextValue } from '../../hooks/useWebEditorContextValue'
import { WebEditor } from '../WebEditor'

export const WebProjectRoute: FC = () => {
  const editorContextValue = useWebEditorContextValue()

  return (
    <EditorContext.Provider value={editorContextValue}>
      <WebProjectRouteContent />
    </EditorContext.Provider>
  )
}

const WebProjectRouteContent: FC = () => {
  const t = useTranslation()
  const { project } = useEditorContext()

  if (!isDefined(project)) {
    return (
      <CommonEmptyState
        description={t.projects.notFound.description}
        icon={<PiWarningCircle />}
        title={t.projects.notFound.title}
      />
    )
  }

  return <WebEditor />
}
