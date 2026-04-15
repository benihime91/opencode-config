---
description: Commit, push, and open a pull request
---

Commit all changes, push to origin, and open a pull request.

## Current State

- Branch: !`git branch --show-current`
- Default branch: !`git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo main`
- Status: !`git status --short`
- Diff: !`git diff HEAD`
- Recent commits (for style reference): !`git log --oneline -5`

## Instructions

1. If there are no changes to commit, say so and stop.
2. If on the default branch (main/master), create a new feature branch with a descriptive name derived from the changes.
3. Stage all changes with `git add -A`.
4. Write a commit message following the conventional format and style of the recent commits above.
5. Commit the changes.
6. Push the branch to origin with `-u` to set upstream tracking.
7. Create a pull request using `gh pr create` with:
   - A clear title matching the commit type and description
   - A body summarizing what changed and why
8. Output the PR URL when done.
9. If $ARGUMENTS is provided, use it to guide the branch name, commit message, and PR title.

### Commit Message Format

```
<type>(<optional scope>): <description>

<optional body>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, `style`, `build`

Rules:
- Description must be lowercase, imperative, and under 72 characters
- Body wraps at 72 characters and explains **why**, not what
- Match the style of recent commits in this repo

### PR Body Format

```markdown
## Summary

- Bullet points describing what changed

## Context

Brief explanation of why this change was made.
```

Do not ask for confirmation. Execute the full commit, push, and PR creation in a single response.
