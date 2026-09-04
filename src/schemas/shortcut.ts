export type AcceleratorKeySchema = 'Command' | 'Control' | 'CommandOrControl' | 'Alt' | 'Shift'

export type NumberKeySchema = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

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

export type KeySchema = AcceleratorKeySchema | NumberKeySchema | LetterKeySchema

export type CommandNameSchema = 'save' | 'save-as' | 'open'

export type CommandSchema = {
  id: CommandNameSchema
  disabled?: boolean
  combination: KeySchema[]
}
