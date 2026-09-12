export type AcceleratorKeySchema = 'Command' | 'Control' | 'CommandOrControl' | 'Alt' | 'Shift'

export type DigitKeySchema =
  | 'Digit0'
  | 'Digit1'
  | 'Digit2'
  | 'Digit3'
  | 'Digit4'
  | 'Digit5'
  | 'Digit6'
  | 'Digit7'
  | 'Digit8'
  | 'Digit9'

export type NumpadKeySchema =
  | 'Numpad0'
  | 'Numpad1'
  | 'Numpad2'
  | 'Numpad3'
  | 'Numpad4'
  | 'Numpad5'
  | 'Numpad6'
  | 'Numpad7'
  | 'Numpad8'
  | 'Numpad9'

export type FunctionKeySchema = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12'

export type LetterKeySchema =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'

export type KeySchema = AcceleratorKeySchema | LetterKeySchema | FunctionKeySchema | DigitKeySchema | NumpadKeySchema

export type CommandShortcutSchema = {
  default: KeySchema[]
  mac?: KeySchema[]
}

export type CommonCommandIdSchema =
  // File menu - Exports
  | 'export-pdf'
  | 'export-svg'
  // Edit menu - History
  | 'undo'
  | 'redo'
  // Edit menu - Increments
  | 'increment-small'
  | 'increment-medium'
  | 'increment-stitch-hole-distance'
  // View menu - stitching visibility
  | 'stitch-line-visibility'
  | 'stitch-hole-visibility'
  | 'stitches-visibility'
  | 'stitch-count-visibility'
  | 'scaling'

export type CommandSchema<C> = {
  id: C
  disabled?: boolean
  shortcut: CommandShortcutSchema
}
