---
name: rapidapi-currency-rates
description: Use when converting trip costs, normalizing prices, or comparing budgets across currencies through the Currency Rates RapidAPI MCP.
---

# RapidAPI Currency Rates

Use this skill whenever travel costs need to be compared fairly across currencies. It is best as a support skill for flights, stays, and itinerary budgeting.

## Config

- Config path: `${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}`
- Server name: `rapidapi-currency-rates`
- Required env: `RAPIDAPI_KEY`
- Expect `RAPIDAPI_KEY` to be exported manually in the shell environment; do not rely on any repo env file.

## When to Use

- Budget comparison across countries
- Currency conversion for flights or stays
- Final trip summary normalization
- Cost explanation in the user's preferred currency

## Before You Call

1. Confirm the source currency and target currency.
2. Decide whether the user needs a spot rate or just rough comparison.
3. Keep original source amounts available so the user can audit the conversion.

## Core Workflow

1. Inspect the available conversion or rate tools.
2. Convert each shortlisted option into the user's preferred currency.
3. Preserve both original and converted values in your notes.
4. Mention rate timing if the provider exposes it.
5. Use the normalized totals to rank options fairly.

## Command Patterns

- List tools: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-currency-rates`
- Inspect schema: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-currency-rates --schema`
- Call a tool: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" call rapidapi-currency-rates.<tool> key=value`

### Core Tool Reference

#### 1. Direct Conversion
- **Tool:** `Convert`
- **Purpose:** Convert a specific amount from one currency to another.
- **Required:** `from` (ISO code), `to` (ISO code), `amount`
- **Optional:** `date` (YYYY-MM-DD)
- **Example:** `mcporter --config ... call rapidapi-currency-rates.Convert from="USD" to="EUR" amount="750"`

#### 2. Latest Rates
- **Tool:** `Recent_Exchange_Rates`
- **Purpose:** Get current market rates for multiple currencies.
- **Optional:** `base` (ISO code), `symbols` (Comma-separated list of target ISO codes)
- **Example:** `mcporter --config ... call rapidapi-currency-rates.Recent_Exchange_Rates base="USD" symbols="EUR,GBP,JPY"`

#### 3. Historical Rates
- **Tool:** `Historical_Exchange_Rates`
- **Purpose:** Get rates for a specific date in the past.
- **Required:** `date` (YYYY-MM-DD)
- **Optional:** `base`, `symbols`
- **Example:** `mcporter --config ... call rapidapi-currency-rates.Historical_Exchange_Rates date="2026-01-01" base="USD"`

#### 4. Time-Series Rates
- **Tool:** `Time-Series_Endpoint`
- **Purpose:** Retrieve historical rates between two specified dates (max 365 days).
- **Required:** `start_date` (YYYY-MM-DD), `end_date` (YYYY-MM-DD)
- **Optional:** `base`, `symbols`
- **Example:** `mcporter --config ... call rapidapi-currency-rates.Time-Series_Endpoint start_date="2025-01-01" end_date="2025-12-31" base="USD" symbols="EUR"`

#### 5. Symbol Lookup
- **Tool:** `Symbols`
- **Purpose:** List all supported currency codes and names.
- **Example:** `mcporter --config ... call rapidapi-currency-rates.Symbols`

## Output Expectations

When summarizing converted costs, try to show:

1. **Original Value:** Amount and currency (e.g., 100 GBP).
2. **Converted Value:** Amount and target currency (e.g., 125 USD).
3. **Exchange Rate:** The rate used for the conversion.
4. **Freshness:** Date and time of the rate.
5. **Context:** Whether this is a mid-market rate or includes typical conversion fees.

## Cross-Checks

- Use this as a support layer with flight and lodging providers.
- If provider timing is unclear, say rates may drift before booking.

## Failure Handling

- If the config or env is missing, report the exact missing item.
- If the API returns stale or partial rate information, label the output as approximate.
- If multiple large trip costs are involved, convert all of them consistently before ranking.
- `Symbols` is a good smoke test, but use a rate/conversion endpoint before making cost claims.

## Common Mistakes

- Mixing converted and unconverted prices in one comparison
- Forgetting rate timing or fee sensitivity
- Presenting approximate conversions as guaranteed final charges
