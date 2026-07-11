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

export type ValidationResultValidSchema<I, O> = {
  isValid: true
  issues: ValidationIssuesSchema<I>
  value: O
}

export type ValidationResultInvalidSchema<I> = {
  isValid: false
  issues: ValidationIssuesSchema<I>
  value: undefined
}

export type ValidationResultSchema<I, O> =
  | ValidationResultValidSchema<I, O>
  | ValidationResultInvalidSchema<I>

export type ValidationContextSchema = {
  project: ProjectSchema
  computedProject: ComputedProjectSchema
  language: DecimalLocale
}

export type ValidatorSchema<I, O, Args extends readonly unknown[] = []> = (
  input: I,
  ...args: Args
) => ValidationResultSchema<I, O>
