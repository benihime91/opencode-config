# Browser Automation Rules

These rules govern browser and UI automation workflows in this repo.

## 1. UI State Freshness

- Inspect the current UI state before interacting.
- Re-snapshot or otherwise refresh that inspection after navigation, submission, modal open or close, dynamic content load, or any action that can invalidate refs.
- Do not reuse old element refs or prior-page assumptions after the UI changes.

See skills: `agent-browser`, `electron`, `slack`

## 2. UI Action Verification

- Add an explicit verification step after important actions.
- Acceptable verification includes waits for load or selectors, fresh snapshots, diffs, screenshots, counters, or other direct observable checks.
- Do not chain state-changing actions on trust alone when later steps depend on success.
- When verification fails, stop, re-ground, and recover before continuing.

See skills: `agent-browser`, `agentation-self-driving`, `dogfood`

## 3. Session And Recovery Discipline

- Create isolated sessions for multi-step work and for concurrent automations.
- Give sessions stable names when more than one flow may be active.
- Close sessions, browsers, or sandboxes when the task is complete.
- Prefer the smallest recovery step that restores valid state.
- Do not wipe state, restart everything, or destroy evidence unless narrower recovery has failed.

See skills: `agent-browser`, `dogfood`, `electron`, `agentation-self-driving`
