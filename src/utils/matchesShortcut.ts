import type { NativePlatformSchema } from '../schemas/fileManagement'
import type { KeySchema } from '../schemas/shortcut'
import { isDefined } from './isDefined'

const isAcceleratorKey = (key: KeySchema): boolean => {
  return key === 'Command' || key === 'Control' || key === 'CommandOrControl' || key === 'Alt' || key === 'Shift'
}

export const matchesShortcut = (
  shortcut: KeySchema[],
  event: KeyboardEvent,
  platform: NativePlatformSchema,
): boolean => {
  const hasCommand = shortcut.includes('Command')
  const hasControl = shortcut.includes('Control')
  const hasCommandOrControl = shortcut.includes('CommandOrControl')
  const hasAlt = shortcut.includes('Alt')
  const hasShift = shortcut.includes('Shift')
  const expectsMeta = hasCommand || (platform === 'darwin' && hasCommandOrControl)
  const expectsControl = hasControl || (platform !== 'darwin' && hasCommandOrControl)

  if (
    event.metaKey !== expectsMeta ||
    event.ctrlKey !== expectsControl ||
    event.altKey !== hasAlt ||
    event.shiftKey !== hasShift
  ) {
    return false
  }

  const pressedKey = event.key.toUpperCase()
  const shortcutKey = shortcut.find((key: KeySchema): boolean => !isAcceleratorKey(key))

  return isDefined(shortcutKey) && pressedKey === shortcutKey
}
