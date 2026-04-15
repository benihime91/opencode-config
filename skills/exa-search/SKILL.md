---
name: exa-search
description: Use when Exa is the right search surface for current web information, code examples, URL reads, company lookups, or people search.
---

# Exa Search

Use this skill when the job is specifically about Exa-backed search or Exa-backed page reads.

Exa MCP tools are available directly — no CLI wrapper needed.

## When To Use It

Use this skill when you need to:

- search the web for current information
- find code examples or API usage from external sources
- read one or more known URLs through Exa
- do quick company or people lookup through the live Exa surface

Prefer `docs-research` for official-doc workflow and `deep-research` for broad cited synthesis.

## Available MCP Tools

- `web_search_exa(query, numResults?)` — quick broad search
- `web_search_advanced_exa(query, numResults?, type?, category?, includeDomains?, startPublishedDate?, ...)` — filtered search
- `get_code_context_exa(query, numResults?)` — external code examples and API usage
- `crawling_exa(urls, maxCharacters?)` — deep-read known URLs
- `company_research_exa(companyName, numResults?)` — deprecated in favor of advanced search
- `people_search_exa(query, numResults?)` — deprecated in favor of advanced search

## Practical Guidance

- Use `web_search_exa` for quick current-info lookup.
- Use `web_search_advanced_exa` when you need filters such as category, domains, or dates.
- Use `get_code_context_exa` for external code examples and API usage.
- Use `crawling_exa` when you already know the URL and want readable page content.
- Prefer advanced search over the deprecated company/people helpers for new workflows.

## Rules

- If examples drift from live MCP tool behavior, inspect tool schemas directly.
- Cite source URLs in your findings.

## Related Skills

- `docs-research` — official docs and targeted external lookup
- `deep-research` — broad cited synthesis across sources
