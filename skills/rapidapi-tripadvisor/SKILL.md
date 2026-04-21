---
name: rapidapi-tripadvisor
description: Use when checking attractions, restaurants, reviews, or traveler-rated points of interest through the Tripadvisor RapidAPI MCP.
---

# RapidAPI Tripadvisor

Use this skill for review-backed trip decisions. It is most useful when the planner needs traveler sentiment, restaurant ideas, attraction filtering, or validation of places found elsewhere.

## Config

- Config path: `${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}`
- Server name: `rapidapi-tripadvisor`
- Required env: `RAPIDAPI_KEY`
- Expect `RAPIDAPI_KEY` to be exported manually in the shell environment; do not rely on any repo env file.

## When to Use

- Attraction validation
- Restaurant discovery
- Review-backed prioritization
- Separating well-known hotspots from better local-fit options
- Finding flights, car rentals, and vacation rentals with Tripadvisor data

## Before You Call

1. Confirm destination and place type.
2. Ask whether the user wants iconic, local, family-friendly, or budget-friendly options.
3. Decide whether you are exploring broadly or validating a shortlist from another source.

## Core Workflow

1. Inspect tools for place search, reviews, and details.
2. Pull a manageable set of relevant options.
3. Compare rating, review count, and type of appeal.
4. Separate tourist-popular places from quieter local-fit picks.
5. Surface any strong negative patterns, not just average scores.

## Command Patterns

- List tools: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-tripadvisor`
- Inspect schema: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-tripadvisor --schema`
- Call a tool: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" call rapidapi-tripadvisor.<tool> key=value`

### Core Tool Reference

#### 1. Location Lookup
- **Tool:** `Search_Location`
- **Purpose:** Search locations (cities, regions) to get their internal `locationId` or `geoId`.
- **Required:** `query` (e.g., "Paris", "New York")
- **Example:** `mcporter --config ... call rapidapi-tripadvisor.Search_Location query="Paris"`

#### 2. Hotels
- **Tools:** `Search_Hotels_By_Location`, `Get_Hotels_Filter`
- **Purpose:** Find hotels in an area and check availability/pricing.
- **Required:** `checkIn` (YYYY-MM-DD), `checkOut` (YYYY-MM-DD), `latitude`, `longitude` or `geoId`
- **Example:** `mcporter --config ... call rapidapi-tripadvisor.Search_Hotels_By_Location latitude="40.730610" longitude="-73.935242" checkIn="2026-08-01" checkOut="2026-08-05"`

#### 3. Restaurants
- **Tools:** `Search_Restaurants`, `Get_Restaurant_Details_Deprecated`
- **Purpose:** Find restaurants and get details.
- **Required:** `locationId` (from Search_Location)
- **Example:** `mcporter --config ... call rapidapi-tripadvisor.Search_Restaurants locationId="304554"`

#### 4. Vacation Rentals
- **Tools:** `Rental_Rates`, `Rental_Reviews`, `Rental_Availability`, `Rental_Details`
- **Purpose:** Check vacation rentals. Use `rentalId`.
- **Required (Rates):** `rentalId`, `startDate` (YYYY-MM-DD), `endDate` (YYYY-MM-DD), `adults`
- **Example:** `mcporter --config ... call rapidapi-tripadvisor.Rental_Rates rentalId="..." startDate="2026-08-01" endDate="2026-08-05" adults=2`

#### 5. Flights
- **Tools:** `Search_Flights`, `Search_Flights_MultiCity`, `Search_Airport`
- **Purpose:** Search for flights between airports.
- **Required (Search_Flights):** `classOfService`, `date` (YYYY-MM-DD), `destinationAirportCode`, `itineraryType`, `numAdults`, `numSeniors`, `sortOrder`, `sourceAirportCode`
- **Example:** `mcporter --config ... call rapidapi-tripadvisor.Search_Flights sourceAirportCode="LHR" destinationAirportCode="JFK" date="2026-08-01" itineraryType="ONE_WAY" classOfService="ECONOMY" numAdults=1 numSeniors=0 sortOrder="PRICE"`

#### 6. Cars
- **Tools:** `Search_Cars_Same_DropOff`, `Search_Cars_Different_DropOff`
- **Purpose:** Find car rentals.
- **Required (Same DropOff):** `dropOffDate`, `dropOffTime`, `order`, `pickUpDate`, `pickUpLocationType`, `pickUpPlaceId`, `pickUpTime`
- **Example:** `mcporter --config ... call rapidapi-tripadvisor.Search_Cars_Same_DropOff pickUpPlaceId="..." pickUpLocationType="AIRPORT" pickUpDate="2026-08-01" pickUpTime="10:00" dropOffDate="2026-08-08" dropOffTime="10:00" order="PRICE"`

#### 7. Cruises
- **Tools:** `Get_Cruises_Details`
- **Purpose:** Get details on a specific cruise ship.
- **Required:** `seoName`, `shipId`
- **Example:** `mcporter --config ... call rapidapi-tripadvisor.Get_Cruises_Details seoName="MSC Magnifica" shipId="15691635"`

## Output Expectations

For each recommendation, prefer:

- rating and review count
- place category
- why it fits this traveler
- any downside pattern such as crowds, pricing, or inconsistent service

## Cross-Checks

- Pair with `rapidapi-travel-guide` for inspiration, then use this skill to vet the shortlist.
- Do not use this as the sole pricing source for hotels or flights.

## Failure Handling

- If the config or env is missing, report the exact missing item.
- If reviews are sparse, say confidence is low.
- If a place is highly polarizing, summarize both the upside and downside instead of averaging it away.
- Use `Test_API` only to confirm reachability; it does not validate a real attraction or hotel search path.

## Common Mistakes

- Ranking by score alone without review volume
- Confusing tourist-popular with traveler-appropriate
- Ignoring repeated complaint patterns in reviews
