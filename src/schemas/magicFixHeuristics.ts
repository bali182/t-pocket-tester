import { MagicFixChangeRequest } from './magicFixChangeRequest'
import { MagicFixConfigSchema } from './magicFixConfig'
import { MagicFixIssueSchema } from './magicFixIssues'
import { ProjectSchema } from './project'
import { ComputedSubProjectSchema, SubProjectSchema } from './subProject'

export type MagicFixHeuristicsInput = {
  project: ProjectSchema
  subProject: SubProjectSchema
  originalSubProject: SubProjectSchema
  computed: ComputedSubProjectSchema
  config: MagicFixConfigSchema
  issues: MagicFixIssueSchema[]
}

export type MagicFixHeuristicsInitialStateInput = {
  project: ProjectSchema
  subProject: SubProjectSchema
  computed: ComputedSubProjectSchema
  config: MagicFixConfigSchema
}

export type MagicFixHeuristicsResult<S> = {
  state: S
  requests: MagicFixChangeRequest[]
}

export type MagicFixHeuristics<S> = {
  getInitialState: (input: MagicFixHeuristicsInitialStateInput) => S
  getIterations: (input: MagicFixHeuristicsInitialStateInput) => number
  getNextState: (input: MagicFixHeuristicsInput, state: S) => MagicFixHeuristicsResult<S>
}
