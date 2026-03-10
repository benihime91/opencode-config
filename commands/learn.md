---
description: Extract patterns and learnings from current session
agent: build
---

# Learn Command

Extract patterns, learnings, and reusable insights from the current session: $ARGUMENTS

## Your Task

Analyze the session, planning files, and recent work to extract:

1. **Patterns discovered** - Recurring solutions or approaches
2. **Best practices applied** - Techniques that worked well
3. **Mistakes to avoid** - Issues encountered and solutions
4. **Reusable snippets** - Code patterns worth saving

## Required Workflow (AGENTS + planning-with-files compatible)

1. **Read project memory first**
   - Read `docs/task_plan.md`, `docs/findings.md`, and `docs/progress.md` if present.
   - Treat these as source-of-truth memory before drawing conclusions.

2. **Synthesize learnings from both session + files**
   - Combine current conversation context with persisted findings.
   - Prefer concrete, evidence-backed insights over generic advice.

3. **Write back to `docs/findings.md`**
   - If `docs/findings.md` exists: edit in place and prepend a new "Learn" entry at the top (newest-first).
   - If missing: create `docs/findings.md` using existing project conventions, then add the entry.
   - Never rewrite the whole file from scratch when it already exists.

4. **Respect AGENTS correction loop**
   - If this session includes a user correction/redirection, update `docs/lessons.md` with:
     - What I did
     - What the user instructed instead
     - Why my approach was incorrect or misaligned
     - Early detection signal I missed
     - Preventative rule or checklist update
     - Repo-specific nuance discovered

5. **Keep updates minimal and append-only in spirit**
   - Preserve existing sections and history.
   - Use targeted edits; avoid broad rewrites.

## Output Format

### Patterns Discovered

**Pattern: [Name]**

- Context: When to use this pattern
- Implementation: How to apply it
- Example: Code snippet

### Best Practices Applied

1. [Practice name]
   - Why it works
   - When to apply

### Mistakes to Avoid

1. [Mistake description]
   - What went wrong
   - How to prevent it

### Findings File Update

- Path updated: `docs/findings.md`
- Entry title: `Learn - [short topic]`
- What was added: 3-7 bullets of durable takeaways
- Evidence: references to files/changes/observations used

---

**TIP**: Run `/learn` periodically during long sessions to capture insights before context compaction, and keep `docs/findings.md` as the long-term memory log.
