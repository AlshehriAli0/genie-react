import { describe, expect, it } from 'vitest'
import { consumeCommitWork } from './commit-budget'
import { createCommitAnalysisBudget } from './render-commit-budget'

describe('commit analysis budget', () => {
  it('places the target deadline a full reserve past the general deadline', () => {
    const budget = createCommitAnalysisBudget(
      250,
      { timeLimitMs: 10, now: () => 0 },
      { timeLimitMs: 5, now: () => 0 },
    )

    expect(budget.work.deadlineAt).toBe(10)
    expect(budget.targetWork.deadlineAt).toBe(15)
  })

  it('applies the default reserve on top of the default general limit', () => {
    const budget = createCommitAnalysisBudget(250, { now: () => 0 }, { now: () => 0 })

    expect(budget.work.deadlineAt).toBe(8)
    expect(budget.targetWork.deadlineAt).toBe(12)
  })

  it('applies an explicit reserve on top of the default general limit', () => {
    const budget = createCommitAnalysisBudget(
      250,
      { now: () => 0 },
      { timeLimitMs: 25, now: () => 0 },
    )

    expect(budget.targetWork.deadlineAt).toBe(33)
  })

  it('leaves the reserve spendable once the general deadline has passed', () => {
    let clock = 0
    const budget = createCommitAnalysisBudget(
      250,
      { timeLimitMs: 10, now: () => clock },
      { timeLimitMs: 5, now: () => clock },
    )
    clock = 12

    expect(consumeCommitWork(budget.work, 'commit-fibers')).toBe(false)
    expect(consumeCommitWork(budget.targetWork, 'target-fibers')).toBe(true)
  })

  it('exhausts the reserve once the general limit plus the reserve has passed', () => {
    let clock = 0
    const budget = createCommitAnalysisBudget(
      250,
      { timeLimitMs: 10, now: () => clock },
      { timeLimitMs: 5, now: () => clock },
    )
    clock = 15

    expect(consumeCommitWork(budget.targetWork, 'target-fibers')).toBe(false)
  })

  it('keeps the target operation reserve independent of the general operation limit', () => {
    const budget = createCommitAnalysisBudget(
      250,
      { operationLimit: 1, timeLimitMs: 1_000, now: () => 0 },
      { operationLimit: 3, timeLimitMs: 1_000, now: () => 0 },
    )

    expect(consumeCommitWork(budget.work, 'commit-fibers')).toBe(true)
    expect(consumeCommitWork(budget.work, 'commit-fibers')).toBe(false)
    expect(consumeCommitWork(budget.targetWork, 'target-fibers')).toBe(true)
    expect(consumeCommitWork(budget.targetWork, 'target-fibers')).toBe(true)
    expect(consumeCommitWork(budget.targetWork, 'target-fibers')).toBe(true)
    expect(consumeCommitWork(budget.targetWork, 'target-fibers')).toBe(false)
  })
})
