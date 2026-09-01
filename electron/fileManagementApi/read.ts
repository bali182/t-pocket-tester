import { readFile } from 'node:fs/promises'
import type { FileReadRequestSchema, FileReadResponseSchema } from '../../src/schemas/fileManagement'

export const read = async (request: FileReadRequestSchema): Promise<FileReadResponseSchema> => {
  try {
    return {
      type: 'read-succeeded',
      contents: await readFile(request.filePath, 'utf8'),
    }
  } catch {
    return { type: 'error' }
  }
}
