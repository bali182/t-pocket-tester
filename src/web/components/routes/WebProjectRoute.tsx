import type { FC } from 'react'
import { PiWarningCircle } from 'react-icons/pi'

import { Editor } from '../../../common/components/Editor'
import { CommonEmptyState } from '../../../common/components/common/CommonEmptyState'
import { EditorContext, useEditorContext } from '../../../common/contexts/EditorContext'
import { useTranslation } from '../../../common/translations/translation'
import { isDefined } from '../../../common/utils/isDefined'
import { useWebEditorContextValue } from '../../hooks/useWebEditorContextValue'

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

  return <Editor />
}
