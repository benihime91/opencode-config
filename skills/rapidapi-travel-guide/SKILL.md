---
name: rapidapi-travel-guide
description: Use when gathering destination highlights, local activity ideas, or attraction context through the Travel Guide RapidAPI MCP.
---

# RapidAPI Travel Guide

Use this skill for destination discovery and itinerary shaping. It is strongest when the user wants ideas, neighborhood feel, top places, or city-level context before booking details are finalized.

## Config

- Config path: `${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}`
- Server name: `rapidapi-travel-guide`
- Required env: `RAPIDAPI_KEY`
- Expect `RAPIDAPI_KEY` to be exported manually in the shell environment; do not rely on any repo env file.

## When to Use

- Destination inspiration
- City highlights and top places
- Itinerary brainstorming
- Local context before narrowing bookings

## Before You Call

1. Confirm destination city or region.
2. Ask about traveler style: food, culture, nightlife, nature, family, or luxury.
3. Decide whether the user wants a short highlight list or a fuller itinerary seed.

## Core Workflow

1. Inspect tools for city, category, and attraction lookup.
2. Pull the top candidates for the destination.
3. Group findings by theme instead of dumping one long list.
4. Shortlist the places that best match the traveler's style.
5. Hand off to booking or review providers once the user picks directions.

## Command Patterns

- List tools: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-travel-guide`
- Inspect schema: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-travel-guide --schema`
- Call a tool: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" call rapidapi-travel-guide.<tool> key=value`

### Core Tool Reference

#### 1. Destination Check
- **Tool:** `check`
- **Purpose:** Get city highlights and attraction ideas based on specific interests.
- **Required:** None (though providing details improves results).
- **Optional:** `region` (City name, e.g., "London"), `interests` (Array of strings: `["historical", "cultural", "food"]`), `language` (ISO code, e.g., "en"), `noqueue` (Integer, default 1)
- **Example:** `mcporter --config ... call rapidapi-travel-guide.check region="London" interests='["historical","food"]' language="en"`
- **Note:** Treat it as an inspiration engine. Use double quotes for the array `interests='["historical"]'` to pass valid JSON.

## Output Expectations

Prefer grouped summaries such as:

1. **Must-See Places:** Iconic landmarks and top-rated attractions.
2. **Local Vibe:** Quierer, local-fit options and hidden gems.
3. **Food & Drink:** Recommended areas or specific types of local cuisine.
4. **Style Match:** How the suggestions align with the traveler's stated interests.
5. **Caveats:** Warning that hours and availability should be cross-checked.

## Cross-Checks

- Pair with `rapidapi-tripadvisor` for review-backed prioritization.
- Pair with `research` when official opening hours, closures, or seasonal warnings matter.
- Do not use this skill alone for visa, safety, or booking decisions.

## Failure Handling

- If the config or env is missing, report the exact missing item.
- If the provider gives only generic highlights, say the result is inspiration-grade, not fully vetted.
- If timing details are missing, warn that hours and availability may have changed.
- Current verification showed that a minimal `check` request can return `Request processing error`, so prefer richer inputs and treat this provider as fragile until the exact happy-path payload is clearer.

## Common Mistakes

- Treating inspiration content as fully verified operational data
- Mixing tourist hotspots with local-fit picks without labeling them
- Recommending activities without matching them to traveler preferences
- Sending an under-specified `check` request and assuming the provider is generally broken
