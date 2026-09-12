import type { CommandShortcutSchema, KeySchema } from '../schemas/command'
import type { PlatformSchema } from '../schemas/platform'
import { isDefined } from './isDefined'

export const getCommandShortcut = (shortcut: CommandShortcutSchema, plaform: PlatformSchema): KeySchema[] => {
  if (plaform === 'mac' && isDefined(shortcut.mac)) {
    return shortcut.mac
  }

  return shortcut.default
}
