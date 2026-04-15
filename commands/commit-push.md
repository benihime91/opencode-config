---

## description: Commit and push changes to the current branch

Commit all changes and push the current branch to origin.

## Current State

- Branch: !`git branch --show-current`
- Status: !`git status --short`
- Diff: !`git diff HEAD`
- Recent commits (for style reference): !`git log --oneline -5`

## Instructions

1. If there are no changes to commit, say so and stop.
2. Stage all changes with `git add -A`.
3. Write a commit message following the conventional format and style of the recent commits above.
4. Commit the changes.
5. Push the branch to origin.
6. If $ARGUMENTS is provided, use it as the commit message body or to guide the message.

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

Do not ask for confirmation. Execute the commit and push in a single response.