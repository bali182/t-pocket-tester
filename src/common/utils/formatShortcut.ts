import type { CommandShortcutSchema, KeySchema } from '../../common/schemas/command'
import { getCommandShortcut } from './getCommandShortcut'
import { platform } from './platform'

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

export const formatShortcut = (shortcut: CommandShortcutSchema): string | undefined => {
  if (platform === 'mobile') {
    return undefined
  }
  const separator = platform === 'mac' ? '' : '+'
  const keyFormatter = platform === 'mac' ? formatMacKey : formatWinKey
  return getCommandShortcut(shortcut)
    .map((key: KeySchema): string => keyFormatter(key))
    .join(separator)
}
