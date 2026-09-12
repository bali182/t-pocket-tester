import type { AcceleratorKeySchema, CommandShortcutSchema, KeySchema } from '../../common/schemas/command'
import { isDefined } from '../../common/utils/isDefined'
import { getCommandShortcut } from './getCommandShortcut'
import { keyboardEventMapping } from './keyboardEventMapping'
import { platform } from './platform'

const isAcceleratorKey = (key: KeySchema): key is AcceleratorKeySchema => {
  return key === 'Command' || key === 'Control' || key === 'CommandOrControl' || key === 'Alt' || key === 'Shift'
}

export const matchesShortcut = (shortcut: CommandShortcutSchema, event: KeyboardEvent): boolean => {
  if (platform === 'mobile') {
    return false
  }
  const keys = getCommandShortcut(shortcut)
  const hasCommand = keys.includes('Command')
  const hasControl = keys.includes('Control')
  const hasCommandOrControl = keys.includes('CommandOrControl')
  const hasAlt = keys.includes('Alt')
  const hasShift = keys.includes('Shift')
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

  const shortcutKey = keys.find((key: KeySchema) => !isAcceleratorKey(key))

  if (!isDefined(shortcutKey)) {
    return false
  }

  const eventField = keyboardEventMapping[shortcutKey]

  return event[eventField].toUpperCase() === shortcutKey.toUpperCase()
}
