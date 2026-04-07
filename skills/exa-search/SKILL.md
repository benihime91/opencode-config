---
name: exa-search
description: Use when Exa is the right search surface for current web information, code examples, URL reads, company lookups, or people search inside the repo's current CLI workflow.
---

# Exa Search

Use this skill when the job is specifically about Exa-backed search or Exa-backed page reads.

In this repo, Exa is accessed through the shared `mcporter` config, not through ad hoc MCP setup docs.

## Canonical Config

Use the shared config explicitly:

```bash
~/.config/opencode/mcporter.json
```

For generic `mcporter` rules such as warm-up, JSON output, or config discipline, use `mcporter` as the canonical reference.

## When To Use It

Use this skill when you need to:

- search the web for current information
- find code examples or API usage from external sources
- read one or more known URLs through Exa
- do quick company or people lookup through the live Exa surface

Prefer `docs-research` for official-doc workflow and `deep-research` for broad cited synthesis.

## Live Tool Surface

The current repo Exa server exposes these tools:

- `web_search_exa(query, numResults?)`
- `web_search_advanced_exa(query, numResults?, type?, category?, includeDomains?, ...)`
- `get_code_context_exa(query, numResults?)`
- `crawling_exa(urls, maxCharacters?)`
- `company_research_exa(companyName, numResults?)` — deprecated in favor of advanced search
- `people_search_exa(query, numResults?)` — deprecated in favor of advanced search

If examples drift from live behavior, inspect the live schema first.

## Command Patterns

Inspect the live Exa schema when needed:

```bash
bunx mcporter list exa --schema --config ~/.config/opencode/mcporter.json
```

Common calls:

```bash
bunx mcporter call 'exa.web_search_exa(query: "latest AI developments 2026", numResults: 5)' --config ~/.config/opencode/mcporter.json --output json

bunx mcporter call 'exa.web_search_advanced_exa(query: "AI code editor market 2026", numResults: 8, type: "auto", category: "news")' --config ~/.config/opencode/mcporter.json --output json

bunx mcporter call 'exa.get_code_context_exa(query: "React Server Components examples", numResults: 5)' --config ~/.config/opencode/mcporter.json --output json

bunx mcporter call 'exa.crawling_exa(urls: ["https://example.com"], maxCharacters: 4000)' --config ~/.config/opencode/mcporter.json --output json
```

## Practical Guidance

- Use `web_search_exa` for quick current-info lookup.
- Use `web_search_advanced_exa` when you need filters such as category, domains, or dates.
- Use `get_code_context_exa` for external code examples and API usage.
- Use `crawling_exa` when you already know the URL and want readable page content.
- Prefer advanced search over the deprecated company/people helpers for new workflows.

## Rules

- Do not describe this repo as Exa-MCP-first.
- Do not tell users to edit `~/.claude.json` or install a separate Exa server for this repo workflow.
- Use the shared config path explicitly.
- Check the live schema before depending on argument names or tool availability.

## Related Skills

- `mcporter` — generic CLI rules and troubleshooting
- `docs-research` — official docs and targeted external lookup
- `deep-research` — broad cited synthesis across sources
