import type { NativePlatformSchema } from '../schemas/fileManagement'
import type { KeySchema } from '../schemas/shortcut'

const formatWinKey = (key: KeySchema): string => {
  switch (key) {
    case 'Command':
      return 'Command'
    case 'Control':
    case 'CommandOrControl':
      return 'Ctrl'
    case 'Alt':
      return 'Alt'
    case 'Shift':
      return 'Shift'
    default:
      return key
  }
}

const formatMacKey = (key: KeySchema): string => {
  switch (key) {
    case 'Command':
    case 'CommandOrControl':
      return '⌘'
    case 'Control':
      return '⌃'
    case 'Alt':
      return '⌥'
    case 'Shift':
      return '⇧'
    default:
      return key
  }
}

export const formatShortcut = (shortcut: KeySchema[], platform: NativePlatformSchema): string => {
  const separator = platform === 'darwin' ? '' : '+'
  const keyFormatter = platform === 'darwin' ? formatMacKey : formatWinKey

  return shortcut.map((key: KeySchema): string => keyFormatter(key)).join(separator)
}
