---
name: docs-research
description: Official docs, API examples, and targeted external research through CLI-backed mcporter workflows.
---

# Docs Research

Use this skill for official docs lookup, API examples, code-context research, and known-URL extraction.

If the task becomes multi-source synthesis, competitive analysis, or a cited research memo, switch to `deep-research` instead.

## Canonical Config

Use the shared mcporter config at:

```bash
~/.config/opencode/mcporter.json
```

## Workflow

1. Prefer official docs first.
2. Use Context7 when the task is library or framework documentation.
3. Use Exa when the task is broader code examples, web research, or URL crawling.
4. If local repo context matters, pair this skill with `repo-discovery`.

## Command Patterns

Inspect tool signatures when needed:

```bash
bunx mcporter list context7 --config ~/.config/opencode/mcporter.json
bunx mcporter list exa --config ~/.config/opencode/mcporter.json
```

Common docs and research calls:

```bash
bunx mcporter call 'context7.resolve-library-id(libraryName: "react", query: "React hooks docs")' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'context7.query-docs(libraryId: "/websites/react_dev", query: "useEffect cleanup examples")' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'exa.get_code_context_exa(query: "Next.js partial prerendering examples", tokensNum: 5000)' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'exa.web_search_exa(query: "latest Vercel Sandbox browser automation docs", numResults: 5, type: "auto", freshness: "year", includeDomains: [])' --config ~/.config/opencode/mcporter.json

bunx mcporter call 'exa.crawling_exa(urls: ["https://github.com/steipete/mcporter"], maxCharacters: 6000, maxAgeHours: 24, subpages: 0, subpageTarget: "cli reference")' --config ~/.config/opencode/mcporter.json
```

## Rules

- Cite source URLs in your summary.
- Be version-sensitive when researching library behavior.
- Use `repo-discovery` when external guidance must be matched to the local codebase.
- Do not route users back to raw MCP-family names. The stable interface is this skill.
