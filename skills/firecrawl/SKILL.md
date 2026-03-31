---
name: firecrawl
description: Use when working directly with Firecrawl for web search, scraping, site mapping, crawling, extraction, or troubleshooting Firecrawl-specific behavior in this repo.
---

# Firecrawl

Use this skill for direct Firecrawl operations.

In this repo, Firecrawl is a peer skill to `deep-research`, `docs-research`, and `mcporter`.

- Use `deep-research` when the job is a multi-source research report with synthesis and citations.
- Use this skill when the job is direct Firecrawl usage, Firecrawl troubleshooting, or choosing the right Firecrawl primitive.

## Repo Defaults

- Firecrawl API from the host is expected at `http://localhost:3002`.
- Shared config path: `~/.config/opencode/mcporter.json`
- Default direct call path: `bunx mcporter ... --config ~/.config/opencode/mcporter.json --output json`

If `curl http://localhost:3002/...` works, host → Firecrawl access is already fine.
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

## Tool Selection

- `firecrawl_search` — best first step for broad discovery
- `firecrawl_scrape` — best for reading one known page
- `firecrawl_map` — best when a site hides the real page path
- `firecrawl_crawl` — best for multi-page collection; async job
- `firecrawl_extract` — best for structured fields from one or more URLs
- `firecrawl_agent` — optional beta path; do not assume it is enabled

## Quick Start

Inspect tools first when needed:

```bash
bunx mcporter list firecrawl --config ~/.config/opencode/mcporter.json
```

Basic search:

```bash
bunx mcporter call 'firecrawl.firecrawl_search(query: "AI code editors 2026", limit: 5, sources: [{"type": "web"}])' --config ~/.config/opencode/mcporter.json --output json
```

Basic scrape:

```bash
bunx mcporter call 'firecrawl.firecrawl_scrape(url: "https://example.com", formats: ["markdown"], onlyMainContent: true)' --config ~/.config/opencode/mcporter.json --output json
```

## Common Operations

### Search then scrape

```bash
bunx mcporter call 'firecrawl.firecrawl_search(query: "best AI code editors pricing", limit: 5, sources: [{"type": "web"}])' --config ~/.config/opencode/mcporter.json --output json

bunx mcporter call 'firecrawl.firecrawl_scrape(url: "https://cursor.com/pricing", formats: ["markdown"], onlyMainContent: true)' --config ~/.config/opencode/mcporter.json --output json
```

### Map a docs site first

```bash
bunx mcporter call 'firecrawl.firecrawl_map(url: "https://docs.firecrawl.dev", search: "extract endpoint", limit: 10)' --config ~/.config/opencode/mcporter.json --output json
```

### Crawl a site

Start crawl:

```bash
bunx mcporter call 'firecrawl.firecrawl_crawl(url: "https://example.com/blog", limit: 25, maxDiscoveryDepth: 2)' --config ~/.config/opencode/mcporter.json --output json
```

Check status:

```bash
bunx mcporter call 'firecrawl.firecrawl_check_crawl_status(id: "<crawl-id>")' --config ~/.config/opencode/mcporter.json --output json
```

### Structured extract

```bash
bunx mcporter call 'firecrawl.firecrawl_extract(urls: ["https://example.com/pricing"], prompt: "Extract tiers, prices, and limits", schema: {"type":"object","properties":{"tiers":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"price":{"type":"string"},"limits":{"type":"array","items":{"type":"string"}}}}}}})' --config ~/.config/opencode/mcporter.json --output json
```

## Agent Tool Warning

`firecrawl_agent` is not a safe default in this repo.

The current verified failure mode is:

- Firecrawl API reachable on `localhost:3002`
- `firecrawl_agent` request reaches `/v2/agent`
- server returns: `Agent beta is not enabled.`

So if `firecrawl_agent` fails, treat it as a feature-availability problem first, not a networking problem.

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

- host → Firecrawl API: `localhost:3002`
- Firecrawl container → Ollama: separate concern

Do not conflate them.

### Inspect API logs

```bash
docker compose -f "$HOME/firecrawl/docker-compose.yaml" logs api --tail 120
```

### Re-list tool schemas

```bash
bunx mcporter list firecrawl --config ~/.config/opencode/mcporter.json --output json
```

## Rules

- Prefer `search`/`scrape`/`map`/`extract` over `agent` unless there is a clear reason.
- Treat `crawl` as async and check status explicitly.
- Prefer `--output json`.
- Keep Firecrawl host guidance simple: `http://localhost:3002`.
- Escalate only when direct evidence shows the failure is not feature-gating, schema mismatch, or provider availability.
