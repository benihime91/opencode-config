---
name: firecrawl
description: Use when working directly with Firecrawl for web search, scraping, site mapping, crawling, extraction, or troubleshooting Firecrawl-specific behavior.
---

# Firecrawl

Use this skill for direct Firecrawl operations.

- Use `deep-research` when the job is a multi-source research report with synthesis and citations.
- Use this skill when the job is direct Firecrawl usage, Firecrawl troubleshooting, or choosing the right Firecrawl primitive.

## Repo Defaults

- Firecrawl API from the host is expected at `http://localhost:3002`.
- Firecrawl MCP tools are available directly — no CLI wrapper needed.

If `curl http://localhost:3002/...` works, host to Firecrawl access is already fine.
Do not invent extra Firecrawl host-routing logic unless there is direct evidence that `localhost:3002` is failing.

## When To Use It

Use this skill when you need to:

- search the web through Firecrawl
- scrape one page cleanly
- map a site before choosing pages
- crawl a site asynchronously
- extract structured fields from pages
- troubleshoot Firecrawl-specific failures
- decide whether to use `search`, `scrape`, `map`, `crawl`, `extract`, or `agent`

## Available MCP Tools

| Tool | Best For |
|------|----------|
| `firecrawl_search(query, limit, sources)` | Broad web discovery |
| `firecrawl_scrape(url, formats, onlyMainContent)` | Reading one known page |
| `firecrawl_map(url, search, limit)` | Discovering pages when the site hides real paths |
| `firecrawl_crawl(url, limit, maxDiscoveryDepth)` | Multi-page collection (async job) |
| `firecrawl_extract(urls, prompt, schema)` | Structured field extraction from pages |
| `firecrawl_check_crawl_status(id)` | Checking async crawl progress |
| `firecrawl_agent(...)` | Optional beta — do not assume it is enabled |

## Common Patterns

### Search then scrape

1. Call `firecrawl_search` with your query and desired limit
2. Review results, pick the strongest URLs
3. Call `firecrawl_scrape` on each URL with `formats: ["markdown"]` and `onlyMainContent: true`

### Map a docs site first

Call `firecrawl_map` with the site URL and a search term to discover relevant pages before scraping.

### Structured extract

Call `firecrawl_extract` with target URLs, a prompt describing what to extract, and a JSON schema for the output structure.

## Agent Tool Warning

`firecrawl_agent` is not a safe default.

Known failure mode:
- Firecrawl API reachable on `localhost:3002`
- `firecrawl_agent` request reaches `/v2/agent`
- Server returns: `Agent beta is not enabled.`

Treat this as a feature-availability problem, not a networking problem.

Fallback order:
1. `firecrawl_search`
2. `firecrawl_map` if page discovery is unclear
3. `firecrawl_scrape` for specific pages
4. `firecrawl_extract` for structured output
5. `firecrawl_crawl` only when you truly need many pages

## Troubleshooting

### Firecrawl API reachability

```bash
curl -X POST http://localhost:3002/v1/crawl -H 'Content-Type: application/json' -d '{"url":"https://firecrawl.dev"}'
```

If this works, Firecrawl host access is fine.

### Distinguish the failing hop

- host to Firecrawl API: `localhost:3002`
- Firecrawl container to Ollama: separate concern

Do not conflate them.

### Inspect API logs

```bash
docker compose -f "$HOME/firecrawl/docker-compose.yaml" logs api --tail 120
```

## Rules

- Prefer `search`/`scrape`/`map`/`extract` over `agent` unless there is a clear reason.
- Treat `crawl` as async and check status explicitly.
- Keep Firecrawl host guidance simple: `http://localhost:3002`.
- Escalate only when direct evidence shows the failure is not feature-gating, schema mismatch, or provider availability.
