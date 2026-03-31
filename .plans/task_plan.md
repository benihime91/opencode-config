# Task Plan: package and bootstrap opencode config

## Goal

Turn the current local OpenCode config into a reusable, configurable package, update `install.sh` so it can bootstrap that package cleanly, and prepare the repo for publication as a GitHub repository.

## Current Phase

Phase 4 — complete

## Phases

### Phase 1: Context recovery and packaging scope
- [x] Re-read planning memory and current repo structure
- [x] Inspect current packaging/bootstrap surfaces (`install.sh`, config manifest, docs)
- [x] Identify decisions needed for configurable packaging and GitHub publication
- **Status:** complete

### Phase 2: Design and approval
- [x] Ask the minimum clarifying questions needed
- [x] Propose packaging/bootstrap approaches with recommendation
- [x] Present the design and get user approval before implementation
- **Status:** complete

### Phase 3: Implementation
- [x] Update packaging/bootstrap files with the approved design
- [x] Add any missing repo metadata needed for reusable publication
- [x] Prepare local git repository state for GitHub publication
- **Status:** complete

### Phase 4: Verification and publication handoff
- [x] Verify the bootstrap flow as far as possible locally
- [x] Create the GitHub repository if credentials and naming are available
- [x] Summarize what changed and any remaining manual steps
- **Status:** complete

## Key Questions

1. What should be configurable in the packaged bootstrap flow versus copied verbatim from this local config?
2. How should `install.sh` source the package: local clone only, GitHub URL, or both?
3. What repository name and visibility should be used for GitHub publication? → `opencode-config`, public

## Decisions Made

| Decision | Rationale |
| -------- | --------- |
| Use the current `~/.config/opencode` directory as the source package | The user asked to package the current config and bootstrap it |
| Treat this as a reusable config repo rather than an npm package | The current repo already packages prompts, plugins, config JSON, and an installer, while `package.json` only supports local plugin dependencies |
| Target a public GitHub repo named `opencode-config` | The user selected `opencode-config public` when asked for the publication target |
| Use repo-driven bootstrap with overridable defaults | This keeps one-command install simple while still supporting forks, alternate owners, and custom clone locations |

## Errors Encountered

| Error | Attempt | Resolution |
| ----- | ------- | ---------- |
| `git diff --stat` unsupported in this non-git config directory | 1 | Treat prior `.plans/*` files as the session catch-up source instead |

## Notes

- This is now a packaging/publishing task, not another harness-comparison pass.
- Because the request changes packaging/bootstrap behavior, design approval is required before implementation.
- The current installer and README are still personal-repo oriented and must be generalized before publication.
- Verification in this pass used file inspection, `bash -n install.sh`, and git/gh remote checks; a full destructive installer run was intentionally skipped.
- The final published push included both the packaging/bootstrap updates from this pass and earlier unpublished local config changes that were already present relative to `origin/main`.
