import { beforeEach, describe, expect, it, vi } from 'vitest'

const { readFile, showOpenDialog, showSaveDialog, stat, writeFile } = vi.hoisted(() => ({
  readFile: vi.fn(),
  showOpenDialog: vi.fn(),
  showSaveDialog: vi.fn(),
  stat: vi.fn(),
  writeFile: vi.fn(),
}))

vi.mock('electron', () => ({
  dialog: {
    showOpenDialog,
    showSaveDialog,
  },
}))

vi.mock('node:fs/promises', () => ({
  readFile,
  stat,
  writeFile,
}))

import { fileManagementApi } from './fileManagementApi'

describe('fileManagementApi', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('opens a file selected in the native dialog', async () => {
    showOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/projects/example.json'] })
    readFile.mockResolvedValue('{"name":"Example"}')

    await expect(fileManagementApi.open({ type: 'dialog-open', fileFilterLabel: 'JSON files' })).resolves.toEqual({
      type: 'open-succeeded',
      contents: '{"name":"Example"}',
      filePath: '/projects/example.json',
    })

    expect(showOpenDialog).toHaveBeenCalledWith({
      filters: [{ name: 'JSON files', extensions: ['json'] }],
      properties: ['openFile'],
    })
  })

  it('returns cancelled when the open dialog is cancelled', async () => {
    showOpenDialog.mockResolvedValue({ canceled: true, filePaths: [] })

    await expect(fileManagementApi.open({ type: 'dialog-open', fileFilterLabel: 'JSON files' })).resolves.toEqual({
      type: 'open-cancelled',
    })
  })

  it('opens a known path without showing a dialog', async () => {
    readFile.mockResolvedValue('{"name":"Example"}')

    await expect(fileManagementApi.open({ type: 'path-open', filePath: '/projects/example.json' })).resolves.toEqual({
      type: 'open-succeeded',
      contents: '{"name":"Example"}',
      filePath: '/projects/example.json',
    })

    expect(showOpenDialog).not.toHaveBeenCalled()
  })

  it('saves a file selected in the native dialog', async () => {
    showSaveDialog.mockResolvedValue({ canceled: false, filePath: '/projects/example.json' })

    await expect(
      fileManagementApi.save({
        type: 'dialog-save',
        contents: '{"name":"Example"}',
        fileFilterLabel: 'JSON files',
        suggestedFileName: 'example.json',
      }),
    ).resolves.toEqual({ type: 'save-succeeded', filePath: '/projects/example.json' })

    expect(writeFile).toHaveBeenCalledWith('/projects/example.json', '{"name":"Example"}', 'utf8')
  })

  it('returns cancelled when the save dialog is cancelled', async () => {
    showSaveDialog.mockResolvedValue({ canceled: true, filePath: undefined })

    await expect(
      fileManagementApi.save({
        type: 'dialog-save',
        contents: '{"name":"Example"}',
        fileFilterLabel: 'JSON files',
        suggestedFileName: 'example.json',
      }),
    ).resolves.toEqual({ type: 'save-cancelled' })
  })

  it('saves to a known path without showing a dialog', async () => {
    await expect(
      fileManagementApi.save({
        type: 'path-save',
        contents: '{"name":"Example"}',
        filePath: '/projects/example.json',
      }),
    ).resolves.toEqual({ type: 'save-succeeded', filePath: '/projects/example.json' })

    expect(showSaveDialog).not.toHaveBeenCalled()
    expect(writeFile).toHaveBeenCalledWith('/projects/example.json', '{"name":"Example"}', 'utf8')
  })

  it('returns only existing files', async () => {
    stat.mockImplementation(async (filePath: string) => {
      if (filePath === '/projects/existing.json') {
        return { isFile: () => true }
      }

      const error = new Error('Not found') as Error & { code: string }
      error.code = 'ENOENT'
      throw error
    })

    await expect(
      fileManagementApi.exists({
        type: 'exists',
        filePaths: ['/projects/existing.json', '/projects/missing.json'],
      }),
    ).resolves.toEqual({
      type: 'exists-succeeded',
      existingFilePaths: ['/projects/existing.json'],
    })
  })
})
