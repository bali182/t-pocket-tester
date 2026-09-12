import type { CommandShortcutSchema, KeySchema } from '../schemas/command'
import { isDefined } from './isDefined'
import { platform } from './platform'

export const getCommandShortcut = (shortcut: CommandShortcutSchema): KeySchema[] => {
  if (platform === 'mac' && isDefined(shortcut.mac)) {
    return shortcut.mac
  }

  return shortcut.default
}
