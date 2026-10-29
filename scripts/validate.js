const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const PAGE_IDS = ['routine','weather','map','food','hotels','safety','history'];
const TABS = ['tab-food','tab-coffee','tab-bars','tab-shop'];
const STATES = ['verified','unverified','unknown','not-applicable','user-required'];
function validate(d, { strict = false } = {}) {
  const errors = [];
  const check = (ok, msg) => { if (!ok) errors.push(msg); };
  const object = x => x && typeof x === 'object' && !Array.isArray(x);
  const str = x => typeof x === 'string';
  const filled = x => str(x) && x.trim().length > 0;
  const date = x => str(x) && /^\d{4}-\d{2}-\d{2}$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString().slice(0,10) === x;
  const url = x => { try { return ['https:','http:'].includes(new URL(x).protocol); } catch { return false; } };
  const array = (x, label) => { check(Array.isArray(x), `${label} must be an array`); return Array.isArray(x) ? x : []; };
  const text = (x,label,required=false) => check(required ? filled(x) : str(x), `${label} must be ${required?'nonempty ':''}text`);
  if (!object(d)) return ['Port data must be an object'];
  check(d.schemaVersion === 1, 'schemaVersion must be 1');
  check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug || ''), 'slug must use lowercase words separated by hyphens');
  const p = d.port || {};
  ['name','country','region','welcome','tagline'].forEach(k => text(p[k],`port.${k}`,k==='name' || (strict && k==='country')));
  if (p.timeZone !== null) { try { check(filled(p.timeZone),'port.timeZone must be an IANA time zone or null'); new Intl.DateTimeFormat('en',{timeZone:p.timeZone}); } catch { errors.push('port.timeZone is invalid'); } }
  if (p.coordinates !== null) check(object(p.coordinates) && Number.isFinite(p.coordinates.lat) && Math.abs(p.coordinates.lat)<=90 && Number.isFinite(p.coordinates.lon) && Math.abs(p.coordinates.lon)<=180,'port.coordinates must contain numeric lat/lon in range, or be null');
  const meta = d.meta || {};
  check(['draft','researched','legacy-unverified'].includes(meta.status),'meta.status is invalid');
  check(meta.lastResearched === null || date(meta.lastResearched),'meta.lastResearched must be YYYY-MM-DD or null');
  text(meta.notes,'meta.notes',true);
  if (strict) {
    check(meta.status === 'researched','Strict: meta.status must be researched');
    check(date(meta.lastResearched),'Strict: research date is required');
    check(filled(p.timeZone) && object(p.coordinates),'Strict: port time zone and coordinates are required');
    check(p.status === 'verified','Strict: port identity and location must be source-checked');
  }
  const sources = array(d.sources,'sources');
  const sourceIds = new Set();
  sources.forEach((s,i) => {
    if (!object(s)) { errors.push(`sources[${i}] must be an object`); return; }
    check(filled(s.id) && !sourceIds.has(s.id),`sources[${i}] id must be nonempty and unique`); sourceIds.add(s.id);
    ['title','publisher'].forEach(k => text(s[k],`sources[${i}].${k}`,true));
    check(url(s.url),`sources[${i}].url must be HTTP(S)`);
    check(date(s.accessedOn),`sources[${i}].accessedOn must be YYYY-MM-DD`);
  });
  const evidence = (x,label) => {
    check(STATES.includes(x.status),`${label}.status is invalid`);
    const refs = array(x.sourceIds,`${label}.sourceIds`);
    refs.forEach(id => check(sourceIds.has(id),`${label} refers to missing source ${id}`));
    check(x.checkedOn === null || date(x.checkedOn),`${label}.checkedOn must be YYYY-MM-DD or null`);
    if (x.status === 'verified') { check(refs.length>0,`${label}: verified items need sources`); check(date(x.checkedOn),`${label}: verified items need a check date`); }
    if (strict) check(x.status !== 'unverified',`Strict: ${label} remains unverified`);
  };
  evidence(p,'port');
  check(object(d.pages),'pages must be an object');
  check(Object.keys(d.pages || {}).every(k => PAGE_IDS.includes(k)), 'pages contains an unsupported page');
  PAGE_IDS.forEach(id => {
    const page = d.pages?.[id];
    if (!object(page)) { errors.push(`Missing page: ${id}`); return; }
    text(page.subtitle,`pages.${id}.subtitle`);
    const blocks = array(page.blocks,`pages.${id}.blocks`);
    check(blocks.length>0,`pages.${id} needs content or an explicit unknown/not-applicable explanation`);
    blocks.forEach((b,i) => {
      const label = `pages.${id}.blocks[${i}]`;
      if (!object(b)) { errors.push(`${label} must be an object`); return; }
      text(b.title,`${label}.title`,true);
      for (const k of ['paragraphs','items']) array(b[k],`${label}.${k}`).forEach(v => text(v,`${label}.${k}`,true));
      const links=array(b.links,`${label}.links`);
      links.forEach(l => { check(object(l) && filled(l.label) && url(l.url),`${label} has an invalid link`); });
      check((b.paragraphs?.length || b.items?.length || links.length)>0,`${label} is empty`);
      evidence(b,label);
    });
  });
  const entries = (items,label,kind) => array(items,label).forEach((x,i) => {
    const key=`${label}[${i}]`;
    if (!object(x)) { errors.push(`${key} must be an object`); return; }
    text(x.name,`${key}.name`,true);
    const description = kind === 'activity' ? 'desc' : kind === 'contact' ? 'sub' : 'note';
    text(x[description],`${key}.${description}`,true);
    ['emoji','map','phoneLabel','mapLabel','price'].forEach(k => { if(k in x) text(x[k],`${key}.${k}`); });
    if ('web' in x) check(x.web === '' || url(x.web),`${key}.web must be empty or HTTP(S)`);
    if ('phone' in x) check(str(x.phone) && (x.phone==='' || /^\+?[0-9][0-9 ()-]{1,24}$/.test(x.phone)),`${key}.phone is invalid`);
    if(kind==='activity') array(x.tags,`${key}.tags`).forEach(t => check(d.todoChips?.includes(t),`${key} uses an unknown activity tag`));
    evidence(x,key);
  });
  array(d.todoChips,'todoChips').forEach(t => text(t,'todoChips entry',true));
  entries(d.activities,'activities','activity'); entries(d.hotelData,'hotelData','hotel');
  check(object(d.venueData),'venueData must be an object');
  check(Object.keys(d.venueData || {}).every(k => TABS.includes(k)),'venueData contains an unsupported tab');
  TABS.forEach(k => entries(d.venueData?.[k],`venueData.${k}`,'venue'));
  entries(d.shipContacts,'shipContacts','contact'); entries(d.localContacts,'localContacts','contact');
  check(Array.isArray(d.localContacts) && d.localContacts.length > 0,'localContacts needs emergency services or an explicit unknown entry');
  array(d.quickContacts,'quickContacts').forEach(i => check(Number.isInteger(i) && i>=0 && i<(d.localContacts?.length || 0),'quickContacts contains an invalid local contact index'));
  check(d.quickContacts?.length>0,'quickContacts needs at least one emergency contact or unknown entry');
  array(d.facts,'facts').forEach((f,i) => { if (!object(f)) { errors.push(`facts[${i}] must be an object`);return; } text(f.text,`facts[${i}].text`,true);evidence(f,`facts[${i}]`); });
  return errors;
}
if (require.main === module) {
  const args=process.argv.slice(2), strict=args.includes('--strict');
  const files=args.filter(a => !a.startsWith('--'));
  const targets=files.length ? files : fs.readdirSync(path.join(ROOT,'ports')).filter(f=>f.endsWith('.json')).map(f=>path.join(ROOT,'ports',f));
  let failed=false;
  for(const file of targets) {
    try { const data=JSON.parse(fs.readFileSync(file,'utf8')); const errors=validate(data,{strict:strict || data.meta?.status==='researched'}); if(errors.length) { failed=true;console.error(`${file}:\n- ${errors.join('\n- ')}`); } else console.log(`Valid: ${path.basename(file)}${strict?' (research checks passed)':''}`); }
    catch(e) { failed=true;console.error(`${file}: ${e.message}`); }
  }
  process.exitCode=failed?1:0;
}
module.exports={validate,ROOT};
