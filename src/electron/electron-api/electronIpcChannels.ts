export const electronIpcChannels = {
  dialog: 'file-management:dialog',
  findExistingFilePaths: 'file-management:find-existing-file-paths',
  getTheme: 'theme:get',
  read: 'file-management:read',
  setTheme: 'theme:set',
  suggestPath: 'file-management:suggest-path',
  validateCreatePath: 'file-management:validate-create-path',
  write: 'file-management:write',
} as const
