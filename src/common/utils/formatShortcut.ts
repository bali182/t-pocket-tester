import type { CommandShortcutSchema, DigitKeySchema, KeySchema, NumpadKeySchema } from '../../common/schemas/command'
import { getCommandShortcut } from './getCommandShortcut'
import { platform } from './platform'

const formattedDigitKeyByKey: Record<DigitKeySchema, string> = {
  Digit0: '0',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
}

const formattedNumpadKeyByKey: Record<NumpadKeySchema, string> = {
  Numpad0: '0',
  Numpad1: '1',
  Numpad2: '2',
  Numpad3: '3',
  Numpad4: '4',
  Numpad5: '5',
  Numpad6: '6',
  Numpad7: '7',
  Numpad8: '8',
  Numpad9: '9',
}

const isDigitKey = (key: KeySchema): key is DigitKeySchema => {
  return key in formattedDigitKeyByKey
}

const isNumpadKey = (key: KeySchema): key is NumpadKeySchema => {
  return key in formattedNumpadKeyByKey
}

const formatKeyboardEventKey = (key: KeySchema): string => {
  if (isDigitKey(key)) {
    return formattedDigitKeyByKey[key]
  }
  if (isNumpadKey(key)) {
    return formattedNumpadKeyByKey[key]
  }
  return key
}

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
      return formatKeyboardEventKey(key)
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
      return formatKeyboardEventKey(key)
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
