---
name: annotation-sync
description: Annotation collection, acknowledgement, reply, and resolution through CLI-backed mcporter workflows.
---

# Annotation Sync

Use this skill when the job is consuming, acknowledging, replying to, dismissing, or resolving Agentation annotations.

## Canonical Config

Use the shared mcporter config at:

```bash
~/.config/opencode/mcporter.json
```

## Workflow

1. List active sessions.
2. Fetch pending annotations.
3. Acknowledge before acting.
4. Reply if clarification is needed.
5. Resolve only after the requested change is complete.

## Command Patterns

Inspect available annotation tools when needed:

```bash
bunx mcporter list agentation --config ~/.config/opencode/mcporter.json
```

Common sync calls:

```bash
bunx mcporter call 'agentation.agentation_list_sessions()' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'agentation.agentation_get_all_pending()' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'agentation.agentation_acknowledge(annotationId: "<annotation-id>")' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'agentation.agentation_reply(annotationId: "<annotation-id>", message: "Working on this now.")' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'agentation.agentation_resolve(annotationId: "<annotation-id>", summary: "Adjusted spacing and CTA hierarchy.")' --config ~/.config/opencode/mcporter.json
```

## Rules

- Acknowledge before making changes.
- Resolve only after the requested change is actually complete.
- Leave rejected or disputed annotations open.
- Use `agentation-self-driving` for visible autonomous critique. Use this skill for the annotation lifecycle itself.
