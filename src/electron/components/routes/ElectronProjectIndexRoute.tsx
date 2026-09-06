import { useEffect, type FC } from 'react'
import { useParams } from 'react-router'

import { EditorContent } from '../../../common/components/EditorContent'
import { useRecentProjectOperations } from '../../../common/hooks/useRecentProjectOperations'
import { isDefined } from '../../../common/utils/isDefined'
import type { ElectronProjectRouteParamsSchema } from '../../schemas/electronRouteParams'

export const ElectronProjectIndexRoute: FC = () => {
  const { filePath } = useParams<ElectronProjectRouteParamsSchema>()
  const { markOpened } = useRecentProjectOperations()

  useEffect(() => {
    if (!isDefined(filePath)) {
      return
    }

    markOpened(filePath)
  }, [filePath, markOpened])

  return <EditorContent subProjectId={undefined} />
}
