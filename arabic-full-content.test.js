import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const lang=fs.readFileSync(new URL('../js/features/language.js',import.meta.url),'utf8');
const missions=fs.readFileSync(new URL('../js/data/missions.js',import.meta.url),'utf8');
const planets=fs.readFileSync(new URL('../js/data/planets.js',import.meta.url),'utf8');
test('all 15 mission titles and subtitles have reviewed Arabic entries',()=>{
 const pairs=[...missions.matchAll(/title:"([^"]+)"[\s\S]{0,100}?subtitle:"([^"]+)"/g)];
 assert.equal(pairs.length,15);
 for(const pair of pairs) for(const source of pair.slice(1)) assert.ok(lang.includes(JSON.stringify(source))||lang.includes("'"+source.replaceAll("'","\\'")+"'"),`Missing Arabic dictionary entry: ${source}`);
});
test('mission activity titles and lesson headings are included',()=>{
 const activities=[...missions.matchAll(/activity:\s*\{[\s\S]{0,100}?title:"([^"]+)"/g)].map(x=>x[1]);
 const headings=[...missions.matchAll(/\bh:"([^"]+)"/g)].map(x=>x[1]);
 for(const source of [...activities,...headings]) assert.ok(lang.includes(source),`Missing dictionary entry: ${source}`);
});
test('planet names and common science labels are included',()=>{
 for(const name of ['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune','Diameter','Distance from Sun','Temperature']) assert.ok(lang.includes(name));
 assert.ok(planets.includes('const PLANETS'));
});
