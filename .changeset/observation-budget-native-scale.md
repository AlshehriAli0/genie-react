---
'genie-react': patch
'@genie-react/cli': patch
---

Let a render observation budget cover a full React Native screen. The target reserve now starts where the general time budget ends instead of expiring alongside it, an explicitly requested budget is no longer clamped down to the adaptive ceiling, and the ceilings rise to 20,000 fibers / 2,000,000 operations / 500ms (250ms target reserve).
