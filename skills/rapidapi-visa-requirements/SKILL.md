---
name: rapidapi-visa-requirements
description: Use when checking entry requirements, visa rules, or passport-specific travel eligibility through the Visa Requirement RapidAPI MCP.
---

# RapidAPI Visa Requirements

Use this skill for passport-to-destination entry checks. It helps the planner answer whether travel looks visa-free, visa-on-arrival, eVisa, or likely to need advance paperwork.

## Config

- Config path: `${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}`
- Server name: `rapidapi-visa-requirements`
- Required env: `RAPIDAPI_KEY`
- Expect `RAPIDAPI_KEY` to be exported manually in the shell environment; do not rely on any repo env file.

## When to Use

- Entry requirement questions
- Passport-specific destination checks
- Early trip feasibility screening
- Itinerary planning where border friction matters

## Before You Call

1. Confirm nationality or passport country.
2. Confirm destination country.
3. If relevant, ask about trip purpose and expected stay length.

## Core Workflow

1. Inspect the provider's lookup tools and required parameters.
2. Run the narrowest country-to-country requirement check.
3. Extract the visa category, duration, and any notable conditions.
4. State uncertainty clearly when rules appear incomplete or time-sensitive.
5. For high-stakes travel, point the user to official government confirmation.

## Command Patterns

- List tools: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-visa-requirements`
- Inspect schema: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-visa-requirements --schema`
- Call a tool: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" call rapidapi-visa-requirements.<tool> key=value`

### Core Tool Reference

#### 1. Visa Check
- **Tool:** `VisaRequirements`
- **Purpose:** Check requirements for a specific passport and destination.
- **Optional:** `passport` (ISO2 code, e.g., "US"), `destination` (ISO2 code, e.g., "DE")
- **Example:** `mcporter --config ... call rapidapi-visa-requirements.VisaRequirements passport="US" destination="DE"`

#### 2. Destination List
- **Tool:** `Destinations`
- **Purpose:** List all supported destination countries.
- **Example:** `mcporter --config ... call rapidapi-visa-requirements.Destinations`

#### 3. Passport List
- **Tool:** `Passports`
- **Purpose:** List all supported passport countries.
- **Example:** `mcporter --config ... call rapidapi-visa-requirements.Passports`

#### 4. Custom Passport Rank
- **Tool:** `CustomPassportRank`
- **Purpose:** Make a custom passport rank by passing weights for different visa types.
- **Optional:** `weights` (JSON object with integer weights like `{"Visa-free": 2, "Visa required": 0}`)
- **Example:** `mcporter --config ... call rapidapi-visa-requirements.CustomPassportRank weights='{"Freedom of movement": 3, "Visa-free": 2, "eVisa": 1, "Visa on arrival": 1, "eTA": 1, "Tourist card": 0, "Visa required": 0, "Not admitted": -1}'`

#### 5. Visa Map
- **Tool:** `VisaMap`
- **Purpose:** Get color-coded visa rules for a passport, returning a map URL or color mappings.
- **Optional:** `passport` (ISO2 code, e.g., "VN")
- **Example:** `mcporter --config ... call rapidapi-visa-requirements.VisaMap passport="VN"`

## Output Expectations

Summaries should try to separate:

1. **Visa Category:** Visa-free, Visa on arrival, eVisa, or Visa required.
2. **Stay Duration:** Maximum allowed stay (e.g., 90 days).
3. **Advance Approval:** Whether an eVisa or advance paperwork is needed.
4. **Passport Rank:** Context on how powerful the passport is for this destination.
5. **Caveats:** Stay-length constraints, purpose-of-visit rules, or entry/exit requirements.

## Cross-Checks

- Treat this as operational guidance, not legal advice.
- Use `research` to confirm with embassy, immigration, or government sources when travel is imminent or consequences are high.

## Failure Handling

- If the config or env is missing, report the exact missing item.
- If the API answer is vague, say that it is insufficient for a booking decision.
- If trip purpose changes the answer, ask the user instead of guessing.
- If you need a quick smoke test before a real query, `Destinations` currently returns live country data reliably.

## Common Mistakes

- Presenting visa guidance as guaranteed legal truth
- Ignoring stay length or purpose-of-visit caveats
- Collapsing "unknown" into "no visa needed"
