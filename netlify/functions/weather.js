function validCoordinates(lat, lon) {
  return Number.isFinite(lat) && Math.abs(lat) <= 90 && Number.isFinite(lon) && Math.abs(lon) <= 180;
}
function pickDailyForecast(list, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-CA', {timeZone, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'});
  const days=new Map();
  for(const item of list) {
    if(!Number.isFinite(item.dt)) continue;
    const parts=Object.fromEntries(fmt.formatToParts(new Date(item.dt*1000)).map(p=>[p.type,p.value]));
    const date=`${parts.year}-${parts.month}-${parts.day}`, distance=Math.abs(Number(parts.hour)-12);
    const existing=days.get(date);
    if(!existing || distance<existing.distance) days.set(date,{item,distance});
  }
  return [...days].sort(([a],[b])=>a.localeCompare(b)).slice(0,4).map(([,v])=>v.item);
}
exports.handler = async event => {
  const reply=(statusCode,body)=>({statusCode,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(event.httpMethod && event.httpMethod !== 'GET') return reply(405,{error:'Use GET.'});
  const q=event.queryStringParameters || {};
  const lat=typeof q.lat==='string' && q.lat.trim() ? Number(q.lat) : NaN;
  const lon=typeof q.lon==='string' && q.lon.trim() ? Number(q.lon) : NaN;
  if(!validCoordinates(lat,lon)) return reply(400,{error:'Valid port latitude and longitude are required.'});
  try { if(!q.tz) throw new Error(); new Intl.DateTimeFormat('en',{timeZone:q.tz}); }
  catch { return reply(400,{error:'A valid port time zone is required.'}); }
  const apiKey=process.env.OPENWEATHER_API_KEY;
  if(!apiKey) return reply(503,{error:'Live weather is not configured.'});
  try {
    const query=new URLSearchParams({lat:String(lat),lon:String(lon),units:'metric',appid:apiKey});
    const [currentRes,forecastRes]=await Promise.all(['weather','forecast'].map(endpoint=>fetch(`https://api.openweathermap.org/data/2.5/${endpoint}?${query}`,{signal:AbortSignal.timeout(8000)})));
    if(!currentRes.ok || !forecastRes.ok) return reply(502,{error:'Weather provider is temporarily unavailable.'});
    const [current,forecastData]=await Promise.all([currentRes.json(),forecastRes.json()]);
    return reply(200,{current,forecast:pickDailyForecast(forecastData.list || [],q.tz),updated:new Date().toISOString()});
  } catch { return reply(502,{error:'Weather service is temporarily unavailable.'}); }
};
exports.pickDailyForecast=pickDailyForecast;
