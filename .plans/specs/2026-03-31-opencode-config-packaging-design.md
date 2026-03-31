# OpenCode Config Packaging Design

## Goal

Package the current OpenCode config as a reusable public GitHub repo named `opencode-config`, update `install.sh` so it bootstraps the repo cleanly with configurable source settings, and make the repository ready for publication.

## Scope

- Keep the repo as a bootstrapable config repository.
- Preserve the current config contents, plugin installation, MCP pre-caching, and symlink-based bootstrap flow.
- Generalize hard-coded personal repo references in the installer and README.
- Prepare local git state and create the public GitHub repository if authentication permits.

## Non-Goals

- Do not turn this into an npm package.
- Do not redesign the underlying OpenCode config structure.
- Do not replace the existing dynamic discovery of plugins or local MCP package commands.

## Recommended Approach

Use a repo-driven bootstrap flow with overridable defaults.

The installer should default to the published `opencode-config` repo, but accept environment-variable or flag overrides for the source repo, clone directory, and config directory. That keeps the one-command install path simple while also letting the same installer bootstrap from forks, alternate owners, or local paths.

## Installer Design

### Source selection

- Default GitHub repository slug should target the new `opencode-config` repository.
- The installer should support overriding:
  - repo slug / repo URL
  - clone destination
  - target config directory
- The update message at the end of the installer should reflect the configurable clone destination instead of a hard-coded `~/opencode-config` path.

### Bootstrap behavior

- Keep backup behavior for conflicting config paths.
- Keep symlinking the current manifest of root config files and config directories.
- Keep dependency installation inside the cloned repo.
- Keep dynamic discovery of OpenCode plugins from `opencode.json`.
- Keep dynamic discovery of local MCP packages from `opencode.json`.

### Safety behavior

- Refuse to reuse a clone directory that points to a different git origin.
- Allow a configurable clone location without weakening origin verification.
- Preserve existing warning summaries and install sequencing.

## Documentation Design

Update `README.md` so it reads as a reusable package rather than a personal dotfiles repo.

The README should include:

- default install command for the published repo
- configurable install examples using environment variables
- manual install steps using the new repo name
- update instructions that use the configurable clone path

## GitHub Publication Design

- Initialize git in the current directory if needed.
- Create a public GitHub repository named `opencode-config` under the authenticated account.
- Add the GitHub remote and leave the local repo ready for the user to inspect.
- Do not create commits unless explicitly requested.

## Risks and Mitigations

- GitHub repo creation may fail if `gh` is not authenticated or if the repo name is already taken under the account. Mitigation: check auth and current login before creation.
- The installer is already large, so changes should stay focused on configurability and wording rather than feature expansion.
- The local directory is not yet a git repo, so git initialization must happen before GitHub publication steps.

## Acceptance Criteria

- `install.sh` no longer hard-codes the old personal repo slug or fixed clone path.
- `install.sh` can bootstrap the repo with sensible defaults and configurable overrides.
- `README.md` documents the reusable install and update flow clearly.
- The directory is initialized as a git repo and connected to a public GitHub repo named `opencode-config`, if GitHub auth allows it.
