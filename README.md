# Port Brief

A one-page, phone-friendly port brief (routine, weather, things to do, food, hotels, safety, contacts), hosted on Netlify.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The app. Contains no port-specific content. |
| `ship.js` | Ship-wide info that doesn't change between ports: ship contacts, routine and leave sections, default safety advice. |
| `ports/<name>.js` | One file per port. `ports/saint-pierre.js` is a fully filled-in example. |
| `ports/_template.js` | Blank template with every field explained. |
| `netlify/functions/weather.js` | Live weather (OpenWeatherMap). Needs the `OPENWEATHER_API_KEY` environment variable in Netlify. |

## Switching ports

- **Default port:** change `DEFAULT_PORT` near the top of the `<script>` in `index.html`.
- **A specific port file:** `https://<site>/?port=halifax` loads `ports/halifax.js`.
- **Any city, with no setup:** `https://<site>/?city=Reykjavik` builds a basic brief automatically. For ambiguous names, add a country code, for example `?city=Portland&country=US`.

## What's automatic vs. what you write

Only `name` is required in a port file. The app looks up the rest, all free and with no API keys needed:

- **Location, time zone, country and flag:** from the [Open-Meteo geocoding API](https://open-meteo.com/en/docs/geocoding-api).
- **Live weather and 4-day forecast:** from the coordinates, through the Netlify function.
- **Forecast links:** Windy and Ventusky for the port's coordinates, unless you list your own.
- **"About" blurb:** from Wikipedia's summary API. Articles about a same-named place far away are skipped.
- **Emergency numbers:** a general per-country table. The page shows a "confirm locally" note unless you set `emergency` in the port file.
- **Google Maps "nearby" buttons:** restaurants, cafés, bars, shopping, hotels, attractions, pharmacy, ATM, grocery store, hospital and taxi, centred on the port.

Hand-picked content can't be reliably pulled from a free source, so it still comes from the port file: restaurants, hotels, things to do, the transport notes, safety advice and any history page. When a list is empty, the page shows the Google Maps search buttons.

> Always confirm emergency numbers and local contacts before sailing.
