---
name: deep-research
description: Use when the task needs broad multi-source external research, competitive or market analysis, company or technology investigation, or an evidence-backed cited report rather than a narrow docs lookup, a single-source answer, or a quick factual check.
---

# Deep Research

Use this skill for broad external research that needs multiple sources, synthesis, citations, and explicit confidence.

In this repo, this is a skill-driven CLI workflow:

- Load skill:`mcporter` for direct `mcporter` operation.
- Load skill:`firecrawl` when the job needs direct Firecrawl search, scrape, map, crawl, extract, or Firecrawl troubleshooting.
- Prefer Exa through `mcporter` for broader search, code context, and recent web coverage.
- If both CLI-backed providers fail or are unavailable, fall back to the built-in `websearch` tool, then `webfetch` for specific URLs.

This skill is especially useful for Zeus, Apollo, Athena, and Hermes.

## Canonical Config

Use the shared config at:

```bash
~/.config/opencode/mcporter.json
```

## When To Use It

Use this skill when the user asks to:

- research a topic in depth
- investigate the current state of a market, company, or technology
- compare competing approaches, vendors, or products
- produce a cited report or decision memo
- gather evidence across multiple sources instead of relying on one docs site

Do **not** use this skill for narrow official-doc lookups. Use skill:`docs-research` for that.

## Workflow

1. Clarify the goal only if needed.
   - Ask at most 1-2 quick questions if the target audience, time horizon, or depth is unclear.
   - If the user says “just research it,” proceed with sensible defaults.
2. Break the topic into 3-5 research sub-questions.
3. Search each sub-question with multiple query variants.
4. Read the strongest sources in full. Do not rely only on snippets.
5. Cross-check claims across sources.
6. Write a cited synthesis with confidence and remaining gaps.

## Command Patterns

Inspect available tools when needed:

```bash
bunx mcporter list exa --config ~/.config/opencode/mcporter.json
```

For direct Firecrawl operation, load skill:`firecrawl`.

Typical research loop:

```bash
bunx mcporter call 'firecrawl.firecrawl_search(query: "state of AI code editors 2026", limit: 8, sources: [{"type": "web"}])' --config ~/.config/opencode/mcporter.json --output json
bunx mcporter call 'firecrawl.firecrawl_scrape(url: "https://example.com/report", formats: ["markdown"], onlyMainContent: true)' --config ~/.config/opencode/mcporter.json --output json
bunx mcporter call 'firecrawl.firecrawl_extract(urls: ["https://example.com/pricing"], prompt: "Extract the product tiers, prices, and included limits", schema: {"type":"object","properties":{"tiers":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"price":{"type":"string"},"limits":{"type":"array","items":{"type":"string"}}}}}}})' --config ~/.config/opencode/mcporter.json --output json
```

Exa search:

```bash
bunx mcporter call 'exa.web_search_exa(query: "AI code editor market 2026", numResults: 8)' --config ~/.config/opencode/mcporter.json --output json

bunx mcporter call 'exa.web_search_advanced_exa(query: "AI code editor funding 2026", numResults: 5, startPublishedDate: "2025-01-01")' --config ~/.config/opencode/mcporter.json --output json
```

Exa deep read:

```bash
bunx mcporter call 'exa.crawling_exa(urls: ["https://example.com/report"], maxCharacters: 8000)' --config ~/.config/opencode/mcporter.json --output json
```

## Practical Search Notes

- Prefer `firecrawl_search` first for broad web discovery, then `firecrawl_scrape` on the strongest URLs.
- Use skill:`firecrawl` for `map`, `crawl`, `extract`, and Firecrawl troubleshooting details.
- Treat `firecrawl_agent` as optional/beta, not as the default stable path.
- Prefer `web_search_exa` for quick broad search and `web_search_advanced_exa` only when you need stricter filters.
- Inherit generic config, warm-up, and JSON-output guidance from `mcporter` instead of repeating it here.

## Fallback Path

If Firecrawl fails, continue with Exa.

If both Firecrawl and Exa fail, switch to the built-in web tools:

1. use `websearch` for discovery
2. use `webfetch` for the strongest candidate URLs
3. keep the same evidence standard and cite the fetched URLs

Do not stop just because one provider fails.

## Report Shape

Use this structure unless the user asked for a different format:

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

- Every substantive claim needs a source.
- If only one source supports a claim, label it as tentative or weakly corroborated.
- Prefer recent sources unless historical context matters.
- Distinguish fact from inference.
- Say `insufficient data found` when evidence is weak.
- Prefer official, primary, academic, or high-quality reporting over generic blog spam.

## Parallelization

For broad topics, split the work by sub-question and synthesize at the end.

- Athena is the default research lane for broad external evidence gathering.
- Apollo can handle review, tradeoff analysis, and recommendation synthesis when the research informs a strategic decision.
- Zeus or Hermes should consolidate the final answer into one coherent cited report.
