# Two-Session Self-Driving Workflow

Full autonomous design review: one agent critiques, another fixes.

## Prerequisites

- Agentation toolbar installed on the target page
- shared CLI-backed annotation workflow available through `annotation-sync`
- `agent-browser` skill installed

## Setup

### Terminal 1 — The Critic (this skill)

```bash
claude
> /agentation-self-driving
```

This session opens the headed browser, scans the page, and adds design annotations. The user watches the browser as the agent navigates and critiques.

### Terminal 2 — The Fixer

```bash
claude
> Load `annotation-sync`, pull pending annotations in batches, fix each one,
> then resolve it with a short summary of what you changed.
```

This session polls or fetches pending annotations through the shared CLI workflow and edits the codebase to address the feedback.

## How It Connects

1. Critic adds annotation → it appears in the shared annotation queue
2. Fixer refreshes pending annotations through `annotation-sync`
3. Fixer reads the annotation (element path, CSS selectors, feedback text)
4. Fixer greps the codebase using the selectors/component names
5. Fixer makes changes, then resolves the annotation with a summary
6. Fixer loops back to the next pending annotation batch

## Flow Diagram

```
Browser (visible)          Terminal 1 (Critic)         Terminal 2 (Fixer)
─────────────────          ───────────────────         ──────────────────
User watches cursor    →   Scrolls, clicks elements   Polls pending annotations...
Annotation dialog      →   Fills critique, clicks Add
                           Annotation auto-sends  →   Receives annotation
                                                      Reads code, makes fix
                                                      Resolves annotation
                            Moves to next element  →   Pulls next pending batch...
```

## Tips

- Start the Fixer session first so it's ready when annotations arrive
- The Critic can add annotations faster than the Fixer processes them — that's fine, they queue up
- If the page hot-reloads from Fixer's changes, the Critic may need to re-expand the toolbar
- Both sessions share the same Agentation MCP tools configured in `~/.config/opencode/opencode.json`

