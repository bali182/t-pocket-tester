import type { KeySchema } from '../../common/schemas/command'
import { isDefined } from '../../common/utils/isDefined'
import { platform } from './platform'

const isAcceleratorKey = (key: KeySchema): boolean => {
  return key === 'Command' || key === 'Control' || key === 'CommandOrControl' || key === 'Alt' || key === 'Shift'
}

export const matchesShortcut = (shortcut: KeySchema[], event: KeyboardEvent): boolean => {
  if (platform === 'mobile') {
    return false
  }
  const hasCommand = shortcut.includes('Command')
  const hasControl = shortcut.includes('Control')
  const hasCommandOrControl = shortcut.includes('CommandOrControl')
  const hasAlt = shortcut.includes('Alt')
  const hasShift = shortcut.includes('Shift')
  const expectsMeta = hasCommand || (platform === 'mac' && hasCommandOrControl)
  const expectsControl = hasControl || (platform !== 'mac' && hasCommandOrControl)

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
