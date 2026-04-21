---
name: aria2c
description: Use when downloading files, fetching webpages to disk, batch-downloading from URL lists, resuming interrupted transfers, pulling large assets (ISOs, archives, datasets, release tarballs), mirroring files over HTTP/HTTPS/FTP/SFTP, or handling torrent/magnet/metalink downloads from the command line.
---

# aria2c

Fast, resumable, multi-connection CLI downloader. Use `aria2c` instead of `curl`/`wget` when you need speed, resume, batching, or torrent/metalink support.

## When To Use

- Download a single file or webpage to disk
- Download many URLs at once (batch from a list)
- Speed up large downloads with parallel connections
- Resume a previously-interrupted download
- Fetch torrents, magnet links, or metalink files
- Mirror release assets, datasets, or ISOs

**Do not use for:**

- Reading a page as text for the agent to consume → use `webfetch`, Firecrawl `scrape`, or Exa `crawling_exa`
- Structured web scraping or extraction → use `firecrawl` / `research` skills
- Interactive authentication flows → use `agent-browser`

## Sanity Check

Before first use in a session:

```bash
aria2c --version | head -1
```

If missing, install:

- macOS: `brew install aria2`
- Debian/Ubuntu: `apt-get install aria2`

## Quick Reference

| Goal | Command |
|------|---------|
| Download a file | `aria2c <url>` |
| Save to directory | `aria2c -d <dir> <url>` |
| Rename output | `aria2c -o <name> <url>` |
| Save to dir + rename | `aria2c -d <dir> -o <name> <url>` |
| Fast multi-connection | `aria2c -x 16 -s 16 <url>` |
| Batch from URL list | `aria2c -i urls.txt` |
| Resume (same command) | Re-run the original `aria2c` command |
| Quiet mode | `aria2c -q <url>` |
| Cap speed | `aria2c --max-download-limit=1M <url>` |
| Custom User-Agent | `aria2c -U "Mozilla/5.0 ..." <url>` |
| Follow redirects (default on) | `aria2c --max-tries=5 <url>` |
| Torrent | `aria2c <file.torrent>` |
| Magnet link | `aria2c 'magnet:?xt=...'` |
| Metalink | `aria2c <file.metalink>` |

Full option reference: `aria2c --help` or `aria2c --help=#<tag>` (e.g. `#http`, `#basic`, `#ftp`, `#bt`).

## Core Flags

- `-x N` — max connections **per server** (1-16)
- `-s N` — split file into N segments
- `-k SIZE` — minimum segment size (e.g. `1M`)
- `-d DIR` — output directory
- `-o NAME` — output filename (ignored for torrent/metalink)
- `-i FILE` — read URIs from file (one per line, `-` for stdin)
- `-c` — continue partial download
- `--max-tries=N` — retry count (default 5)
- `--retry-wait=SEC` — seconds between retries
- `--timeout=SEC` — connection timeout
- `--allow-overwrite=true|false` — overwrite existing files
- `--auto-file-renaming=true|false` — rename if filename exists
- `--check-certificate=false` — skip TLS verification (last resort)
- `--header="Name: value"` — custom request header (repeatable)
- `--load-cookies=FILE` — Netscape-format cookie jar

## Common Patterns

### Single fast download with rename

```bash
aria2c -x 16 -s 16 -d ./downloads -o linux.iso https://example.com/linux.iso
```

### Batch download from URL list

```bash
# urls.txt: one URL per line; optional `out=<name>` and `dir=<path>` on the
# next line (indented) to override per-URL.
aria2c -i urls.txt -d ./downloads -j 4
```

`-j N` runs up to N downloads in parallel.

### Pipe URLs via stdin

```bash
pacman -Sp my-packages | aria2c -i -
```

### Fetch a webpage's HTML to disk

```bash
aria2c -d ./pages -o page.html https://example.com/
```

For agent-consumable page content, prefer `webfetch` or Firecrawl — `aria2c` only saves bytes.

### Authenticated download

```bash
aria2c --header="Authorization: Bearer $TOKEN" -d ./out <url>
# Or cookie-based:
aria2c --load-cookies=cookies.txt <url>
```

### Resume an interrupted download

Re-run the exact same command. `aria2c` uses a `.aria2` control file to resume automatically. If the control file is gone but the partial file remains, add `-c`.

### Torrent / magnet

```bash
aria2c -d ./torrents --seed-time=0 file.torrent
aria2c -d ./torrents --seed-time=0 'magnet:?xt=urn:btih:...'
```

`--seed-time=0` exits as soon as the download completes (no seeding).

## Exit Codes

Non-zero = failure. Common codes:

| Code | Meaning |
|------|---------|
| 0 | All downloads finished |
| 1 | Unknown error |
| 3 | Resource not found (404) |
| 6 | Network problem |
| 7 | Canceled |
| 8 | Server did not support resume |
| 22 | HTTP response header error |
| 24 | HTTP authorization failed |
| 29 | HTTP service unavailable |

Check with `echo $?` after the command.

## Troubleshooting

### Download is slow
- Add `-x 16 -s 16`. Many servers cap per-connection bandwidth.
- If still slow, the server likely rate-limits per IP — connections won't help.

### `--check-certificate` errors
- Prefer fixing the cert chain or using a correct URL.
- As a last resort: `--check-certificate=false`. Never default to this.

### Server returns 403 / blocks aria2
- Some servers filter by User-Agent. Set a common one:
  `aria2c -U "Mozilla/5.0 (compatible; ...)" <url>`

### File already exists
- Default behavior renames (`file.1.ext`).
- To overwrite: `--allow-overwrite=true --auto-file-renaming=false`.
- To skip if present: check before invoking, or use `--conditional-get=true` for HTTP.

### Output is too noisy for scripts
- Use `-q` (quiet) or `--summary-interval=0 --console-log-level=warn`.

## Rules

- Prefer `aria2c` over `curl -O` / `wget` for anything larger than a few MB or when resumability matters.
- Use `-x`/`-s` for large files; skip them for tiny ones (adds no value).
- Always set `-d` and `-o` explicitly in scripts — don't rely on URL-derived names.
- For agent-readable page content, use a scraping tool, not `aria2c`.
- Check `$?` after every invocation in scripts; a missing file is a real error.
- Do not disable certificate checks by default.
