---
name: research
description: Use when the task needs external information — official docs, API examples, code context, broad multi-source synthesis, competitive analysis, or evidence-backed cited reports.
---

# Research

Unified skill for all external (non-repo) research. Covers quick docs lookups, code-context searches, and deep multi-source synthesis.

Pair with `repo-discovery` when external guidance must be matched to local codebase.

## Routing

| Need | Approach |
|------|----------|
| Official library/framework docs | Context7 first, then Exa code context |
| Quick current-info lookup | Exa `web_search_exa` |
| Code examples and API usage | Exa `get_code_context_exa` |
| Read a known URL | Exa `crawling_exa` or Firecrawl `firecrawl_scrape` |
| Broad web discovery | Firecrawl `firecrawl_search` |
| Multi-source synthesis or cited report | Deep workflow (see below) |
| Firecrawl troubleshooting | Load `firecrawl` skill instead |

## Tool Patterns

Use MCP tools directly — no CLI wrapper needed.

**Context7** — official library and framework documentation:

- `resolve-library-id(libraryName, query)` — resolve a library to its Context7 ID
- `query-docs(libraryId, query)` — query official docs for a resolved library

**Exa** — broader search, code examples, URL reads:

- `web_search_exa(query, numResults)` — quick broad search
- `web_search_advanced_exa(query, numResults, type, category, startPublishedDate, ...)` — filtered search with domain, date, and category controls
- `get_code_context_exa(query, numResults)` — external code examples and API usage
- `crawling_exa(urls, maxCharacters)` — deep-read known URLs

**Firecrawl** — web search, scraping, structured extraction:

- `firecrawl_search(query, limit, sources)` — broad web discovery
- `firecrawl_scrape(url, formats, onlyMainContent)` — read one known page
- `firecrawl_extract(urls, prompt, schema)` — structured field extraction
- `firecrawl_map(url, search, limit)` — discover pages on a site
- `firecrawl_crawl(url, limit, maxDiscoveryDepth)` — async multi-page collection

## Quick Lookup Workflow

For targeted docs, API examples, or a single factual answer:

1. Prefer official docs first (Context7 for libraries).
2. Use Exa for broader code examples or current-info lookup.
3. Use Firecrawl `scrape` when you have a specific URL.
4. Be version-sensitive when researching library behavior.
5. Cite source URLs in your summary.

## Deep Synthesis Workflow

For multi-source research, competitive analysis, or cited reports:

1. Break the topic into 3-5 research sub-questions.
2. Search each sub-question with multiple query variants.
3. Read the strongest sources in full — do not rely only on snippets.
4. Cross-check claims across sources.
5. Write a cited synthesis with confidence and remaining gaps.

## Fallback Chain

If one provider fails, continue with the next:

1. Firecrawl → Exa → built-in `websearch` → `webfetch`
2. Do not stop just because one provider fails.
3. Keep the same evidence standard regardless of provider.

## Report Template

Use this structure for deep synthesis unless the user asked for a different format:

```markdown
# [Topic]: Research Report

_Generated: [date] | Sources: [N] | Confidence: [High/Medium/Low]_

## Executive Summary

[3-5 sentence synthesis]

## Key Findings

### 1. [Theme]

- [Claim] ([Source](url))

### 2. [Theme]

- [Claim] ([Source](url))

## Gaps And Uncertainty

- [Unknown or weakly supported area]

## Sources

1. [Title](url) — [short note]
```

## Quality Rules

- Every substantive claim needs a source URL.
- If only one source supports a claim, label it as tentative.
- Prefer recent sources unless historical context matters.
- Distinguish fact from inference.
- Say `insufficient data found` when evidence is weak.
- Prefer official, primary, or highest-authority sources first.
- Use lower-authority sources as supporting context, not the default basis.
- When higher-authority sources are unavailable, say so and lower confidence.
- Cite source URLs when summarizing externally researched facts.

## MCP Tool Verification

- Verify tool availability and argument shapes before relying on cached examples.
- If a tool call fails, check whether the MCP server is enabled and the tool schema matches.
- Do not assume MCP tool argument shapes are stable across versions.

## Parallelization

For broad topics, split work by sub-question and synthesize at the end.

- Kenma is the default research lane for broad external evidence gathering.
- Gojo handles review, tradeoff analysis, and recommendation synthesis.
- Shikamaru or Urahara consolidates the final cited report.
