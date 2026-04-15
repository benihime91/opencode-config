> **HISTORICAL:** Dated plan. See [`HISTORICAL.md`](./HISTORICAL.md).

# Packaging Implementation Plan

## Goal

Implement the approved packaging design for this OpenCode config repo, verify the bootstrap flow locally, and create the public GitHub repository.

## File map

- Modify: `install.sh` — make bootstrap source and clone path configurable while preserving current bootstrap behavior.
- Modify: `README.md` — document reusable install, configuration overrides, and update flow.
- Create: `.gitignore` updates only if publication prep reveals a missing git hygiene need.
- Initialize: local `.git/` metadata and GitHub remote configuration.

## Tasks

### Task 1: Generalize installer defaults

- Replace the old hard-coded repo slug with reusable defaults for the new published repository.
- Add clear override points for repo slug or URL, clone directory, and config directory.
- Keep current clone safety checks, symlink manifest behavior, dependency installation, plugin install, and MCP pre-cache logic intact.

### Task 2: Update human-facing bootstrap docs

- Rewrite README install examples around the new repository name.
- Add an example that overrides install variables for forks or custom clone paths.
- Update the manual install and update sections to match the new installer behavior.

### Task 3: Verify locally

- Check the edited files directly.
- Run a shell syntax check on `install.sh`.
- If possible, dry-run the installer logic far enough to confirm variable expansion and no obvious path regressions.

### Task 4: Prepare GitHub publication

- Inspect GitHub auth status and current account.
- Initialize git locally if needed.
- Create the public GitHub repo `opencode-config` under the authenticated account if it does not already exist.
- Add `origin` to the new GitHub repository.

### Task 5: Summarize state

- Report the installer and README changes.
- Report whether GitHub repo creation succeeded.
- Call out any remaining manual steps, especially if a first commit or push is still needed.
