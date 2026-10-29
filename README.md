# Port Brief

A mobile-friendly, installable port guide with one reusable layout and a complete data record for each port. Tell an AI with repository access and web research:

> Create a port brief for Halifax, Nova Scotia using this repository's template.

The AI follows [AGENTS.md](AGENTS.md), researches the port, fills the same sections, records its sources, checks the result, and selects that port for the site. You can normally provide just the port name. If a name is ambiguous, the AI asks which port you mean. Optional visit dates make seasonal advice more specific.

This is a **repository-driven AI workflow**: use Codex or another coding assistant with browsing and file access. The website displays the completed brief; it does not contain an AI chat service or require an AI API key.

## What the template covers

Ship routine and leave; money, language, connectivity and power; getting around; activities; food, coffee, bars and shopping; hotels; seasonal/live weather; safety and emergency services; ship/local contacts; history and local facts; sources and outstanding gaps.

Public information is researched. Ship-specific berth, dates, orders, leave times and contacts remain explicitly unconfirmed until supplied. The repository is public: do not commit private or operational details without explicit authorization.

The original Cancún guide is preserved in `ports/cancun-mexico.json` and remains the selected port. Its claims are marked **legacy / needs verification** because the original repository supplied no auditable sources. The migration is not a new fact-check of that guide. Existing photos are preserved as original assets and are not automatically shown for other ports.

## How the pieces fit

| File | Purpose |
| --- | --- |
| `templates/port.template.json` | Blank, port-neutral starting point with research prompts |
| `ports/<slug>.json` | Complete content and sources for one port |
| `site.config.json` | Selects the port displayed by this site |
| `AGENTS.md` | Instructions for an AI to research and populate a port |
| `scripts/validate.js` | Executable data contract and research-completeness checks |
| `index.html`, `styles.css`, `app.js` | Shared layout and interactions; no destination facts |
| `data.js`, `manifest.webmanifest`, `sw.js` | Generated site files; do not edit directly |

No package installation or build dependencies are required. Use Node 20 or newer.

```sh
npm run new-port -- "Halifax" "halifax-canada"
# Research and complete ports/halifax-canada.json using AGENTS.md.
# Set site.config.json to { "port": "halifax-canada" }.
npm run validate -- ports/halifax-canada.json --strict
npm run build
npm run check
python3 -m http.server 8080
```

Open `http://localhost:8080`. The selected port determines the title, welcome, clock, weather coordinates, contacts, content and installed-app name. The generated files can be served statically at the site root or in a subdirectory. A deployment shows one selected port; other port records remain available for future reuse. Rebuild to select a different port.

`npm run validate` checks all stored ports, including legacy records. `--strict` checks a newly researched port: complete identity/location, research date, no legacy unverified records, and source/date evidence for every verified item. It permits explicit unknown/not-applicable/user-required gaps. **Automated validation checks structure and evidence references; it cannot determine whether a source really supports a claim.** Human/AI source review is still required. CI also rejects generated files that do not match their source records.

## Content examples

All text is plain text, escaped by the renderer. Every research unit has `status`, `sourceIds` and `checkedOn`. Use these shapes for entries in the blank template (illustrative values only, not researched places):

```json
{
  "name": "Venue name",
  "emoji": "🍴",
  "note": "Description supported by the linked source.",
  "price": "$$",
  "map": "Full venue name, city, country",
  "web": "https://example.org/venue",
  "status": "verified",
  "sourceIds": ["venue-official"],
  "checkedOn": "2026-10-29"
}
```

- `activities`: use `desc` instead of `note`, plus `tags` drawn from `todoChips`.
- `venueData`: keep all four arrays: `tab-food`, `tab-coffee`, `tab-bars`, `tab-shop`.
- `hotelData`: use `note`; optional `phone`, `map`, `web`.
- `localContacts` / `shipContacts`: use `sub`; optional `phone`, `phoneLabel`, `map`, `mapLabel`, `web`.
- `facts`: use `text` and evidence fields.
- Page blocks: `title`, `paragraphs` (strings), `items` (strings), `links` (`label`/`url`), and evidence fields.
- Sources: `id`, `title`, `publisher`, `url`, `accessedOn`.

Empty lists render an explicit unresearched state. If research establishes that a category does not apply, include an explanatory `not-applicable` entry in that list, without action links. Unknown phones and websites are empty strings; unknown coordinates and time zones are `null`. The app will not substitute another port's weather or clock.

## Weather, installation and offline access

On Netlify, set `OPENWEATHER_API_KEY` in the server environment for live weather. Keep it out of client files and Git. Static/local hosting without the function still serves the full guide and shows a weather-unavailable message with retry and the port's forecast links. Forecast cards are representative three-hour samples near local midday, not daily high/low ranges; see [OpenWeather's forecast documentation](https://openweathermap.org/forecast5).

The service worker caches a complete content revision for offline use. Its revision changes when the selected port or app assets change. Cache cleanup is scoped to this app's path. After an update installs, reload to use the new revision. Open the guide online once before relying on offline access. External maps, websites, forecast links and live weather require a connection. Installed-app labels may require reinstalling after switching ports, depending on the device.

## Checks

`npm run check` runs data validation, regression tests for the template/build/weather contract, and generated-file consistency checks. Test a new port in a browser at desktop and mobile sizes before publishing. There is no publishing or deployment step in the generation scripts.
