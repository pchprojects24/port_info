const D = window.PORT_DATA;
const port = D.port;
const E = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function webHref(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? E(url.href) : ''; } catch { return ''; }
}
function sourceNote(item) {
  const labels = { verified: 'Source checked', unverified: 'Needs verification', unknown: 'Not confirmed', 'not-applicable': 'Not applicable', 'user-required': 'Confirm with ship' };
  const refs = (item.sourceIds || []).map(id => D.sources.find(s => s.id === id)).filter(Boolean);
  return `<div class="source-note">${E(labels[item.status] || 'Needs verification')}${item.checkedOn ? ` · ${E(item.checkedOn)}` : ''}${refs.map(s => ` · <a href="${webHref(s.url)}" target="_blank" rel="noopener noreferrer">${E(s.title)}</a>`).join('')}</div>`;
}
function phoneToTelHref(phone) { return 'tel:' + String(phone || '').trim().replace(/[^0-9+*#]/g, ''); }
function mapHref(query) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query); }
function emptyState(emoji, text) { return `<div class="empty"><span class="empty-emoji">${E(emoji)}</span>${E(text)}</div>`; }
function actions(item) {
  return `<div class="actions">${item.phone ? `<a class="btn btn-call" href="${phoneToTelHref(item.phone)}">📞 ${E(item.phoneLabel || item.phone)}</a>` : ''}${item.map ? `<a class="btn btn-map" href="${mapHref(item.map)}" target="_blank" rel="noopener noreferrer">📍 ${E(item.mapLabel || 'Map')}</a>` : ''}${webHref(item.web) ? `<a class="btn btn-web" href="${webHref(item.web)}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}</div>`;
}
function itemCard(item, extraClass = '') {
  return `<div class="card item ${extraClass}"><div class="item-head"><span class="item-emoji">${E(item.emoji || '📍')}</span><div class="item-main"><div class="item-name">${E(item.name)} ${item.price ? `<span class="price">${E(item.price)}</span>` : ''}</div><div class="item-note">${E(item.desc || item.note || item.sub)}</div></div></div>${item.tags ? `<div class="item-tags">${item.tags.map(t => `<span class="tag">${E(tagLabel(t))}</span>`).join('')}</div>` : ''}${item.timing && BriefTools.totalMinutes(item)!==null ? `<p class="source-note">Allow ${BriefTools.totalMinutes(item)} min: ${item.timing.visitMinutes} visiting + ${item.timing.roundTripMinutes} return travel + ${item.timing.bufferMinutes} buffer. From ${E(item.timing.origin)}. ${E(item.timing.basis)}</p>${sourceNote(item.timing)}` : ''}${actions(item)}${sourceNote(item)}</div>`;
}
function contentBlock(b) {
  return `<article class="card prose content-block"><h2>${E(b.title)}</h2>${b.paragraphs.map(p => `<p>${E(p)}</p>`).join('')}${b.items.length ? `<ul>${b.items.map(i => `<li>${E(i)}</li>`).join('')}</ul>` : ''}<div class="actions">${b.links.filter(l => webHref(l.url)).map(l => `<a class="btn btn-web" href="${webHref(l.url)}" target="_blank" rel="noopener noreferrer">${E(l.label)}</a>`).join('')}</div>${sourceNote(b)}</article>`;
}
function researchItems() {
  const collections = [['Activities',D.activities],['Hotels',D.hotelData],['Local facts',D.facts],...Object.entries(D.venueData)];
  const empty = collections.filter(([,items]) => !items.length).map(([title]) => ({ title, status:'unknown', sourceIds:[], checkedOn:null }));
  return [...Object.entries(D.ashore || {}).map(([title,x])=>({...x,title})),...D.activities.filter(a=>a.timing).map(a=>({...a.timing,title:a.name+' timing'})),{...port,title:'Port identity and location'},...empty,...Object.values(D.pages).flatMap(p => p.blocks), ...D.activities, ...Object.values(D.venueData).flat(), ...D.hotelData, ...D.shipContacts, ...D.localContacts, ...D.facts];
}
function renderPort() {
  document.querySelector('meta[name="description"]').content = `Port brief for ${port.name}, ${port.country}.`;
  document.querySelector('meta[name="apple-mobile-web-app-title"]').content = port.name;
  document.querySelector('.brand').setAttribute('aria-label', `${port.name} Port Brief home`);
  for (const [id,value] of Object.entries({'port-name':port.name,'port-country':port.country || 'Country to confirm','port-welcome':port.welcome,'port-tagline':port.tagline,'port-location':['Port Brief',port.region,port.country].filter(Boolean).join(' · ')})) document.getElementById(id).textContent = value;
  const summary = D.meta.status === 'legacy-unverified' ? 'Original brief · not source-verified' : D.meta.status === 'researched' ? 'Research draft · review before use' : 'Draft · research incomplete';
  document.getElementById('brief-status').textContent = `${summary}${D.meta.lastResearched ? ` · Researched ${D.meta.lastResearched}` : ''}`;
  for (const [id,p] of Object.entries(D.pages)) {
    document.getElementById(`${id}-subtitle`).textContent = p.subtitle;
    document.getElementById(`${id}-content`).innerHTML = p.blocks.map(contentBlock).join('');
  }
  document.getElementById('contacts-local-subtitle').textContent = [port.name,port.region,port.country].filter(Boolean).join(' · ');
  document.getElementById('contacts-ship-subtitle').textContent = 'Confirm against current ship instructions';
  document.getElementById('explore-subtitle').textContent = `Discover ${port.name}`;
  const quick = D.quickContacts.map(i => D.localContacts[i]).filter(Boolean);
  document.getElementById('quick-dial').innerHTML = quick.map(c => c.phone ? `<a class="dial dial-sos" href="${phoneToTelHref(c.phone)}"><span class="dial-num">${E(c.phoneLabel || c.phone)}</span><span>${E(c.name)}<small>${c.status === 'verified' ? 'Source checked ' + E(c.checkedOn) : 'Needs verification'}</small></span></a>` : `<div class="card">${E(c.name)} · Not confirmed</div>`).join('');
  document.getElementById('emergency-contacts').innerHTML = quick.map(c => itemCard(c)).join('');
  const gaps = researchItems().filter(i => !['verified','not-applicable'].includes(i.status));
  document.getElementById('sources-content').innerHTML = `<div class="card prose content-block"><p>${E(D.meta.notes)}</p><p>${gaps.length} items need research or confirmation.</p></div><div class="label">Sources consulted</div>${D.sources.length ? D.sources.map(s => `<article class="card prose content-block"><h2><a href="${webHref(s.url)}" target="_blank" rel="noopener noreferrer">${E(s.title)}</a></h2><p>${E(s.publisher)} · Accessed ${E(s.accessedOn)}</p></article>`).join('') : emptyState('🔎','No source audit recorded yet.')}<div class="label">Outstanding items</div>${gaps.map(i => `<div class="card content-block"><strong>${E(i.title || i.name || i.text)}</strong>${sourceNote(i)}</div>`).join('')}`;
}


/* ===== PAGE REGISTRY ===== */
const PAGES = {
  sources: { title: 'Sources & Gaps', parent: 'landing', tab: 'landing' },
  landing:          { title: port.name,        parent: null,       tab: 'landing' },
  routine:          { title: 'Ship Routine',     parent: 'landing',  tab: 'landing' },
  explore:          { title: 'Explore',          parent: 'landing',  tab: 'explore' },
  map:              { title: 'Getting Around',   parent: 'explore',  tab: 'explore' },
  todo:             { title: 'Things To Do',     parent: 'explore',  tab: 'explore' },
  food:             { title: 'Food & Drink',     parent: 'explore',  tab: 'explore' },
  hotels:           { title: 'Hotels',           parent: 'landing',  tab: 'landing' },
  weather:          { title: 'Weather',          parent: 'landing',  tab: 'weather' },
  safety:           { title: 'Safety',           parent: 'landing',  tab: 'safety' },
  contacts:         { title: 'Contacts',         parent: 'landing',  tab: 'contacts' },
  'contacts-ship':  { title: 'Ship Contacts',    parent: 'contacts', tab: 'contacts' },
  'contacts-local': { title: 'Local Contacts',   parent: 'contacts', tab: 'contacts' },
  history:          { title: 'History',          parent: 'landing',  tab: 'landing' }
};
let currentPage = 'landing';

/* ===== NAVIGATION ===== */
function nav(pageId, pushHistory = true) {
  if (!PAGES[pageId]) pageId = 'landing';
  const meta = PAGES[pageId];
  currentPage = pageId;

  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === pageId));
  document.getElementById('back-btn').hidden = !meta.parent;
  document.querySelectorAll('.tab-btn').forEach(b => {
    const on = b.dataset.tabFor === meta.tab;
    b.classList.toggle('active', on);
    if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  document.title = pageId === 'landing' ? `${port.name} Port Brief` : `${meta.title} · ${port.name} Port Brief`;
  window.scrollTo({ top: 0, behavior: 'instant' });
  updateTopbarTitle();

  if (pageId === 'weather') renderWeatherPage();
  if (pageId === 'map') requestAnimationFrame(() => window.renderPlacesMap?.());
  updateA2HSVisibility();

  if (pushHistory) {
    const url = pageId === 'landing' ? location.pathname + location.search : '#' + pageId;
    history.pushState({ page: pageId }, '', url);
  }
}

function updateTopbarTitle() {
  const head = document.querySelector('.page.active .page-head');
  const scrolledPast = currentPage !== 'landing' && head && head.getBoundingClientRect().bottom < 64;
  const title = document.getElementById('topbar-title');
  const next = scrolledPast ? PAGES[currentPage].title : port.name;
  if (title.textContent !== next) title.textContent = next;
  document.getElementById('topbar-sub').textContent = scrolledPast ? `${port.name} Port Brief` : `Port Brief · ${port.country}`;
}
window.addEventListener('scroll', updateTopbarTitle, { passive: true });

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-nav]');
  if (!target) return;
  e.preventDefault();
  nav(target.dataset.nav);
});
document.getElementById('back-btn').addEventListener('click', () => {
  const parent = PAGES[currentPage] && PAGES[currentPage].parent;
  nav(parent || 'landing');
});
window.addEventListener('popstate', () => nav(location.hash.slice(1) || 'landing', false));

