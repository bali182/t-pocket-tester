import type { CommandSchema } from '../../common/schemas/command'

type NativeElectronCommandIdSchema = 'copy' | 'paste' | 'cut' | 'close-window' | 'quit' | 'devtools' | 'select-all'

type NativeElectronCommand = CommandSchema<NativeElectronCommandIdSchema>

export const nativeElectronCommands: NativeElectronCommand[] = [
  {
    id: 'copy',
    shortcut: { default: ['CommandOrControl', 'KeyC'] },
  },
  {
    id: 'paste',
    shortcut: { default: ['CommandOrControl', 'KeyV'] },
  },
  {
    id: 'cut',
    shortcut: { default: ['CommandOrControl', 'KeyX'] },
  },
  {
    id: 'close-window',
    shortcut: { default: ['CommandOrControl', 'KeyW'] },
  },
  {
    id: 'quit',
    shortcut: { default: ['CommandOrControl', 'KeyQ'] },
  },
  {
    id: 'devtools',
    shortcut: { default: ['CommandOrControl', 'Alt', 'KeyI'] },
  },
  {
    id: 'select-all',
    shortcut: { default: ['CommandOrControl', 'KeyA'] },
  },
]
