# Port brief generation instructions

This repository is a reusable template for **any port**. When a user names a port or asks to fill/update a brief, complete the workflow below. The user should not need to specify individual fields or rewrite the layout.

## Start from the port name

1. Read `README.md`, `templates/port.template.json`, and `scripts/validate.js`.
2. Resolve the port to a country, region, and actual harbour/terminal area using current authoritative sources. If the name identifies materially different ports (for example, Saint John versus St. John's), ask one focused clarification. Do independent research while waiting. Do not silently select a country.
3. Reuse `ports/<slug>.json` if it already exists; otherwise run `npm run new-port -- "Port name" "port-country"`. Start from the blank template, **never from another port's filled record**. Preserve other ports and existing user-provided corrections.
4. Research every section and list below. Default to an English-language brief for Canadian ship personnel, with Canadian consular resources. No visit dates means a year-round guide, with seasonal differences explained.
5. Write the port JSON, set `site.config.json` to its slug, run validation/build/tests, and inspect the rendered guide. Keep the page structure and visual design consistent. Generating a port does not require editing application code.

## Research coverage

- Identity: local name, country, region, IANA time zone, verified latitude/longitude, welcome and short description. Distinguish city coordinates from an actual berth.
- Ship routine: berth/anchorage, landing point, port window, leave, overnight leave, shuttle/boat return, duty contacts. These are **user-required**, not web-research facts. Keep them explicitly unconfirmed unless supplied. Do not infer arrival/departure dates, ship movements, leave expiry, phone numbers or orders. Do not add operational/private details to this public repository without explicit authorization.
- Essentials: currency, payments, ATMs, tipping, language/phrases, phone code/connectivity, electrical plugs/voltage, and relevant entry guidance. Do not assume visa eligibility or military exemptions.
- Getting around: port orientation, public terminal location, city centre, transport hubs, official operators, fares/schedules when verified, accessibility and getting back to the ship. Map queries must identify the new location precisely.
- Activities: a useful mix of nearby/short visits and longer trips when applicable, grouped using `todoChips`. Prefer a small useful selection over arbitrary quotas. Explain seasonal closures and long travel commitments.
- Food, coffee, bars and shopping: research each category, budgets and neighbourhoods; prefer individual real venues with official websites. If a category is inappropriate or unavailable, explain why in the page content. Do not invent nightlife where there is none.
- Hotels: practical locations, official website, map query and verified contact information where available. Do not claim availability or guaranteed prices.
- Weather: seasonal conditions, locally relevant hazards, official weather/warning links. Live weather uses the port's coordinates and time zone; do not hardcode temperatures or pretend a forecast exists without visit dates.
- Safety: current Canadian travel advice and local official guidance; relevant local hazards, laws, health information, emergency services, medical facilities and Canadian consular coverage. Confirm the scope of emergency numbers. Do not assume every country uses one number for police/fire/ambulance. Use multiple quick contacts where needed.
- History/culture and local facts: authoritative heritage, museum, municipal or scholarly sources. Avoid fabricated translations or trivia.

## Evidence and uncertainty

Browse live sources; do not populate changing details from model memory. Prefer government/port authorities, official tourism boards, national weather services, official transit operators, hospitals and venues. Use reputable secondary sources when primary sources are unavailable, and identify them accurately.

The port identity and each factual item/block have `status`, `sourceIds`, and `checkedOn`. Add real source records with `id`, `title`, `publisher`, `url` and `accessedOn` (YYYY-MM-DD). Cite the page that supports the claim, not a search result. Read sources before citing them. Use the actual date of research; never copy a previous port's date. Keep blocks narrow enough that their sources support every claim. Split blocks if necessary.

- `verified`: supported by consulted sources; requires at least one source ID and check date. This means source-checked, not operationally approved.
- `unknown`: research did not resolve it; state the gap and leave numbers/URLs blank rather than guessing.
- `not-applicable`: explain why the category does not apply.
- `user-required`: ship/private details that need the user's input.
- `unverified`: preserved legacy material; not acceptable in a new completed research draft.

If sources disagree, explain the disagreement and keep the disputed detail unknown. If browsing is unavailable, retain a draft and clearly report the research limitation. Do not manufacture sources or stamp content as verified. Only set `meta.status` to `researched` and `lastResearched` after research is actually done. Unknown/user-required items can remain in a researched draft if identified clearly. A source check never establishes clinical approval, local stock, berth assignment or ship authorization.

## Data and completion

Use plain text in all content fields, no HTML. Use `paragraphs`, `items`, and `links` for content blocks. Use HTTP(S) URLs and valid telephone numbers; leave unknown action fields empty. Keep all required pages and venue categories. When a list does not apply, include one explanatory `not-applicable` entry with no phone/map/website actions; an empty list means not yet researched. `quickContacts` is a list of zero-based indexes into `localContacts`; put actual local emergency services first, or retain an explicit unknown entry.

Follow the record examples in `README.md` for list entries. Preserve unrelated source files and images. Do not hand-edit generated `data.js`, `manifest.webmanifest`, or `sw.js`.

Run:

```sh
npm run validate -- ports/<slug>.json --strict
npm run build
npm run check
```

Inspect desktop and mobile: identity, local clock, weather request coordinates/time zone, all sections, empty/unknown states, source links, quick calls/maps, activity filters and venue/hotel search. Verify no former port names, contacts, map queries, advisory text or artwork remain. Check offline behavior after the service worker installs. Report research gaps and exact delivery state; a branch/PR is not a merge or deployment. Publish/deploy only within the user's authorized scope.

## Ashore tools

Populate `ashore.returnPoint`, `currency`, `language`, `transport`, and `cautions` with short `text` plus the standard evidence fields. Keep the return point `user-required` until supplied. These appear on the home screen and printable essentials sheet; write concise summaries appropriate for quick reference.

Add optional `coordinates: { "lat": number, "lon": number }` to individual activities, venues, hotels and local contacts only when supported by a consulted location source. Cite it in the item's sources. City-centre coordinates are not a substitute for each venue's location. Unlocated places still have searchable map queries.

An activity can have `timing: null` when unresolved, or an evidence-bearing object with `visitMinutes`, `roundTripMinutes`, `bufferMinutes`, `origin`, `basis`, `status`, `sourceIds`, and `checkedOn`. Record the origin, transport assumption and basis for the estimate. Do not infer minutes from tags such as Quick or Half-day. Only source-checked timings enter time-budget results. Travel estimates are not ship leave instructions.

Verify the offline readiness indicator after saving, offline navigation, filtered map/list agreement, unknown timing exclusion and the print-only essentials layout. Map tiles and external directions require internet; do not bulk-download street maps as part of the offline pack.
