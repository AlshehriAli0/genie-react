import type { Fiber } from 'bippy'
import {
  type CommitWorkBudget,
  type CommitWorkBudgetOptions,
  createCommitWorkBudget,
  DEFAULT_TIME_LIMIT_MS,
} from './commit-budget'
import type { CurrentCommitEvidence } from './render-outcomes'

const DEFAULT_COMMIT_FIBER_ANALYSIS_LIMIT = 250
const DEFAULT_TARGET_OPERATION_RESERVE = 4_000
const DEFAULT_TARGET_TIME_RESERVE_MS = 4

export interface CommitAnalysisBudget {
  processed: number
  skipped: number
  failed: number
  limit: number
  work: CommitWorkBudget
  targetProcessed: number
  targetSkipped: number
  targetWork: CommitWorkBudget
  currentCommitEvidence: CurrentCommitEvidence
}

export function createCommitAnalysisBudget(
  limit = DEFAULT_COMMIT_FIBER_ANALYSIS_LIMIT,
  workOptions?: CommitWorkBudgetOptions,
  targetWorkOptions?: CommitWorkBudgetOptions,
): CommitAnalysisBudget {
  return {
    processed: 0,
    skipped: 0,
    failed: 0,
    limit,
    work: createCommitWorkBudget(workOptions),
    targetProcessed: 0,
    targetSkipped: 0,
    targetWork: createCommitWorkBudget({
      operationLimit: targetWorkOptions?.operationLimit ?? DEFAULT_TARGET_OPERATION_RESERVE,
      timeLimitMs:
        (workOptions?.timeLimitMs ?? DEFAULT_TIME_LIMIT_MS) +
        (targetWorkOptions?.timeLimitMs ?? DEFAULT_TARGET_TIME_RESERVE_MS),
      now: targetWorkOptions?.now ?? workOptions?.now,
    }),
    currentCommitEvidence: {
      renderedFibers: new Set<Fiber>(),
      hostMutationFibers: new Set<Fiber>(),
      hostMutationCaptureComplete: false,
    },
  }
}
