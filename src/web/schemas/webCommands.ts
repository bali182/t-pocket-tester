import { CommandSchema, CommonCommandIdSchema } from '../../common/schemas/command'

export type WebCommandIdSchema = 'download-project' | CommonCommandIdSchema

export type WebCommandSchema = CommandSchema<WebCommandIdSchema>
