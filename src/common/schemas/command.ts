export type AcceleratorKeySchema = 'Command' | 'Control' | 'CommandOrControl' | 'Alt' | 'Shift'

export type NumberKeySchema = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

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

export type KeySchema = AcceleratorKeySchema | NumberKeySchema | LetterKeySchema | FunctionKeySchema

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
  combination: KeySchema[]
}
