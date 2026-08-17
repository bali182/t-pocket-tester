import { MagicFixChangeRequest } from './magicFixChangeRequest'
import { MagicFixConfigSchema } from './magicFixConfig'
import { MagicFixIssueSchema } from './magicFixIssues'
import { ProjectSchema } from './project'
import { ComputedSubProjectSchema, SubProjectSchema } from './subProject'

type HasPlan<P> = {
  readonly plan: P
}

type HasState<S> = {
  state: S
}

type HasIterations = {
  iterations: number
}

type HasIteration = {
  iteration: number
}

type HasIssues = {
  issues: MagicFixIssueSchema[]
}

type HasOriginalSubProject = {
  originalSubProject: SubProjectSchema
}

export type MagicFixBaseInput = {
  project: ProjectSchema
  subProject: SubProjectSchema
  computed: ComputedSubProjectSchema
  config: MagicFixConfigSchema
}

export type MagicFixHeuristicsInput<P, S> = MagicFixBaseInput &
  HasIterations &
  HasIteration &
  HasIssues &
  HasOriginalSubProject &
  HasPlan<P> &
  HasState<S>

export type MagicFixHeuristicsPlanInput = MagicFixBaseInput & HasIterations

export type MagicFixHeuristicsGetInitialStateInput<P> = MagicFixBaseInput & HasIterations & HasPlan<P> & HasIssues

export type MagicFixHeuristicsResult<S> = HasState<S> & {
  requests: MagicFixChangeRequest[]
}

export type MagicFixHeuristics<P, S> = {
  getIterations: (input: MagicFixBaseInput) => number
  getPlan: (input: MagicFixHeuristicsPlanInput) => P
  getInitialState: (input: MagicFixHeuristicsGetInitialStateInput<P>) => S
  getNextState: (input: MagicFixHeuristicsInput<P, S>) => MagicFixHeuristicsResult<S>
}
