---
name: rapidapi-airbnb-listings
description: Use when searching short-term rentals, apartment-style stays, or neighborhood-based lodging options through the Airbnb Listings RapidAPI MCP.
---

# RapidAPI Airbnb Listings

Use this skill for apartment-style stays, longer stays, group travel, kitchen needs, or travelers who care more about neighborhood fit than hotel amenities.

## Config

- Config path: `${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}`
- Server name: `rapidapi-airbnb-listings`
- Required env: `RAPIDAPI_KEY`
- Expect `RAPIDAPI_KEY` to be exported manually in the shell environment; do not rely on any repo env file.

## When to Use

- Short-term rental searches
- Family or group travel
- Longer stays where space and kitchen access matter
- Neighborhood-driven lodging choices

## Before You Call

1. Confirm destination, dates, guests, and bedroom needs.
2. Ask whether the traveler needs an entire place or can accept shared spaces.
3. Clarify budget as total stay cost, not only nightly price.

## Core Workflow

1. Inspect available search/filter tools.
2. Pull a destination-appropriate set of listings.
3. Narrow by occupancy, privacy level, and budget.
4. Compare final options using total cost, fees, location, and rating.
5. Present the shortlist with tradeoffs, not raw listing dumps.

## Command Patterns

- List tools: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-airbnb-listings`
- Inspect schema: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-airbnb-listings --schema`
- Call a tool: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" call rapidapi-airbnb-listings.<tool> key=value`

### Core Tool Reference

#### 1. Admin Division Lookup
- **Tool:** `Get_administrative_divisions`
- **Purpose:** Get `admin1`, `admin2`, etc. for a country.
- **Required:** `countrycode` (e.g., "IT")
- **Example:** `mcporter --config ... call rapidapi-airbnb-listings.Get_administrative_divisions countrycode="IT"`

#### 2. Search by Admin Division
- **Tools:** `Listings_by_administrative_divisions`, `Prices_and_Availability_by_administrative_divisions`, `Count_Listings_by_administrative_divisions`
- **Purpose:** Search properties, average prices, or counts in a specific region/city.
- **Required (Listings):** `state` (Country code), `offset`
- **Required (Prices):** `country_code`, `month`, `year`
- **Optional:** `admin1`, `admin2`, `admin3`, `bedrooms`, `maxGuestCapacity`
- **Example:** `mcporter --config ... call rapidapi-airbnb-listings.Listings_by_administrative_divisions state="IT" admin1="Lazio" admin3="Roma" offset="0"`

#### 3. Search by Lat/Lng
- **Tools:** `Listings_by_lat_lng`, `Prices_and_Availability_by_lat_lng`, `Count__listings_by_lat_lng`
- **Purpose:** Search properties, prices, or counts near a specific geographic point.
- **Required:** `lat`, `lng`, `range` (meters)
- **Optional:** `offset` (for Listings), `month`, `year` (for Prices)
- **Example:** `mcporter --config ... call rapidapi-airbnb-listings.Listings_by_lat_lng lat=28.085 lng=-16.734 range=500 offset=0`

#### 4. Property Details
- **Tool:** `Listing_Details`
- **Purpose:** Full info on a specific listing.
- **Required:** `id`
- **Example:** `mcporter --config ... call rapidapi-airbnb-listings.Listing_Details id="619966061834034729"`

#### 5. Reviews
- **Tool:** `Listing_reviews`
- **Purpose:** Guest feedback for a listing (returns up to 20 reviews).
- **Required:** `id`
- **Optional:** `date_time` (to get reviews after this date)
- **Example:** `mcporter --config ... call rapidapi-airbnb-listings.Listing_reviews id="619966061834034729"`

#### 6. Pricing and Availability
- **Tools:** `Listing_Availability`, `Listing_Prices`, `Listing_Availability_Full`, `Listing_Prices_Full`, `Listing_status`, `Listing_status_Full`, `Real_time_stay_quote`
- **Purpose:** Get status, prices, availability for specific months or full year, or real-time quotes.
- **Required:** `id` (listing id), `month` and `year` (for specific month tools)
- **Required (Real-time quote):** `id`, `checkInDay`, `checkOutDay`, `currency`
- **Example:** `mcporter --config ... call rapidapi-airbnb-listings.Real_time_stay_quote id="619966061834034729" checkInDay="2026-05-01" checkOutDay="2026-05-08" currency="USD"`

#### 7. Other Search Tools
- **Tools:** `Listings_by_market`, `Count_listings_by_market`, `Get_listings_by_zipcode`
- **Purpose:** Alternative ways to discover listings by market string or US zipcodes.
- **Example:** `mcporter --config ... call rapidapi-airbnb-listings.Listings_by_market market="Tenerife" offset="0"`

## Output Expectations

For each recommended stay, prefer:

1. **Property Type:** Entire home, private room, or shared room.
2. **Pricing:** Total cost for the stay including cleaning/service fees.
3. **Capacity:** Number of guests and bedrooms.
4. **Location:** Neighborhood name and proximity to attractions.
5. **Ratings:** Overall star rating and review count.
6. **Amenities:** Key features (WiFi, Kitchen, AC, Pool).

## Cross-Checks

- Compare against `rapidapi-hostelworld` for budget solo travel.
- Use `rapidapi-tripadvisor` when area reputation or nearby amenities matter.
- Normalize prices with `rapidapi-currency-rates` when comparing across countries.

## Failure Handling

- If the config or env is missing, report the exact missing item.
- If only nightly price is available, say that fees may change the ranking.
- If the provider lacks neighborhood detail, say that explicitly before recommending it strongly.
- Use `Connect_test` only as a transport smoke check; it proves the provider is reachable but not that a listing search is well-formed.

## Common Mistakes

- Ranking only by nightly rate
- Ignoring cleaning or service fees
- Recommending a shared space when privacy expectations are unclear
