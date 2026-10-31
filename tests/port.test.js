const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {validate,ROOT}=require('../scripts/validate');
const {generate}=require('../scripts/build');
const {handler,pickDailyForecast}=require('../netlify/functions/weather');
const read=f=>JSON.parse(fs.readFileSync(path.join(ROOT,f),'utf8'));
const blank=()=>read('templates/port.template.json');

test('blank template and all stored ports satisfy the data contract',()=>{
  assert.deepEqual(validate(blank()),[]);
  for(const f of fs.readdirSync(path.join(ROOT,'ports'))) if(f.endsWith('.json')) assert.deepEqual(validate(read(`ports/${f}`)),[],f);
});
test('new port template contains no previous destination defaults',()=>{
  const d=blank();assert.equal(d.port.coordinates,null);assert.equal(d.port.timeZone,null);
  assert.doesNotMatch(JSON.stringify(d),/canc[uú]n|mexico|911|078|21\.1619|86\.8515/i);
  assert.ok(validate(d,{strict:true}).length>0);
});
test('verified claims require real references and a valid check date',()=>{
  const d=blank(),b=d.pages.safety.blocks[0];b.status='verified';
  assert.ok(validate(d).some(e=>e.includes('need sources')));
  b.sourceIds=['missing'];b.checkedOn='2026-02-30';
  assert.ok(validate(d).some(e=>e.includes('missing source')));
  assert.ok(validate(d).some(e=>e.includes('check date')));
  b.checkedOn='2026-10-29';b.sourceIds=['official'];
  d.sources=[{id:'official',title:'Example only',publisher:'Test',url:'https://example.org',accessedOn:'2026-10-29'}];
  assert.deepEqual(validate(d),[]);
});
test('reject invalid locations, action URLs, missing sections and contact references',()=>{
  const d=blank();d.port.timeZone='Bad/Zone';d.port.coordinates={lat:91,lon:0};
  d.localContacts[0].web='javascript:alert(1)';d.quickContacts=[9];delete d.pages.history;
  const e=validate(d).join('\n');
  for(const pattern of [/timeZone/,/coordinates/,/HTTP\(S\)/,/contact index/,/Missing page/]) assert.match(e,pattern);
});
test('all canonical port content survives generated JavaScript unchanged',()=>{
  const expected=read('ports/cancun-mexico.json');
  const output=generate('cancun-mexico'),sandbox={window:{}};
  vm.runInNewContext(output['data.js'],sandbox);
  assert.equal(JSON.stringify(sandbox.window.PORT_DATA),JSON.stringify(expected));
  assert.equal(JSON.parse(output['manifest.webmanifest']).start_url,'./');
  assert.doesNotMatch(output['sw.js'],/__REVISION__/);
  assert.deepEqual(generate('cancun-mexico'),output);
});
test('application code has no destination facts or fixed coordinates',()=>{
  for(const f of ['index.html','app.js','styles.css','netlify/functions/weather.js','templates/sw.template.js']) {
    assert.doesNotMatch(fs.readFileSync(path.join(ROOT,f),'utf8'),/canc[uú]n|mexico|21\.1619|-86\.8515|America\/Cancun/i,f);
  }
});
test('weather rejects absent, partial, out-of-range coordinates and bad time zones',async()=>{
  for(const q of [{},{lat:'21x',lon:'3',tz:'UTC'},{lat:'91',lon:'0',tz:'UTC'},{lat:'0',lon:'0',tz:'bad'},{lat:'',lon:'0',tz:'UTC'}]) {
    assert.equal((await handler({queryStringParameters:q})).statusCode,400);
  }
});
test('weather selects a near-noon sample on each port-local date across UTC midnight',()=>{
  const items=['2026-10-29T00:00:00Z','2026-10-29T03:00:00Z','2026-10-29T12:00:00Z','2026-10-29T21:00:00Z','2026-10-30T00:00:00Z'].map(t=>({dt:Date.parse(t)/1000}));
  const result=pickDailyForecast(items,'Pacific/Auckland');
  assert.deepEqual(result.map(x=>x.dt),[items[0].dt,items[4].dt]);
});
test('weather sends the requested port and does not leak upstream diagnostics',async()=>{
  const oldKey=process.env.OPENWEATHER_API_KEY,oldFetch=global.fetch;
  const requests=[];process.env.OPENWEATHER_API_KEY='test-key';
  try {
    global.fetch=async url=>{requests.push(String(url));return {ok:false,status:401,json:async()=>({secret:'test-key'})};};
    const result=await handler({queryStringParameters:{lat:'0',lon:'0',tz:'UTC'}});
    assert.equal(result.statusCode,502);assert.doesNotMatch(result.body,/test-key/);
    assert.equal(requests.length,2);requests.forEach(url=>{assert.equal(new URL(url).searchParams.get('lat'),'0');assert.equal(new URL(url).searchParams.get('lon'),'0');});
  } finally {global.fetch=oldFetch;if(oldKey===undefined) delete process.env.OPENWEATHER_API_KEY;else process.env.OPENWEATHER_API_KEY=oldKey;}
});
test('building a different port replaces identity, contacts and offline revision',()=>{
  const d=blank();d.slug=`test-port-${process.pid}`;d.port.name='Example Harbour';d.port.country='Example Country';d.port.timeZone='UTC';d.port.coordinates={lat:0,lon:0};
  const file=path.join(ROOT,'ports',`${d.slug}.json`);
  fs.writeFileSync(file,JSON.stringify(d),{flag:'wx'});
  try {
    const output=generate(d.slug);
    assert.doesNotMatch(output['data.js'],/canc[uú]n|mexico|911|078|21\.1619|86\.8515/i);
    assert.equal(JSON.parse(output['manifest.webmanifest']).name,'Example Harbour Port Brief');
    assert.notEqual(output['sw.js'],generate('cancun-mexico')['sw.js']);
  } finally { fs.unlinkSync(file); }
});
test('activity budgets include visiting, return travel and a buffer; unknowns never qualify',()=>{
  const {totalMinutes,fitsTime}=require('../brief-tools');
  const a={timing:{status:'verified',sourceIds:['transit'],checkedOn:'2026-10-31',origin:'Confirmed meeting point',visitMinutes:60,roundTripMinutes:40,bufferMinutes:20}};
  assert.equal(totalMinutes(a),120);assert.equal(fitsTime(a,120),true);assert.equal(fitsTime(a,119),false);
  assert.equal(fitsTime({},120),false);assert.equal(fitsTime({},0),true);
  a.timing.status='unverified';assert.equal(fitsTime(a,240),false);
});
test('map categories retain unlocated places without inventing coordinates',()=>{
  const {places,validLocation}=require('../brief-tools');
  const d=blank();d.activities=[{name:'Test',map:'Test harbour'}];d.hotelData=[{name:'Hotel',coordinates:{lat:0,lon:0}}];
  const p=places(d);assert.equal(p.length,2);assert.equal(p[0].coordinates,undefined);assert.equal(validLocation(p[1].coordinates),true);
  assert.equal(Boolean(validLocation({lat:91,lon:0})),false);
});
test('ashore essentials and timing must satisfy evidence and location rules',()=>{
  const d=blank();delete d.ashore.currency;
  d.activities=[{name:'Trip',desc:'Test',tags:[],coordinates:{lat:999,lon:0},status:'unknown',sourceIds:[],checkedOn:null,timing:{visitMinutes:30,roundTripMinutes:-1,bufferMinutes:5,origin:'',basis:'',status:'verified',sourceIds:[],checkedOn:null}}];
  const e=validate(d).join('\n');for(const p of [/ashore.currency/,/coordinates/,/roundTripMinutes/,/origin/,/need sources/]) assert.match(e,p);
});
