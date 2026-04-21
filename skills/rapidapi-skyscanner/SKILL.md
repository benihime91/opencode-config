---
name: rapidapi-skyscanner
description: Use when searching flights, comparing fares, checking date flexibility, or evaluating alternate airports through the Skyscanner RapidAPI MCP.
---

# RapidAPI Skyscanner

Use this skill for flight-first work. Reach for it when the planner needs routes, fare options, airport combinations, or flexible-date comparisons.

## Config

- Config path: `${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}`
- Server name: `rapidapi-skyscanner`
- Required env: `RAPIDAPI_KEY`
- Expect `RAPIDAPI_KEY` to be exported manually in the shell environment; do not rely on any repo env file.

## When to Use

- Flight discovery between two cities or airports
- Cheapest or best-value fare comparison
- Alternate airport checks for a metro area
- Flexible-date planning when price sensitivity matters
- Hotel and car rental searches alongside flights

## Before You Call

1. Confirm the traveler's origin, destination, and trip window.
2. Decide whether the user values lowest price, shortest duration, or fewest stops.
3. If dates are flexible, test nearby dates instead of only one exact day.

## Core Workflow

1. List tools once if the exact tool names are not already known.
2. Inspect schema before the first live call for a new workflow.
3. Run the narrowest search that fits the request.
4. If results are thin, broaden with alternate airports or nearby dates.
5. Summarize tradeoffs: price, duration, stops, and airport convenience.

## Command Patterns

- List tools: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-skyscanner`
- Inspect schema: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-skyscanner --schema`
- Call a tool: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" call rapidapi-skyscanner.<tool> key=value`

### Core Tool Reference

#### 1. Location Lookup
- **Tool:** `flightssearchAirport`, `carssearchLocation`, `hotelssearchDestination`
- **Purpose:** Get `skyId` and `entityId` for airports/cities/cars/hotels.
- **Required:** `query` (e.g., "London", "LHR")
- **Example:** `mcporter --config ... call rapidapi-skyscanner.flightssearchAirport query="London"`

#### 2. Flight Search
- **Tool:** `flightssearchFlights`
- **Purpose:** Search one-way or roundtrip flights. Use sessionToken for incomplete results.
- **Required:** `originSkyId`, `originEntityId`, `destinationSkyId`, `destinationEntityId`, `date` (YYYY-MM-DD)
- **Optional:** `returnDate`, `adults`, `cabinClass` (economy, premiumeconomy, business, first), `currency`, `infants`, `childrens`
- **Example:** `mcporter --config ... call rapidapi-skyscanner.flightssearchFlights originSkyId="LOND" originEntityId="27544008" destinationSkyId="NYCA" destinationEntityId="27537542" date="2026-08-01"`

#### 3. Price Calendar
- **Tool:** `flightsgetPriceCalendar` (one-way) or `flightsgetPriceCalendarReturn` (roundtrip)
- **Purpose:** Get a grid of prices for date combinations.
- **Required:** `originSkyId`, `destinationSkyId`, `fromDate` (YYYY-MM-DD)
- **Example:** `mcporter --config ... call rapidapi-skyscanner.flightsgetPriceCalendar originSkyId="LOND" destinationSkyId="NYCA" fromDate="2026-08-01"`

#### 4. Budget Exploration
- **Tools:** `flightsgetCheapestOneway`, `flightssearchFlightEverywhere`
- **Purpose:** Find the cheapest days to fly or the cheapest destinations from an origin.
- **Required (CheapestOneway):** `originSkyId`, `destinationSkyId`, `month` (YYYY-MM)
- **Required (Everywhere):** `originSkyId`, `originEntityId`
- **Example:** `mcporter --config ... call rapidapi-skyscanner.flightsgetCheapestOneway originSkyId="LOND" destinationSkyId="NYCA" month="2026-08"`

#### 5. Multi-stop Flight Search
- **Tool:** `flightssearchFlightsMultiStops`
- **Purpose:** Search multi-city/multi-stop itineraries.
- **Required:** `legs` (JSON array: `[{"originSkyId":"LHR","destinationSkyId":"CDG","date":"2026-08-01"}]`)
- **Example:** `mcporter --config ... call rapidapi-skyscanner.flightssearchFlightsMultiStops legs='[{"originSkyId":"LHR","destinationSkyId":"CDG","date":"2026-08-01"}]'`

#### 6. Hotels
- **Tools:** `hotelssearchHotels`, `hotelsgetHotelDetails`, `hotelsgetHotelPrices`, `hotelsgetSimilarHotels`, `hotelsgetNearbyMap`, `hotelsgetHotelReviews`
- **Purpose:** Search hotels, get prices, reviews, and maps.
- **Required:** Varies by tool, usually `entityId` or `hotelId` with `checkIn` and `checkOut` dates.
- **Example:** `mcporter --config ... call rapidapi-skyscanner.hotelssearchHotels entityId="27539733" checkIn="2026-08-01" checkOut="2026-08-05"`

#### 7. Car Rentals
- **Tool:** `carssearchCars`
- **Purpose:** Search available rental cars.
- **Required:** `pickupEntityId`, `pickupDate` (YYYY-MM-DD), `dropoffDate`
- **Example:** `mcporter --config ... call rapidapi-skyscanner.carssearchCars pickupEntityId="LHR" pickupDate="2026-08-01" dropoffDate="2026-08-08"`

## Output Expectations

When presenting options, prefer this order:

1. **Route & Dates:** Origin/Destination airports and exact dates.
2. **Pricing:** Total price per person and currency.
3. **Stops:** Number of stops and layover locations/durations.
4. **Duration:** Total travel time.
5. **Airlines:** Operating carriers.
6. **Caveats:** Overnight layovers, airport changes (e.g., LHR to LGW), or long wait times.

## Cross-Checks

- Cross-check major recommendations against another flight source when the user is about to book.
- Pair with `rapidapi-currency-rates` when the API returns non-preferred currency.
- Pair with `rapidapi-tripadvisor` or `rapidapi-travel-guide` only after flights are narrowed.

## Failure Handling

- If the config or env is missing, report the exact missing item.
- If the API returns no fares, retry with wider dates or alternate airports before concluding availability is poor.
- If prices look unrealistic, say so and ask the user whether to keep exploring or treat the result as directional only.
- If you only need a quick proof-of-life check, `configgetExchangeRates` is currently a working low-friction smoke test.

## Common Mistakes

- Treating the cheapest fare as automatically best
- Ignoring baggage, layover, or airport-transfer tradeoffs
- Recommending one exact flight without showing at least one alternative when choices exist
