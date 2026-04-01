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

## 4. Match Observation Mode To The Task

- Choose the browser inspection mode that fits the task instead of defaulting to one capture style.
- Use interactive snapshots when you need stable actionable refs.
- Use plain or JSON snapshots for text, structure, or machine-readable extraction.
- Use annotated screenshots when layout, visual hierarchy, or spatial reasoning matter.
- If the current observation mode is not giving the needed evidence, switch modes before continuing.

See skills: `agent-browser`, `dogfood`, `slack`

## 5. Shell-Safe Browser Evaluation

- When using browser-side evaluation commands, prefer shell-safe input paths such as stdin, base64, or another documented quoting-safe mechanism.
- Do not rely on brittle nested quoting, history-expansion-sensitive syntax, or ad hoc escaping for complex eval payloads.
- If an eval command includes nested quotes, multiline code, or selector-heavy expressions, switch to a safer input form before running it.
- Treat unexpected eval behavior as a quoting risk first, then re-run with a shell-safe form.

See skills: `agent-browser`, `agentation-self-driving`

## 6. Reuse Authentication State When Safe

- Prefer an existing authenticated session, saved browser state, or persistent profile over repeating manual login flows.
- After a successful login in a multi-step browser workflow, save reusable state when later steps may need to resume or continue in another session.
- Only repeat a fresh login when reuse is unavailable, invalid, or explicitly inappropriate for the task.
- If a task depends on user-provided auth steps such as OTP, preserve the authenticated state once obtained instead of consuming that setup repeatedly.

See skills: `agent-browser`, `dogfood`, `slack`