/* ===== THEME ===== */
const THEME_KEY = 'theme_v1';
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function effectiveTheme() {
  return document.documentElement.dataset.theme || (darkQuery.matches ? 'dark' : 'light');
}
function syncThemeButton() {
  const btn = document.getElementById('theme-btn');
  const dark = effectiveTheme() === 'dark';
  btn.textContent = dark ? '☀️' : '🌙';
  btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
document.getElementById('theme-btn').addEventListener('click', () => {
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch {}
  syncThemeButton();
});
darkQuery.addEventListener('change', syncThemeButton);
syncThemeButton();

/* ===== ACCORDION ===== */
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.acc-trigger');
  if (!trigger) return;
  const item = trigger.closest('.acc');
  const isOpen = item.classList.contains('open');
  const group = item.dataset.group;
  if (group) {
    document.querySelectorAll(`.acc[data-group="${group}"]`).forEach(a => {
      a.classList.remove('open');
      a.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
    });
  }
  if (!isOpen) {
    item.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  }
});

/* ===== LOCAL CLOCK ===== */
const clockFmt = port.timeZone ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: port.timeZone }) : null;
function tickClock() {
  document.getElementById('hero-clock').textContent = clockFmt ? `🕐 ${clockFmt.format(new Date())} local` : 'Local time not configured';
}
tickClock();
setInterval(tickClock, 20000);

