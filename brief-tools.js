/* Pure helpers shared by the browser and regression tests. */
(function(root) {
  const validLocation = p => p && Number.isFinite(p.lat) && Math.abs(p.lat)<=90 && Number.isFinite(p.lon) && Math.abs(p.lon)<=180;
  function totalMinutes(a) {
    const t=a.timing;
    return t?.status==='verified' && t.sourceIds?.length && t.checkedOn && t.origin?.trim() && [t.visitMinutes,t.roundTripMinutes,t.bufferMinutes].every(n=>Number.isFinite(n)&&n>=0) ? t.visitMinutes+t.roundTripMinutes+t.bufferMinutes : null;
  }
  function fitsTime(a,limit) { const total=totalMinutes(a);return !limit || (total!==null && total<=limit); }
  function places(d) {
    const groups=[['Activities',d.activities],['Hotels',d.hotelData],['Local help',d.localContacts],...Object.entries(d.venueData).map(([k,v])=>[{'tab-food':'Food','tab-coffee':'Coffee','tab-bars':'Bars','tab-shop':'Shopping'}[k],v])];
    return groups.flatMap(([category,list])=>list.filter(p=>p.map || validLocation(p.coordinates)).map(p=>({...p,category})));
  }
  const api={validLocation,totalMinutes,fitsTime,places};
  if(typeof module==='object' && module.exports) module.exports=api; else root.BriefTools=api;
})(globalThis);
