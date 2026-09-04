import { writeFile } from 'node:fs/promises'
import type { FileWriteRequestSchema, FileWriteResponseSchema } from '../../../common/schemas/fileManagement'

export const write = async (request: FileWriteRequestSchema): Promise<FileWriteResponseSchema> => {
  try {
    await writeFile(request.filePath, request.contents, 'utf8')

    return { type: 'write-succeeded' }
  } catch {
    return { type: 'error' }
  }
}
