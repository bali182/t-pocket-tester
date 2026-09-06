import { CommandSchema, CommonCommandIdSchema } from '../../common/schemas/command'

export type ElectronCommandIdSchema = CommonCommandIdSchema | 'save' | 'save-as' | 'open'

export type ElectronCommand = CommandSchema<ElectronCommandIdSchema>
