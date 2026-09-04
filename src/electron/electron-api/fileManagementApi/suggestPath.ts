import { app } from 'electron'
import { join } from 'node:path'
import type {
  FileSuggestPathRequestSchema,
  FileSuggestPathResponseSchema,
} from '../../../common/schemas/fileManagement'

export const suggestPath = async (request: FileSuggestPathRequestSchema): Promise<FileSuggestPathResponseSchema> => {
  try {
    const fileName = getValidFileName(request.fileName)

    if (fileName === undefined) {
      return { type: 'error' }
    }

    return {
      type: 'suggested-path',
      filePath: join(app.getPath('documents'), `${fileName}.${request.extension}`),
    }
  } catch {
    return { type: 'error' }
  }
}

const getValidFileName = (fileName: string): string | undefined => {
  const sanitizedFileName = fileName
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    .replace(/[. ]+$/g, '')
    .trim()

  return sanitizedFileName === '' ? undefined : sanitizedFileName
}