/* ===== FACTS ===== */
const FACTS = D.facts;
let factIdx = Math.floor(Math.random() * FACTS.length);
const factText = document.getElementById('fact-text');
factText.textContent = FACTS[factIdx]?.text || 'Local facts have not been researched yet.';
document.getElementById('fact-source').innerHTML = FACTS[factIdx] ? sourceNote(FACTS[factIdx]) : '';
document.getElementById('fact-btn').disabled = FACTS.length < 2;
document.getElementById('fact-btn').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  btn.classList.toggle('spin');
  factText.classList.add('fading');
  setTimeout(() => {
    factIdx = (factIdx + 1 + Math.floor(Math.random() * (FACTS.length - 1))) % FACTS.length;
    factText.textContent = FACTS[factIdx]?.text || 'Local facts have not been researched yet.';
document.getElementById('fact-source').innerHTML = FACTS[factIdx] ? sourceNote(FACTS[factIdx]) : '';
document.getElementById('fact-btn').disabled = FACTS.length < 2;
    factText.classList.remove('fading');
  }, 180);
});

/* ===== LIVE WEATHER ===== */
const WEATHER_URL = port.coordinates && port.timeZone ? `/.netlify/functions/weather?lat=${port.coordinates.lat}&lon=${port.coordinates.lon}&tz=${encodeURIComponent(port.timeZone)}` : null;
let weatherPromise = null;

