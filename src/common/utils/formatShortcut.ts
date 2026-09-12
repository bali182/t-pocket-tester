import type {
  CommandShortcutSchema,
  DigitKeySchema,
  KeySchema,
  LetterKeySchema,
  NumpadKeySchema,
} from '../../common/schemas/command'
import type { PlatformSchema } from '../schemas/platform'
import { getCommandShortcut } from './getCommandShortcut'

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

const formattedLetterKeyByKey: Record<LetterKeySchema, string> = {
  KeyA: 'A',
  KeyB: 'B',
  KeyC: 'C',
  KeyD: 'D',
  KeyE: 'E',
  KeyF: 'F',
  KeyG: 'G',
  KeyH: 'H',
  KeyI: 'I',
  KeyJ: 'J',
  KeyK: 'K',
  KeyL: 'L',
  KeyM: 'M',
  KeyN: 'N',
  KeyO: 'O',
  KeyP: 'P',
  KeyQ: 'Q',
  KeyR: 'R',
  KeyS: 'S',
  KeyT: 'T',
  KeyU: 'U',
  KeyV: 'V',
  KeyW: 'W',
  KeyX: 'X',
  KeyY: 'Y',
  KeyZ: 'Z',
}

const isDigitKey = (key: KeySchema): key is DigitKeySchema => {
  return key in formattedDigitKeyByKey
}

const isNumpadKey = (key: KeySchema): key is NumpadKeySchema => {
  return key in formattedNumpadKeyByKey
}

const isLetterKey = (key: KeySchema): key is LetterKeySchema => {
  return key in formattedLetterKeyByKey
}

const formatKeyboardEventKey = (key: KeySchema): string => {
  if (isDigitKey(key)) {
    return formattedDigitKeyByKey[key]
  }
  if (isNumpadKey(key)) {
    return formattedNumpadKeyByKey[key]
  }
  if (isLetterKey(key)) {
    return formattedLetterKeyByKey[key]
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

export const formatShortcut = (shortcut: CommandShortcutSchema, platform: PlatformSchema): string | undefined => {
  if (platform === 'mobile') {
    return undefined
  }
  const separator = platform === 'mac' ? '' : '+'
  const keyFormatter = platform === 'mac' ? formatMacKey : formatWinKey
  return getCommandShortcut(shortcut, platform)
    .map((key: KeySchema): string => keyFormatter(key))
    .join(separator)
}
