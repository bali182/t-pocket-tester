import { useEffect, type FC } from 'react'
import { useParams } from 'react-router'

import { useRecentProjectOperations } from '../../../common/hooks/useRecentProjectOperations'
import { isDefined } from '../../../common/utils/isDefined'
import type { ElectronProjectRouteParamsSchema } from '../../schemas/electronRouteParams'
import { ElectronEditorContent } from '../ElectronEditorContent'

export const ElectronProjectIndexRoute: FC = () => {
  const { filePath } = useParams<ElectronProjectRouteParamsSchema>()
  const { markOpened } = useRecentProjectOperations()

  useEffect(() => {
    if (!isDefined(filePath)) {
      return
    }

    markOpened(filePath)
  }, [filePath, markOpened])

  return <ElectronEditorContent subProjectId={undefined} />
}
