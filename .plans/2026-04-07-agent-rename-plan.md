> **HISTORICAL:** Dated plan; naming and repo layout may differ from the current default. See [`HISTORICAL.md`](./HISTORICAL.md) and [`README.md`](../README.md).

# Agent Rename Plan

## Goal

Rename the custom agent roster from Greek-god names to the approved film/anime operator names, update all repo references, and keep each agent's role intact.

## Scope

- Rename the 11 agent files in `agents/`
- Update agent frontmatter names inside those files
- Update references in config, docs, prompts, planning memory, and workflow text
- Update the primary-agent color keys in `opencode.json`
- Preserve current role boundaries, permissions, and routing intent

## Approved Mapping

- `trinity` ← `aphrodite`
- `l` ← `apollo`
- `spike` ← `artemis`
- `motoko` ← `athena`
- `lelouch` ← `cronus`
- `cobb` ← `daedalus`
- `roy` ← `hephaestus`
- `neo` ← `hermes`
- `alfred` ← `hestia`
- `ripley` ← `themis`
- `morpheus` ← `zeus`

## Colors

- `trinity` `#40364D`
- `l` `#2E3A4F`
- `spike` `#5C6A4E`
- `motoko` `#3E5F67`
- `lelouch` `#5A426F`
- `cobb` `#5E5A57`
- `roy` `#6A3F3F`
- `neo` `#3F5A4B`
- `alfred` `#6A7153`
- `ripley` `#7A6854`
- `morpheus` `#4B3B63`

## Phases

1. Ground the rename blast radius across agents, config, docs, and planning files.
2. Apply the coordinated rename to filenames and in-file references.
3. Verify there are no stale Greek-agent references left in active repo surfaces.
