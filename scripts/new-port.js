const fs=require('node:fs');
const path=require('node:path');
const {ROOT}=require('./validate');
const name=process.argv[2]?.trim();
const slug=process.argv[3] || name?.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
if(!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) { console.error('Usage: npm run new-port -- "Port name, country" [ascii-slug]');process.exit(1); }
const d=JSON.parse(fs.readFileSync(path.join(ROOT,'templates/port.template.json'),'utf8'));
d.slug=slug;d.port.name=name;
try { fs.writeFileSync(path.join(ROOT,'ports',`${slug}.json`),JSON.stringify(d,null,2)+'\n',{flag:'wx'});console.log(`Created ports/${slug}.json. Follow AGENTS.md to research it; the active port is unchanged.`); }
catch(e) { console.error(e.message);process.exitCode=1; }
