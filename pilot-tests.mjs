import assert from 'node:assert/strict';
import worker from './worker/index.js';
import {pilotAdmission,validateMooGold} from './pilot-policy.js';
import {createHmac} from 'node:crypto';
const MG_PILOT_ROSTER=JSON.stringify({'12345678':{country:'MG',status:'approved',region:'sg'}});
const req=(path,method='GET')=>new Request('https://example.com'+path,{method});
assert.deepEqual(pilotAdmission({},'12345678',''),{region:'auto',admission:'OPEN_LOOKUP'});
assert.equal(pilotAdmission({},'12345678','sg').region,'sg');
assert.equal(pilotAdmission({MG_PILOT_ROSTER:'null'},'12345678','sg').status,503);
assert.equal(pilotAdmission({MG_PILOT_ROSTER},'12345678','me').status,400);
assert.equal(pilotAdmission({MG_PILOT_ROSTER},'12345678','').region,'sg');
for(const route of ['/api/profile?uid=12345678&region=sg','/api/v1/player/12345678','/api/v1/topup-preview/12345678?diamonds=100'])assert.equal((await worker.fetch(req(route),{MG_PILOT_ROSTER:'{}'})).status,403);
assert.equal((await worker.fetch(req('/api/v1/player/12345678','POST'))).status,405);
const env={MG_PILOT_ROSTER,IDENTITY_PROVIDER:'moogold',MOOGOLD_PARTNER_ID:'test-partner',MOOGOLD_SECRET:'test-only',MOOGOLD_FF_PRODUCT_ID:'test-product'};
let calls=[];const fake=async(url,opts)=>{calls.push(url);assert.equal(new URL(url).pathname,'/wp-json/v1/api/product/validate');assert.equal(opts.headers.auth,createHmac('sha256',env.MOOGOLD_SECRET).update(opts.body+opts.headers.timestamp+'product/validate').digest('hex'));assert.equal(JSON.parse(opts.body).data['User ID'],'12345678');return Response.json({status:'true',username:'Fixture Bob'})};
assert.equal((await validateMooGold('12345678',env,fake)).nickname,'Fixture Bob');
await assert.rejects(()=>validateMooGold('12345678',{}),/PARTNER_NOT_CONFIGURED/);
await assert.rejects(()=>validateMooGold('12345678',env,async()=>Response.json({status:'false'})),/PARTNER_NOT_VALIDATED/);
const saved=globalThis.fetch;try{globalThis.fetch=fake;const p=await(await worker.fetch(req('/api/v1/player/12345678'),env)).json();assert.equal(p.nickname,'Fixture Bob');assert.equal(p.level,null);assert.equal(p.admission,'MG_PILOT_APPROVED');const preview=await(await worker.fetch(req('/api/v1/topup-preview/12345678?diamonds=100'),env)).json();assert.equal(preview.simulation,true);assert.equal(preview.paymentEnabled,false);assert.equal(preview.price,null);assert.equal(preview.nickname,'Fixture Bob');assert.ok(calls.every(url=>url.endsWith('/product/validate')))}finally{globalThis.fetch=saved}
try { globalThis.fetch=fake; const p=await(await worker.fetch(req('/api/v1/player/12345678'),{...env,MG_PILOT_ROSTER:undefined})).json(); assert.equal(p.uid,'12345678'); assert.equal(p.nickname,'Fixture Bob'); assert.equal(p.admission,'OPEN_LOOKUP'); } finally {globalThis.fetch=saved}
console.log('Pilot tests passed: open by default, explicit roster enforced, both lookup routes protected, region binding, read-only API, partner HMAC, no invented stats, simulation without orders.');
