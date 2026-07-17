import type { DecimalLocale } from 'validator/es/lib/isDecimal'

import type { ComputedProjectSchema, ProjectSchema } from './project'

export type SeveritySchema = 'error' | 'warning' | 'info'

export type IssueSchema = {
  severity: SeveritySchema
  message: string
}

export type ValidationIssuesSchema<T> = T extends readonly unknown[]
  ? { [K in keyof T]: ValidationIssuesSchema<T[K]> }
  : T extends object
    ? { [K in keyof T]-?: ValidationIssuesSchema<Exclude<T[K], undefined>> }
    : IssueSchema | undefined

export type ValidationResultValidSchema<T> = {
  isValid: true
  issues: ValidationIssuesSchema<T>
  value: T
  committedValue: T
}

export type ValidationResultInvalidSchema<T> = {
  isValid: false
  issues: ValidationIssuesSchema<T>
  value: undefined
  committedValue: T
}

export type ValidationResultSchema<T> = ValidationResultValidSchema<T> | ValidationResultInvalidSchema<T>

export type ValidationContextSchema = {
  project: ProjectSchema
  computedProject: ComputedProjectSchema
  language: DecimalLocale
}
