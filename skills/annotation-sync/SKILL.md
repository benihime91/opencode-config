---
name: annotation-sync
description: Annotation collection, acknowledgement, reply, and resolution through native Agentation MCP tools.
---

# Annotation Sync

Use this skill when the job is consuming, acknowledging, replying to, dismissing, or resolving Agentation annotations.

Agentation MCP tools are available directly — no CLI wrapper needed.

## Workflow

1. List active sessions.
2. Fetch pending annotations.
3. Acknowledge before acting.
4. Reply if clarification is needed.
5. Resolve only after the requested change is complete.

## Available MCP Tools

- `agentation_list_sessions()` — list active annotation sessions
- `agentation_get_all_pending()` — fetch all pending annotations
- `agentation_acknowledge(annotationId)` — acknowledge an annotation before making changes
- `agentation_reply(annotationId, message)` — reply to an annotation for clarification
- `agentation_resolve(annotationId, summary)` — resolve an annotation after completing the change

## Rules

- Acknowledge before making changes.
- Resolve only after the requested change is actually complete.
- Leave rejected or disputed annotations open.
- Use `agentation-self-driving` for visible autonomous critique. Use this skill for the annotation lifecycle itself.
- Before calling annotation tools, verify the Agentation MCP provider is available. If a tool call returns an unexpected shape or connection error, treat it as a provider-availability issue — do not retry blindly.
