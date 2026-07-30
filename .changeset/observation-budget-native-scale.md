---
'genie-react': patch
'@genie-react/cli': patch
---

Allow callers to request render observation budgets large enough for large React Native screens. Defaults remain 250 fibers / 20,000 operations / 8ms, and adaptive growth applies only to later commits after exhaustion, so discard an incomplete one-action observation and rerun it with an explicit larger budget. The target deadline now extends one normalized reserve duration beyond the normalized general deadline, explicitly requested budgets are not clamped down to adaptive ceilings, and the opt-in ceilings rise to 20,000 fibers / 2,000,000 operations / 500ms (250ms target reserve).
