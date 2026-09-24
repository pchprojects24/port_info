// Port file: Saint-Pierre & Miquelon.
// See ports/_template.js for what every field does. Only `name` is required;
// anything you leave out is either filled in automatically or hidden.
window.PORT_DATA = {
  name: "Saint-Pierre",
  region: "Saint-Pierre & Miquelon · French Territory",
  greeting: "Bienvenue à",
  flag: "🇫🇷",
  lat: 46.7792,
  lon: -56.1762,
  timezone: "America/Miquelon",
  tzLabel: "SPM time",
  countryCode: "PM",
  mapQuery: "Saint-Pierre Miquelon",
  wiki: "Saint-Pierre, Saint Pierre and Miquelon",

  emergencyTitle: "French Territory — Emergency Numbers",
  emergency: [
    { number: "15", label: "SAMU (Medical)" },
    { number: "17", label: "Gendarmerie" },
    { number: "18", label: "Pompiers" },
    { number: "112", label: "All Emergencies" }
  ],

  // Added after the ship-wide routine sections in ship.js
  routine: [
    { title: "Currency & Language", items: [
      "<strong>Currency:</strong> Euro (€) is official. Canadian dollars are widely accepted but you may get an unfavourable exchange rate. US dollars are also accepted in many places.",
      "<strong>ATMs:</strong> Available in Saint-Pierre town centre.",
      "<strong>Language:</strong> French. Most locals in shops and restaurants understand basic English, but coming with a few French phrases goes a long way and is appreciated.",
      "<strong>Phones:</strong> Canadian phones typically roam on French networks. Check your plan for international rates. Country code is +508."
    ] }
  ],

  weather: {
    icon: "🌫️",
    note: "<strong>SPM is one of the foggiest places in North America.</strong> Conditions can change quickly — always check a live source before heading out.",
    climate: "Saint-Pierre has a maritime subarctic climate — cool, humid, and famously foggy. The islands sit at the meeting point of the cold Labrador Current and warmer Gulf Stream air, producing near-constant fog from spring through autumn. Wind is almost always present; dress in windproof layers year-round. Rain and drizzle are frequent. Snow is possible from November through April. Summer (July–August) brings the mildest weather, with temperatures reaching 15–20°C on good days, but fog remains. Spring and autumn average 5–12°C. Check the live forecast before going out.",
    links: [
      { label: "Météo France", icon: "🇫🇷", url: "https://meteofrance.gp/fr/previsions-meteo-france/saint-pierre-et-miquelon/PM975" },
      { label: "AccuWeather", icon: "🌡️", url: "https://www.accuweather.com/en/pm/saint-pierre/50388/weather-forecast/50388" },
      { label: "Environment Canada", icon: "🍁", url: "https://weather.gc.ca/en/location/index.html?coords=46.779,-56.176" },
      { label: "14-Day Forecast", icon: "📅", url: "https://www.timeanddate.com/weather/france/saint-pierre/ext" }
    ]
  },

  gettingAround: {
    intro: "<strong>Saint-Pierre town is entirely walkable.</strong> The main waterfront, square, restaurants, and shops are all within a 10–15 minute walk of the quay. There is no public bus service. For the Grand Barachois or further exploration, take a taxi or rent a vehicle.",
    places: [
      { label: "Centre-Ville Saint-Pierre", icon: "📍", map: "Centre-Ville Saint-Pierre Miquelon" },
      { label: "Place du Général de Gaulle", icon: "🏛️", map: "Place du Général de Gaulle Saint-Pierre Miquelon" },
      { label: "Île aux Marins", icon: "⛵", map: "Île aux Marins Saint-Pierre Miquelon" },
      { label: "Musée de l'Arche", icon: "🏛️", map: "Musée de l'Arche Saint-Pierre Miquelon" },
      { label: "Grand Barachois", icon: "🐎", map: "Grand Barachois Saint-Pierre Miquelon" },
      { label: "Pain de Sucre", icon: "🌊", map: "Pain de Sucre Saint-Pierre Miquelon" }
    ],
    transport: [
      "<strong>Walking:</strong> The entire town of Saint-Pierre is walkable. The main quay, town square, shops, restaurants, and waterfront are all close together.",
      "<strong>Taxi:</strong> A small number of local taxis operate on the island. Ask at the port or your hotel for current contact numbers — the fleet is small and numbers change.",
      "<strong>No Uber / Rideshare:</strong> Not available on the islands.",
      "<strong>Vehicle rental:</strong> Cars and scooters are available for rent in town — useful for reaching the Grand Barachois or Pain de Sucre.",
      "<strong>Bicycle rental:</strong> Bikes available in season — ask at the tourism office near the town centre.",
      "<strong>Ferry to Île aux Marins:</strong> Regular passenger ferry service from the Saint-Pierre waterfront. Check locally for departure times.",
      "<strong>Ferry to Miquelon:</strong> Regular service connects Saint-Pierre to the larger but more remote Miquelon island. A full-day trip."
    ]
  },

  food: {
    subtitle: "It's France — eat well",
    intro: "Saint-Pierre has surprisingly good food for its size — fresh Atlantic seafood, French bistro classics, and excellent bread. Options are limited compared to a city; reservations are recommended for dinner. Alcohol (wine, spirits, beer) is significantly cheaper than in Canada — no federal excise tax."
  },

  hotels: {
    subtitle: "Saint-Pierre town · Limited options — book ahead",
    intro: "Saint-Pierre has a small number of hotels and chambres d'hôtes (B&Bs). During the brief summer tourist season, availability is tight. Book as early as possible. Most properties are small and centrally located."
  },

  safety: [
    { title: "General", items: [
      "Saint-Pierre is one of the safest ports you will visit. The population is around 6,000 and crime is very low.",
      "Use common sense and stay aware of your surroundings, particularly at night near the bars.",
      "The weather and the waterfront are your biggest hazards — fog rolls in fast and the harbour edge can be slippery.",
      "Buddy system, especially at night."
    ] },
    { title: "Weather Hazards", items: [
      "Dense fog can reduce visibility to near zero with little warning. Stay on marked paths.",
      "Wind is almost constant. Dress in windproof layers even in summer.",
      "Rain and drizzle are frequent. The waterfront boardwalk and dock areas can be slippery.",
      "If hiking to Pain de Sucre or along the coast, be cautious near cliff edges — fog removes depth perception quickly.",
      "Cold water temperatures year-round — if you go near the water's edge, be careful."
    ] },
    { title: "Alcohol / Nights Out", items: [
      "Alcohol is significantly cheaper here than in Canada — it's duty-free French territory. Pace yourself.",
      "The bar scene is small but active. Know how you're getting back to the ship before you go out.",
      "Look out for your shipmates.",
      "It's a small community — be a good guest."
    ] },
    { title: "ID / Valuables", items: [
      "Carry your military ID and a second piece of government photo ID.",
      "You are in French territory — your passport or DND ID card may be requested.",
      "Don't carry more cash than you need; use a card where accepted.",
      "Leave valuables secured aboard or in your hotel safe."
    ] },
    { title: "Medical & Emergencies", items: [
      "Call <strong>15</strong> for medical emergencies (SAMU).",
      "Call <strong>17</strong> for police (Gendarmerie Nationale).",
      "Call <strong>18</strong> for fire (Pompiers).",
      "Call <strong>112</strong> from any mobile for all emergencies.",
      "Hospital: Centre Hospitalier François Dunan, Saint-Pierre — the only hospital on the islands.",
      "Medical care will be billed at French rates. Ensure your health coverage is in order before going ashore.",
      "Inform the ship of any incidents as soon as practical."
    ] }
  ],

  activities: [
    { name: "Place du Général de Gaulle", desc: "The heart of town — a lively square ringed by colourful French buildings, restaurants, and the waterfront.", tags: ["Iconic","Outdoors","Quick"], map: "Place du Général de Gaulle Saint-Pierre Miquelon", web: "" },
    { name: "Île aux Marins", desc: "Ferry to the ghostly abandoned fishing village island just across the harbour. One of the most evocative spots in the North Atlantic.", tags: ["Iconic","Outdoors","Half-day"], map: "Île aux Marins Saint-Pierre Miquelon", web: "" },
    { name: "Musée de l'Arche", desc: "The main heritage museum — fishing history, the Prohibition rum-running era, and Saint-Pierre's remarkable past.", tags: ["Iconic","Indoors","Half-day"], map: "Musée de l'Arche Saint-Pierre Miquelon", web: "" },
    { name: "Quai de la Roncière", desc: "Stroll the main waterfront quay past colourful fishing boats and the old warehouses.", tags: ["Iconic","Outdoors","Quick"], map: "Quai de la Roncière Saint-Pierre Miquelon", web: "" },
    { name: "Grand Barachois Lagoon", desc: "Coastal lagoon about 10 km from town, home to a famous herd of wild horses.", tags: ["Outdoors","Half-day"], map: "Grand Barachois Saint-Pierre Miquelon", web: "" },
    { name: "Pain de Sucre", desc: "Rocky promontory at the island's southern tip with sweeping views.", tags: ["Outdoors","Half-day"], map: "Pain de Sucre Saint-Pierre Miquelon", web: "" },
    { name: "Duty-Free Shopping", desc: "French wines, Cognac, Champagne, cheese, perfumes at EU prices — no Canadian excise tax.", tags: ["Quick","Indoors"], map: "Centre-Ville Saint-Pierre Miquelon", web: "" },
    { name: "Rhum SPM", desc: "The islands' own rhum agricole — one of the few French rums made in the western hemisphere.", tags: ["Food-Drink","Quick"], map: "Saint-Pierre Miquelon", web: "" },
    { name: "Free French Heritage Walk", desc: "On Christmas Eve 1941, three French corvettes liberated the islands overnight.", tags: ["Iconic","Outdoors","Quick"], map: "Place du Général de Gaulle Saint-Pierre Miquelon", web: "" },
    { name: "French Bakery Breakfast", desc: "Fresh baguettes, croissants, and pain au chocolat. It's France — breakfast matters.", tags: ["Food-Drink","Quick","Indoors"], map: "Boulangerie Saint-Pierre Miquelon", web: "" },
    { name: "Boat Tour of the Islands", desc: "Several operators offer boat tours around Saint-Pierre and to nearby islets. Good way to see the coast and wildlife.", tags: ["Outdoors","Half-day"], map: "Saint-Pierre Miquelon boat tours", web: "" }
  ],
  todoChips: ["Iconic","Outdoors","Indoors","Food-Drink","Quick","Half-day"],
  venueData: {
    'tab-food': [
      { name: "Le Feu de Braise", note: "The best table in Saint-Pierre — classic French cuisine with fresh Atlantic seafood.", price: "$$$", map: "Le Feu de Braise Saint-Pierre Miquelon", web: "" },
      { name: "L'Escale", note: "Waterfront brasserie with fresh fish, mussels, and French bistro classics.", price: "$$", map: "L'Escale brasserie Saint-Pierre Miquelon", web: "" },
      { name: "Restaurant Robert", note: "Hôtel Robert dining room — traditional Franco-Atlantic cooking.", price: "$$", map: "Restaurant Hôtel Robert Saint-Pierre Miquelon", web: "" },
      { name: "Crêperie", note: "Savoury galettes and sweet crêpes — casual and affordable.", price: "$", map: "crêperie Saint-Pierre Miquelon", web: "" },
      { name: "Boulangeries", note: "Multiple French bakeries in town. Fresh baguettes, croissants, viennoiseries.", price: "$", map: "Boulangerie Saint-Pierre Miquelon", web: "" }
    ],
    'tab-coffee': [
      { name: "Cafés — Place du Général de Gaulle", note: "Several small cafés ring the main square. Walk it and find your spot.", price: "$", map: "café Place du Général de Gaulle Saint-Pierre Miquelon", web: "" },
      { name: "Boulangerie Café", note: "Most bakeries also serve espresso and café crème. Best early-morning option.", price: "$", map: "Boulangerie café Saint-Pierre Miquelon", web: "" }
    ],
    'tab-bars': [
      { name: "Waterfront Bars", note: "A handful of lively bars near the port. Alcohol is significantly cheaper — duty-free French territory.", price: "$", map: "bar Saint-Pierre Miquelon", web: "" },
      { name: "Bar — Hôtel Robert", note: "The hotel bar: reliable evening option where locals and visitors mix.", price: "$$", map: "Hôtel Robert Saint-Pierre Miquelon", web: "" }
    ],
    'tab-shop': [
      { name: "Wine & Spirits Shops", note: "French wines, Cognac, Armagnac, Calvados at EU prices. No Canadian or US excise tax.", price: "$$", map: "wine spirits Saint-Pierre Miquelon", web: "" },
      { name: "French Épicerie", note: "French cheeses, charcuterie, and chocolates you won't find at those prices in Canada.", price: "$", map: "épicerie Saint-Pierre Miquelon", web: "" },
      { name: "Parfumerie", note: "French cosmetics and perfumes at Paris-equivalent prices.", price: "$$", map: "parfumerie Saint-Pierre Miquelon", web: "" }
    ]
  },
  hotelData: [
    { name: "Hôtel Robert", note: "The historic main hotel — central, classic French character, on-site restaurant and bar.", phone: "", map: "Hôtel Robert Saint-Pierre Miquelon", web: "" },
    { name: "Hôtel Ile de France", note: "Comfortable mid-range hotel in the town centre, close to the waterfront.", phone: "", map: "Hôtel Ile de France Saint-Pierre Miquelon", web: "" },
    { name: "Chambres d'Hôtes / B&Bs", note: "Several private B&Bs offer rooms in Saint-Pierre — often the most atmospheric option.", phone: "", map: "chambre d'hôte Saint-Pierre Miquelon", web: "" },
    { name: "Auberge Saint-Pierre", note: "Small inn with modest rooms in town — a practical base for a short stay.", phone: "", map: "Auberge Saint-Pierre Miquelon", web: "" }
  ],
  localContacts: [
    { name: "Centre Hospitalier François Dunan", sub: "Saint-Pierre — only hospital on the islands", phone: "+50841918181", phoneLabel: "+508 41 91 81", map: "Centre Hospitalier François Dunan Saint-Pierre Miquelon" },
    { name: "Gendarmerie (Non-Emergency)", sub: "Gendarmerie Nationale, Saint-Pierre", phone: "17", phoneLabel: "17", map: "Gendarmerie Saint-Pierre Miquelon" },
    { name: "Canadian Coast Guard", sub: "Marine emergencies — NL sector", phone: "+18002670780", phoneLabel: "1-800-267-0780", map: "" },
    { name: "Taxis", sub: "A small local taxi fleet — ask at the port or your hotel for current numbers", phone: "", map: "taxi Saint-Pierre Miquelon", mapLabel: "Find Nearby" }
  ],

  feature: {
    title: "The Rum Running Era",
    icon: "🥃",
    subtitle: "Saint-Pierre: Rum Capital of North America · 1920–1933",
    introTitle: "The Most Improbable Story in the North Atlantic",
    intro: "For thirteen extraordinary years, this quiet French fishing archipelago — population a few thousand, economy built on cod — became the single most important transshipment hub for illicit alcohol in North America. When the United States went dry in 1920, the bootleggers of the world discovered Saint-Pierre, and the islands were never quite the same.",
    sections: [
      { title: "How It Started", html: `<p>On 17 January 1920, the Volstead Act came into force across the United States, making the manufacture, sale, and transport of alcohol illegal. What it could not do was make alcohol illegal in Saint-Pierre et Miquelon — French territory, subject to French law, sitting 25 kilometres off the coast of Newfoundland.</p>
        <p style="margin-top:10px;">The geography was obvious. The legal loophole was absolute. Within months, whisky and rum traders had discovered the islands. Ships from Scotland loaded with Scotch whisky, vessels from Barbados and Jamaica carrying Caribbean rum, and freighters from Canada laden with rye began converging on Saint-Pierre's harbour.</p>
        <p style="margin-top:10px;">The trade was entirely legitimate on the French side. The liquor was imported legally, warehoused legally, and sold legally to buyers who would then carry it into American — or occasionally Canadian — waters by whatever means they chose. What happened after it left Saint-Pierre was someone else's problem.</p>` },
      { title: "The Operation", html: `<p>At its peak in the late 1920s, more than <strong>4 million bottles of spirits</strong> were passing through Saint-Pierre annually. Warehouses went up across the island. The main wharf, where your ship is likely berthed today, was stacked with bonded goods of every kind.</p>
        <p style="margin-top:10px;">The supply chain worked like this: liquor arrived in bulk by legitimate cargo ship, was stored in bonded warehouses, and was then loaded onto fast, low-slung contact boats — some capable of 20+ knots — that would make the run to the American coastline under cover of darkness, or to a rendezvous point outside US territorial waters where larger rum-running schooners waited to ferry it the final distance.</p>
        <p style="margin-top:10px;">The most popular destinations were the rum rows off Montauk Point, New York, and the New England coast. Boston, New York, and Philadelphia were the ultimate markets. The Canadian provinces of Nova Scotia and Newfoundland were also supplied — Prohibition had Canadian dimensions too, with provincial dry laws.</p>
        <p style="margin-top:10px;">The Newfoundland schooner fleet, many captained by men who knew the North Atlantic fog better than any coast guard, became the backbone of the transportation network. Vessels like the famous <em>Nellie J. Banks</em> made dozens of runs and are still remembered in local lore.</p>` },
      { title: "The Al Capone Connection", html: `<p>The Chicago Outfit — Al Capone's organization — was among the most active American buyers in Saint-Pierre. Capone's representatives were regular visitors to the island, negotiating contracts with Scotch whisky suppliers and arranging shipments through the rum-running network to supply Chicago's speakeasies.</p>
        <p style="margin-top:10px;">Local legend — difficult to fully verify but persistent — holds that Capone himself visited Saint-Pierre at least once, staying at the hotel on the main square. What is beyond doubt is that the money from Chicago, New York, and Boston flowed freely through Saint-Pierre's banks and businesses during the boom years. The islands, previously living on the margins of the cod trade, were suddenly prosperous.</p>
        <p style="margin-top:10px;">Beyond Capone, virtually every major American bootlegging operation of the era had some connection to Saint-Pierre. The island became a kind of neutral trading floor — a place where American gangsters, Canadian schooner captains, Scottish distillers, and French officials coexisted in a relationship of mutual self-interest.</p>` },
      { title: "The Boom — and the Bust", html: `<p>The economic transformation of Saint-Pierre during Prohibition was staggering. New stone warehouses were built along the waterfront. A new hotel went up. The harbour was busy year-round. Workers arrived from Newfoundland and mainland France. Tax revenues soared. The local population more than doubled during the peak years as workers flooded in to manage the warehouses, service the boats, and serve the trade.</p>
        <p style="margin-top:10px;">Then, on <strong>5 December 1933</strong>, Franklin Roosevelt signed the proclamation repealing Prohibition. By the following morning, the bottom had dropped out of Saint-Pierre's bootleg economy. Orders stopped. Ships stopped coming. Warehouse workers left. The hotel emptied. The islands' brief, improbable boom was over almost as suddenly as it had begun.</p>
        <p style="margin-top:10px;">The legacy, however, endured. The warehouses remained. The stories were told and retold. And the French tradition of fine spirits — particularly rum, connected to the island's long history of trade with the French Caribbean — never entirely disappeared. Rhum SPM, the islands' own rhum agricole, is a direct descendant of that tradition.</p>` },
      { title: "WWII: The Free French Liberation", html: `<p>The islands have a second remarkable chapter, less well-known but equally dramatic. After France fell in June 1940, Saint-Pierre came under the nominal authority of the Vichy regime — the German-aligned French government. A Vichy-appointed governor enforced the official line.</p>
        <p style="margin-top:10px;">On the night of <strong>24 December 1941</strong>, a small Free French naval force under Admiral Émile Muselier sailed into Saint-Pierre harbour in three corvettes and a submarine — vessels of the type that would have been familiar to the Crow's Nest officers in St. John's. By Christmas morning, the islands had been liberated. The Vichy governor was deported. A plebiscite confirmed the islanders' overwhelming support for de Gaulle and the Free French.</p>
        <p style="margin-top:10px;">The operation caused a significant diplomatic incident. The United States, which still recognized Vichy France, was furious. Secretary of State Cordell Hull demanded the islands be returned. Canada was embarrassed. De Gaulle was unapologetic. In the end, Saint-Pierre remained Free French — and the islands became, however briefly, a symbol of resistance and liberation in the western hemisphere.</p>` },
      { title: "Timeline", html: `<ul>
        <li><strong>1920</strong> — US Prohibition begins. Saint-Pierre becomes a liquor transshipment hub almost immediately.</li>
        <li><strong>mid-1920s</strong> — Peak of the rum-running trade. Scotch, rye, rum, and brandy flow through the islands at millions of bottles per year.</li>
        <li><strong>c. 1930</strong> — Al Capone's organization among the most active American buyers.</li>
        <li><strong>5 Dec 1933</strong> — US Prohibition repealed. The rum-running economy collapses within days.</li>
        <li><strong>24 Dec 1941</strong> — Free French naval force liberates Saint-Pierre from Vichy authority in a Christmas Eve operation.</li>
        <li><strong>1945</strong> — End of WWII. The islands remain French territory.</li>
        <li><strong>Today</strong> — The rum-running warehouses still stand along the waterfront. Musée de l'Arche tells the full story. Rhum SPM keeps the spirits tradition alive.</li>
        </ul>` },
      { title: "See It Today", html: `<p><strong>Musée de l'Arche</strong> — The main heritage museum in Saint-Pierre has excellent exhibits on the Prohibition era, including photographs, artefacts, and the stories of the rum-running families. Highly recommended.</p>
        <p style="margin-top:8px;"><strong>The Waterfront Warehouses</strong> — Several of the original stone warehouses that stored bonded liquor during the 1920s still line the port area. You can see them from the quay where your ship is berthed.</p>
        <p style="margin-top:8px;"><strong>Rhum SPM</strong> — Pick up a bottle of the islands' own rum. It connects directly to the long tradition of spirits on the island and makes an excellent reminder of the visit.</p>
        <p style="margin-top:8px;"><strong>Île aux Marins</strong> — Many of the Newfoundland schooner captains and crew involved in the rum trade lived on this small island. Walking it today, you can feel the history in the abandoned houses and fishing stages.</p>` }
    ],
    links: [
      { label: "Musée de l'Arche", map: "Musée de l'Arche Saint-Pierre Miquelon" },
      { label: "Waterfront", map: "Saint-Pierre Miquelon waterfront" }
    ]
  }
};
