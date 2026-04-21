---
name: rapidapi-hostelworld
description: Use when searching hostel inventory, comparing budget stays, or finding backpacker-friendly accommodation through the HostelWorld RapidAPI MCP.
---

# RapidAPI HostelWorld

Use this skill for hostel-focused accommodation research. It is best for budget travelers, solo travelers, backpacking trips, and stays where social atmosphere matters.

## Config

- Config path: `${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}`
- Server name: `rapidapi-hostelworld`
- Required env: `RAPIDAPI_KEY`
- Expect `RAPIDAPI_KEY` to be exported manually in the shell environment; do not rely on any repo env file.

## When to Use

- Hostel-first trip planning
- Budget accommodation comparison
- Social or backpacker-style stay discovery
- Screening low-cost neighborhoods before shortlisting

## Before You Call

1. Confirm destination, dates, guest count, and room style needs.
2. Ask whether the traveler is fine with dorms or needs private rooms.
3. Decide whether price, location, or review score matters most.

## Core Workflow

1. Discover available search/listing tools.
2. Pull candidate properties for the target destination and dates.
3. Narrow by budget and room style.
4. Compare final options by total price, rating, location, and cancellation terms.
5. Hand off only the strongest shortlist, not a raw dump.

## Command Patterns

- List tools: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-hostelworld`
- Inspect schema: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" list rapidapi-hostelworld --schema`
- Call a tool: `mcporter --config "${OPENCODE_MCPORTER_CONFIG:-$HOME/.config/opencode/config/mcporter.json}" call rapidapi-hostelworld.<tool> key=value`

### Core Tool Reference

#### 1. Search Stays (Search_Hotels)
- **Tool:** `Search_Hotels`
- **Purpose:** Get a list of basic hostel information by city filter without extensive financial history.
- **Required:** `city_id` (e.g., "3" for London), `date_start` (YYYY-MM-DD), `guests`, `num_nights`
- **Example:** `mcporter --config ... call rapidapi-hostelworld.Search_Hotels city_id="3" date_start="2026-05-20" guests="2" num_nights="2"`

#### 2. Check Availability (Get_Hotel_availability)
- **Tool:** `Get_Hotel_availability`
- **Purpose:** Detailed room/dorm availability for a specific property.
- **Required:** `hotel_id`, `date_start` (YYYY-MM-DD), `guests`, `num_nights`
- **Example:** `mcporter --config ... call rapidapi-hostelworld.Get_Hotel_availability hotel_id="91108" date_start="2026-05-20" guests="2" num_nights="2"`

#### 3. Property Details (Get_Hotel_details)
- **Tool:** `Get_Hotel_details`
- **Purpose:** Full info on amenities, policies, and images.
- **Required:** `hotel_id`, `date_start` (YYYY-MM-DD), `guests`, `num_nights`
- **Example:** `mcporter --config ... call rapidapi-hostelworld.Get_Hotel_details hotel_id="91108" date_start="2026-05-20" guests="2" num_nights="2"`

#### 4. Reviews (Get_Hotel_reviews)
- **Tool:** `Get_Hotel_reviews`
- **Purpose:** Guest feedback and ratings.
- **Required:** `hotel_id`, `page`
- **Optional:** `all_languages` (boolean), `sort` (-date, date, rating, -rating, age-group)
- **Example:** `mcporter --config ... call rapidapi-hostelworld.Get_Hotel_reviews hotel_id="91108" page="1"`

#### 5. Search by URL Tools
- **Tools:** `Get_Hotel_details_by_url`, `Get_Hotel_list_by_url`, `Get_Hotel_availability_by_url`
- **Purpose:** Get details, list, or availability using a direct Hostelworld URL.
- **Required:** `url` (e.g., "https://www.hostelworld.com/pwa/hosteldetails.php/...")
- **Example:** `mcporter --config ... call rapidapi-hostelworld.Get_Hotel_details_by_url url="..."`

## Output Expectations

For each option, try to include:

1. **Property Name & Type:** (e.g., "Wombat's City Hostel - Dorm/Private").
2. **Pricing:** Total price for the stay and currency.
3. **Location:** Neighborhood and distance from city center/transit.
4. **Ratings:** Overall score and breakdown (Social, Security, Cleanliness).
5. **Atmosphere:** Social vibe (party, chill, quiet).
6. **Policies:** Cancellation terms and check-in/out times.

## Cross-Checks

- Compare with `rapidapi-airbnb-listings` when the traveler may prefer more privacy or a group stay.
- Use `rapidapi-tripadvisor` for an extra sentiment check if a property area looks uncertain.
- Normalize currency with `rapidapi-currency-rates` when needed.

## Failure Handling

- If the config or env is missing, report the exact missing item.
- If inventory is sparse, retry with broader price range or nearby neighborhoods.
- If the provider lacks policy details, say that explicitly instead of assuming flexibility.
- Current live results may surface prices in a local or unexpected currency, so normalize them before ranking options.

## Common Mistakes

- Showing only nightly price instead of total trip cost
- Ignoring dorm/private distinction
- Treating rating without review volume as conclusive
