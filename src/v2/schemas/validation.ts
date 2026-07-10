export type SeveritySchema = 'error' | 'warning' | 'info'

export type IssueSchema = {
  severity: SeveritySchema
  message: string
}

export type ValidationResult<T> = T extends Date
  ? IssueSchema | undefined
  : T extends readonly unknown[]
    ? { [K in keyof T]: ValidationResult<T[K]> }
    : T extends object
      ? { [K in keyof T]-?: ValidationResult<Exclude<T[K], undefined>> }
      : IssueSchema | undefined
