import { MagicFixConfigSchema } from './magicFixConfig'
import { MagicFixValidationIssueSchema } from './magicFixIssues'
import { ProjectSchema } from './project'
import { SubProjectSchema } from './subProject'
import { IssueSchema } from './validation'

export type MagicFixProgressSchema = {
  progress: number
  max: number
}

export type MagicFixSuccessSchema = {
  type: 'success'
  data: SubProjectSchema
}

export type MagicFixErrorSchema = {
  type: 'error'
  issues: IssueSchema[]
}

export type MagicFixNoResultSchema = {
  type: 'no-result'
  issues: MagicFixValidationIssueSchema[]
}

export type MagicFixResultSchema = MagicFixSuccessSchema | MagicFixErrorSchema | MagicFixNoResultSchema

export type MagicFixApi = (
  project: ProjectSchema,
  subProjectId: string,
  config: MagicFixConfigSchema,
  reportProgress: (progress: MagicFixProgressSchema) => void,
) => MagicFixResultSchema