function fetchWeather() {
  if (!WEATHER_URL) return Promise.reject(new Error('Port location not configured'));
  if (!weatherPromise) {
    weatherPromise = fetch(WEATHER_URL)
      .then(res => { if (!res.ok) throw new Error('fetch failed'); return res.json(); })
      .catch(err => { weatherPromise = null; throw err; });
  }
  return weatherPromise;
}

function weatherEmoji(iconCode) {
  if (!iconCode) return '🌡️';
  const code = iconCode.substring(0, 2);
  const isNight = iconCode.endsWith('n');
  const map = { '01': isNight ? '🌙' : '☀️', '02': '⛅', '03': '🌥️', '04': '☁️', '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '🌨️', '50': '🌫️' };
  return map[code] || '🌡️';
}

function formatForecastDay(dt) {
  const d = new Date(dt * 1000);
  return d.toLocaleDateString('en-CA', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: port.timeZone });
}

function weatherSkeleton() {
  return `<div class="skeleton" style="height:150px"></div>
    <div class="label">Forecast snapshots · local time</div>
    <div class="wx-days">${'<div class="skeleton" style="height:130px"></div>'.repeat(4)}</div>`;
}

function renderWeatherPage() {
  const container = document.getElementById('weather-dynamic');
  if (container.dataset.loaded === '1') return;
  if (!WEATHER_URL) { container.innerHTML = emptyState('🌤️', 'Weather location has not been confirmed yet.'); return; }
  container.innerHTML = weatherSkeleton();
  fetchWeather().then(data => {
    let html = '';
    if (data.current) {
      const c = data.current;
      const updatedTime = new Date(data.updated).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: port.timeZone });
      html += `<div class="wx-now">
        <div class="wx-now-top">
          <span class="wx-emoji">${weatherEmoji(c.weather[0].icon)}</span>
          <div>
            <div class="wx-temp">${Math.round(c.main.temp)}°C</div>
            <div class="wx-desc">${E(c.weather[0].description)}</div>
          </div>
        </div>
        <div class="wx-meta">
          <span>🤔 Feels ${Math.round(c.main.feels_like)}°</span>
          <span>💨 ${Math.round((c.wind.speed || 0) * 3.6)} km/h</span>
          <span>💧 ${c.main.humidity}%</span>
        </div>
        <div class="wx-updated">Updated ${updatedTime} local time</div>
      </div>`;
    }
    if (data.forecast && data.forecast.length) {
      html += '<div class="label">Forecast snapshots · local time</div><div class="wx-days">';
      data.forecast.forEach(item => {
        html += `<div class="wx-day">
          <div class="wx-day-name">${formatForecastDay(item.dt)}</div>
          <div class="wx-day-emoji">${weatherEmoji(item.weather[0].icon)}</div>
          <div class="wx-day-temp">${Math.round(item.main.temp)}°C</div>
          <div class="wx-day-desc">${E(item.weather[0].description)}</div>
          <div class="wx-day-meta"><span>💨 ${Math.round((item.wind.speed || 0) * 3.6)} km/h</span><span>🌧️ ${Math.round((item.pop || 0) * 100)}%</span></div>
        </div>`;
      });
      html += '</div>';
    }
    if (!html) throw new Error('empty');
    container.innerHTML = html;
    container.dataset.loaded = '1';
  }).catch(() => {
    container.innerHTML = `<div class="card empty"><span class="empty-emoji">🌫️</span>Live weather is unavailable. Check the forecast links below or try again when connected.<div class="actions" style="justify-content:center"><button class="btn btn-web" type="button" id="weather-retry">↻ Try again</button></div></div>`;
    document.getElementById('weather-retry').addEventListener('click', renderWeatherPage);
  });
}

