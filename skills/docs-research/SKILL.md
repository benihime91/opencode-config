---
name: docs-research
description: Official docs, API examples, and targeted external research through native MCP tools.
---

# Docs Research

Use this skill for official docs lookup, API examples, code-context research, and known-URL extraction.

If the task becomes multi-source synthesis, competitive analysis, or a cited research memo, switch to `deep-research` instead.

## Workflow

1. Prefer official docs first.
2. Use Context7 MCP tools when the task is library or framework documentation.
3. Use Exa MCP tools when the task is broader code examples, web research, or URL crawling.
4. If local repo context matters, pair this skill with `repo-discovery`.

## Tool Patterns

Use MCP tools directly (no CLI wrapper needed):

**Context7** — for official library and framework documentation:

- `resolve-library-id(libraryName, query)` — resolve a library to its Context7 ID
- `query-docs(libraryId, query)` — query official docs for a resolved library

**Exa** — for broader code examples, web research, and URL reads:

- `web_search_exa(query, numResults)` — current-info lookup
- `get_code_context_exa(query, numResults)` — external code examples and API usage
- `crawling_exa(urls, maxCharacters)` — read known URLs in full

## Rules

- Cite source URLs in your summary.
- Be version-sensitive when researching library behavior.
- Use `repo-discovery` when external guidance must be matched to the local codebase.
