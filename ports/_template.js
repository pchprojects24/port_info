// NEW PORT TEMPLATE
// 1. Copy this file to ports/<name>.js  (lowercase, dashes — e.g. ports/halifax.js)
// 2. Fill in `name`. Everything else is optional — delete what you don't need.
// 3. Open the site with ?port=<name>  (or change DEFAULT_PORT in index.html).
//
// Filled in automatically when left out: map location, time zone, country flag,
// a short "About" blurb (Wikipedia), general emergency numbers for the country,
// live weather and forecast-link buttons, and "search nearby" Google Maps buttons
// for food, hotels, pharmacies, ATMs, taxis, etc.
//
// Fields marked (HTML) may contain simple markup like <strong>. Everything else is plain text.
window.PORT_DATA = {
  name: "Halifax",                     // REQUIRED — the city/town name
  // region: "Nova Scotia · Canada",   // subtitle under the name (auto: province · country)
  // greeting: "Welcome to",           // landing title prefix
  // flag: "🇨🇦",                      // auto from country
  // lat: 44.6488, lon: -63.5752,      // auto-looked-up from the name; set these if it picks the wrong place
  // timezone: "America/Halifax",      // auto
  // tzLabel: "Halifax time",          // label beside the weather time (default "local time")
  // countryCode: "CA",                // auto; used for emergency numbers & flag
  // geocode: "Halifax",               // name to look up if different from `name`
  // countryHint: "CA",                // helps the lookup pick the right country for common names
  // mapQuery: "Halifax Nova Scotia",  // appended to Google Maps searches (auto)
  // wiki: "Halifax, Nova Scotia",     // Wikipedia article title for the About card; false to hide it

  // Overrides the automatic country numbers. Always confirm these before sailing.
  // emergencyTitle: "Emergency Numbers",
  // emergency: [ { number: "911", label: "Police · Fire · Ambulance" } ],

  // Extra sections on "Ship Routine & Leave", after the ship-wide ones in ship.js
  // routine: [ { title: "Currency & Language", items: ["(HTML) ..."] } ],

  // weather: {
  //   icon: "🌦️",
  //   note: "(HTML) one-line heads-up shown above the live weather",
  //   climate: "(HTML) what to expect this time of year",
  //   links: [ { label: "Environment Canada", icon: "🍁", url: "https://..." } ]   // auto: Windy + Ventusky
  // },

  // gettingAround: {
  //   intro: "(HTML) ...",
  //   places: [ { label: "Waterfront", icon: "📍", map: "Halifax Waterfront" } ],
  //   transport: ["(HTML) <strong>Walking:</strong> ..."]
  // },

  // Things to do. `tags` drive the filter chips (auto from tags if todoChips is left out).
  // activities: [ { name: "Citadel Hill", desc: "...", tags: ["Iconic", "Outdoors"], map: "Citadel Hill Halifax", web: "" } ],
  // todoChips: ["Iconic", "Outdoors", "Indoors", "Food-Drink", "Quick", "Half-day"],

  // food: { subtitle: "...", intro: "..." },
  // venueData: {
  //   'tab-food':   [ { name: "...", note: "...", price: "$$", map: "... Halifax", web: "" } ],
  //   'tab-coffee': [],
  //   'tab-bars':   [],
  //   'tab-shop':   []
  // },

  // hotels: { subtitle: "...", intro: "..." },
  // hotelData: [ { name: "...", note: "...", phone: "+1...", map: "... Halifax", web: "" } ],

  // Replaces the default safety sections in ship.js
  // safety: [ { title: "General", items: ["..."] } ],

  // localContacts: [ { name: "Hospital", sub: "...", phone: "+1...", phoneLabel: "...", map: "..." } ],

  // Optional extra page on the home screen — local history, a special event, etc.
  // feature: {
  //   title: "The Halifax Explosion", icon: "📜", subtitle: "6 December 1917",
  //   introTitle: "...", intro: "(HTML) ...",
  //   sections: [ { title: "...", html: "<p>...</p>" } ],
  //   links: [ { label: "Maritime Museum", map: "Maritime Museum of the Atlantic Halifax" } ]
  // }
};