fetchWeather().then(data => {
  if (!data.current) return;
  const chip = document.getElementById('hero-weather');
  chip.textContent = `${weatherEmoji(data.current.weather[0].icon)} ${Math.round(data.current.main.temp)}°C`;
  chip.hidden = false;
}).catch(() => {});

/* ===== ACTIVITIES, VENUES, HOTELS AND CONTACTS ===== */
const activities = D.activities;
const todoChips = D.todoChips;
const activeFilters = new Set();
const TAG_LABELS = { 'Food-Drink':'Food & Drink', 'Half-day':'Half day', 'Day-trip':'Day trip' };
function tagLabel(t) { return TAG_LABELS[t] || t; }
function renderTodoChips() {
  document.getElementById('todo-chips').innerHTML = ['', ...todoChips].map(t => `<button class="chip${(t ? activeFilters.has(t) : activeFilters.size === 0) ? ' active' : ''}" type="button" aria-pressed="${t ? activeFilters.has(t) : activeFilters.size === 0}" data-chip="${E(t)}">${E(t ? tagLabel(t) : 'All')}</button>`).join('');
}
document.getElementById('todo-chips').addEventListener('click', e => {
  const chip = e.target.closest('[data-chip]'); if (!chip) return;
  const tag = chip.dataset.chip;
  if (!tag) activeFilters.clear(); else if (activeFilters.has(tag)) activeFilters.delete(tag); else activeFilters.add(tag);
  renderTodoChips(); renderTodoList();
});
document.getElementById('time-budget').addEventListener('change',renderTodoList);
function renderTodoList() {
  const unknown=activities.filter(a=>BriefTools.totalMinutes(a)===null).length;
  document.getElementById('timing-note').textContent = `${unknown} activities lack source-checked timing and are excluded when a time limit is selected. Estimates include travel and a return buffer; they do not set your leave expiry.`;
  const filtered = activities.filter(a => (!activeFilters.size || a.tags.some(t => activeFilters.has(t))) && BriefTools.fitsTime(a,Number(document.getElementById('time-budget').value)));
  document.getElementById('todo-count').textContent = `${filtered.length} of ${activities.length}`;
  document.getElementById('todo-list').innerHTML = filtered.length ? filtered.map(a => itemCard(a)).join('') : emptyState('🔎',activities.length ? 'Nothing matches those filters.' : 'Activities have not been researched yet.');
}
const venueData = D.venueData;
function matches(item,q) { return [item.name,item.note,item.desc].filter(Boolean).join(' ').toLocaleLowerCase().includes(q.trim().toLocaleLowerCase()); }
function filterVenues(tabId,query = '') {
  const list = venueData[tabId].filter(v => matches(v,query));
  document.getElementById(tabId).querySelector('.venue-list').innerHTML = list.length ? list.map(v => itemCard(v)).join('') : emptyState('🔎',venueData[tabId].length ? 'No matches — try another word.' : 'No researched entries yet.');
}
document.querySelectorAll('[data-search-tab]').forEach(input => input.addEventListener('input', () => filterVenues(input.dataset.searchTab,input.value)));
const tabButtons = [...document.querySelectorAll('#food .seg')];
function selectVenueTab(btn) {
  tabButtons.forEach(t => { t.classList.toggle('active',t === btn); t.setAttribute('aria-selected',String(t === btn)); t.tabIndex = t === btn ? 0 : -1; });
  document.querySelectorAll('#food .tab-panel').forEach(p => p.classList.toggle('active',p.id === btn.dataset.tab));
}
tabButtons.forEach((btn,i) => {
  btn.addEventListener('click',() => selectVenueTab(btn));
  btn.addEventListener('keydown',e => {
    const indexes = {ArrowRight:(i+1)%4,ArrowLeft:(i+3)%4,Home:0,End:3};
    if (!(e.key in indexes)) return;
    e.preventDefault(); const next = tabButtons[indexes[e.key]]; selectVenueTab(next); next.focus();
  });
});
function filterHotels(query = '') {
  const list = D.hotelData.filter(h => matches(h,query));
  document.getElementById('hotel-list').innerHTML = list.length ? list.map(h => itemCard(h)).join('') : emptyState('🔎',D.hotelData.length ? 'No matches — try another word.' : 'Hotels have not been researched yet.');
}
document.getElementById('hotel-search').addEventListener('input',e => filterHotels(e.target.value));
function renderContactCards(id,contacts) { document.getElementById(id).innerHTML = contacts.length ? contacts.map(c => itemCard(c)).join('') : emptyState('📞','Contacts have not been confirmed yet.'); }
renderPort();
renderTodoChips(); renderTodoList();
Object.keys(venueData).forEach(id => filterVenues(id));
selectVenueTab(tabButtons[0]); filterHotels();
renderContactCards('ship-contact-list',D.shipContacts);
renderContactCards('local-contact-list',D.localContacts);

