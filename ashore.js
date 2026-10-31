/* Ashore essentials, a shared places map, and a checked offline pack. */
const ESSENTIAL_LABELS={returnPoint:'Return to ship',currency:'Money',language:'Language',transport:'Getting back',cautions:'Key cautions'};
function essentialsHTML() {
  return Object.entries(ESSENTIAL_LABELS).map(([key,label])=>{
    const x=D.ashore?.[key] || {text:'Not confirmed',status:'unknown'};
    return `<article class="card essential"><h2>${label}</h2><p>${E(x.text)}</p>${sourceNote(x)}</article>`;
  }).join('');
}
document.getElementById('ashore-essentials').innerHTML=essentialsHTML();
function renderPrintSheet() {
  const quick=D.quickContacts.map(i=>D.localContacts[i]).filter(Boolean);
  document.getElementById('print-sheet').innerHTML=`<h1>${E(port.name)} · Ashore essentials</h1><p>${E(port.country)} · Time zone: ${E(port.timeZone || 'Not confirmed')}</p><p>${E(D.meta.status)} · Research date: ${E(D.meta.lastResearched || 'Not recorded')}</p><div class="print-calls">${quick.map(c=>`<p><strong>${E(c.name)}: ${E(c.phoneLabel || c.phone || 'Not confirmed')}</strong> · ${E(c.status)}</p>`).join('')}</div>${essentialsHTML()}<p>Ship contacts: ${D.shipContacts.map(c=>`${E(c.name)}: ${E(c.phone || 'Confirm with ship')}`).join(' · ')}</p><p>Follow current ship instructions and confirm changing details before going ashore.</p>`;
}
renderPrintSheet();
document.getElementById('print-pack').addEventListener('click',()=>{renderPrintSheet();window.print();});

const allPlaces=BriefTools.places(D);
const category=document.getElementById('place-category');
[...new Set(allPlaces.map(p=>p.category))].sort().forEach(name=>category.add(new Option(name,name)));
let placesMap=null, markerLayer=null;
function selectedPlaces() {
  const q=document.getElementById('place-search').value.trim().toLocaleLowerCase();
  return allPlaces.filter(p=>(!category.value || p.category===category.value) && [p.name,p.note,p.desc,p.sub].filter(Boolean).join(' ').toLocaleLowerCase().includes(q));
}
window.renderPlacesMap=function() {
  const list=selectedPlaces(),located=list.filter(p=>BriefTools.validLocation(p.coordinates));
  document.getElementById('place-list').innerHTML=list.length ? list.map(p=>`<div><p class="source-note">${E(p.category)}${BriefTools.validLocation(p.coordinates)?' · Pin available':' · Location not confirmed; use map search'}</p>${itemCard(p)}</div>`).join('') : emptyState('📍','No places match this selection.');
  document.getElementById('map-status').textContent=`${list.length} places · ${located.length} have recorded coordinates. Pins show recorded locations; check each source status.`;
  const box=document.getElementById('places-map');
  if(!window.L || (!located.length && !BriefTools.validLocation(port.coordinates))) {box.hidden=true;return;}
  box.hidden=false;
  if(!placesMap) {
    placesMap=L.map(box,{scrollWheelZoom:false});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(placesMap).on('tileerror',()=>{document.getElementById('map-connection').textContent='Street map could not load. The recorded pins and place list are still available.';});
    markerLayer=L.layerGroup().addTo(placesMap);
  }
  placesMap.invalidateSize();markerLayer.clearLayers();
  located.forEach(p=>{
    const marker=L.circleMarker([p.coordinates.lat,p.coordinates.lon],{radius:8,color:'#073b4c',fillColor:'#0a7ea4',fillOpacity:.9}).addTo(markerLayer);
    marker.bindPopup(`<strong>${E(p.name)}</strong><p>${E(p.category)}</p>${actions(p)}${sourceNote(p)}`);
  });
  if(located.length) placesMap.fitBounds(located.map(p=>[p.coordinates.lat,p.coordinates.lon]),{padding:[30,30],maxZoom:15});
  else placesMap.setView([port.coordinates.lat,port.coordinates.lon],12);
  document.getElementById('map-connection').textContent=navigator.onLine ? 'Street map needs internet. Places without coordinates remain in the list below.' : 'Offline: street map may be unavailable. Recorded pins and the place list remain available.';
};
category.addEventListener('change',window.renderPlacesMap);
document.getElementById('place-search').addEventListener('input',window.renderPlacesMap);
if(currentPage==='map') window.renderPlacesMap();

function askWorker(worker,type='PACK_STATUS') {
  return new Promise((resolve,reject)=>{
    const channel=new MessageChannel();
    const timer=setTimeout(()=>{channel.port1.close();reject(new Error('Offline check timed out'));},15000);
    channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data);};
    worker.postMessage({type},[channel.port2]);
  });
}
async function checkPack(save=false) {
  const status=document.getElementById('pack-status'),button=document.getElementById('save-pack');
  if(!('serviceWorker' in navigator)) {status.textContent='Offline saving is unavailable in this browser. Print essentials for a paper copy.';button.disabled=true;return;}
  button.disabled=true;
  try {
    let reg=await navigator.serviceWorker.getRegistration(new URL('./',location.href).href);
    if(save) {status.textContent='Saving and checking this brief…';reg=await navigator.serviceWorker.register('sw.js');await reg.update();}
    if(!reg?.active) {status.textContent='Not yet saved. Connect to the internet and choose Save for offline.';return;}
    const result=await askWorker(reg.active);
    if(result.revision!==window.PORT_REVISION) {status.textContent='An updated brief is available. Reload, then save and check again.';return;}
    const saved=save ? await askWorker(reg.active,'SAVE_PACK') : result;
    status.textContent=saved.ready ? `Ready offline · ${port.name} · saved brief and place list checked on this device.` : 'Offline pack is incomplete. Connect and choose Save for offline to repair it.';
  } catch {status.textContent='Could not confirm offline readiness. Connect and try Save for offline again.';}
  finally {button.disabled=false;}
}
document.getElementById('save-pack').addEventListener('click',()=>checkPack(true));
window.addEventListener('load',()=>checkPack());
if('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('controllerchange',()=>checkPack());
window.addEventListener('online',()=>{checkPack();if(currentPage==='map') window.renderPlacesMap();});
window.addEventListener('offline',()=>{checkPack();if(currentPage==='map') window.renderPlacesMap();});