/* ===== INSTALL (A2HS) ===== */
const A2HS_DISMISSED_KEY = 'a2hs_dismissed_v1';
let deferredInstallPrompt = null;
let a2hsReady = false;

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function shouldShowA2HSBanner() {
  if (isStandaloneMode()) return false;
  try { return !localStorage.getItem(A2HS_DISMISSED_KEY); } catch { return true; }
}
function updateA2HSVisibility() {
  const banner = document.getElementById('a2hs-banner');
  banner.hidden = !(a2hsReady && currentPage === 'landing' && shouldShowA2HSBanner());
}
function dismissA2HSBanner() {
  try { localStorage.setItem(A2HS_DISMISSED_KEY, '1'); } catch {}
  a2hsReady = false;
  updateA2HSVisibility();
}
function setupA2HSBanner() {
  const sub = document.getElementById('a2hs-sub');
  const actionBtn = document.getElementById('a2hs-action');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent || '');
  if (deferredInstallPrompt) {
    sub.textContent = 'Install this brief for one‑tap access.';
    actionBtn.hidden = false;
  } else if (isIOS) {
    sub.textContent = 'Tap Share, then “Add to Home Screen”.';
    actionBtn.hidden = true;
  } else {
    a2hsReady = false;
    updateA2HSVisibility();
    return;
  }
  a2hsReady = true;
  updateA2HSVisibility();
}
document.getElementById('a2hs-dismiss').addEventListener('click', dismissA2HSBanner);
document.getElementById('a2hs-action').addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  try { await deferredInstallPrompt.userChoice; } catch {}
  deferredInstallPrompt = null;
  dismissA2HSBanner();
});
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  setupA2HSBanner();
});
window.addEventListener('appinstalled', dismissA2HSBanner);
setTimeout(setupA2HSBanner, 1500);

/* ===== OFFLINE SUPPORT ===== */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

/* ===== INITIAL ROUTE ===== */
const initialPage = PAGES[location.hash.slice(1)] ? location.hash.slice(1) : 'landing';
nav(initialPage, false);
history.replaceState({ page: initialPage }, '');
