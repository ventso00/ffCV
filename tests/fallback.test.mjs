import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
let serial=0;
const req=uid=>new Request('https://example.test/api/v1/player/'+uid,{headers:{'CF-Connecting-IP':'fallback-'+(++serial)}});
const lookup=async(env={},uid='8678687120')=>worker.fetch(req(uid),env);
let p=await(await lookup()).json();
assert.equal(p.nickname,'JosiaBira');assert.equal(p.uid,'8678687120');assert.equal(p.dataMode,'local_snapshot');assert.equal(p.live,false);assert.equal(p.status,'partial');
for(const k of ['level','rankPoints','csPoints','likes','characterId','characterImage','region'])assert.equal(p[k],null);
assert.equal(p.fetchedAt,'2026-10-26T05:21:26.513Z');
assert.equal((await lookup({PROFILE_TEST_FALLBACK:'false'})).status,503);
assert.equal((await lookup({PROFILE_IMPORT_ENABLED:'false'})).status,503);
assert.equal((await lookup({},'23146856')).status,503);
const other=await lookup({},'55555555'); assert.equal(other.status,503); assert.equal((await other.json()).code,'SOURCE_NOT_CONFIGURED');
assert.equal((await lookup({MG_PILOT_ROSTER:'{}'})).status,403);
const saved=globalThis.fetch;
try {
 for(const status of [401,403,429,500]){
  globalThis.fetch=async()=>new Response('',{status});
  p=await(await lookup({FF_COMMUNITY_API_KEY:'fixture'})).json();assert.equal(p.dataMode,'local_snapshot');
 }
 globalThis.fetch=async()=>{throw new Error('offline')};
 assert.equal((await(await lookup({FF_COMMUNITY_API_KEY:'fixture'})).json()).dataMode,'local_snapshot');
 globalThis.fetch=async()=>new Response('',{status:404});
 assert.equal((await lookup({FF_COMMUNITY_API_KEY:'fixture'})).status,404);
 const env={IDENTITY_PROVIDER:'protobuf',FF_PROTOBUF_BASE_URL:'https://wrapper.example.test',FF_PROTOBUF_TOKEN:'test-only-secret'};
 globalThis.fetch=async(url,options)=>{
  assert.equal(new URL(url).pathname,'/get_player_personal_show');
  assert.equal(new URL(url).searchParams.get('need_gallery_info'),'true');
  assert.equal(options.headers.Authorization,'Bearer test-only-secret');
  assert.equal(options.redirect,'error');
  assert.ok(!String(url).includes('test-only-secret'));
  return Response.json({basicInfo:{accountId:'8678687120',nickname:'Live fixture',region:'ME',level:42}});
 };
 p=await(await lookup(env)).json();assert.equal(p.nickname,'Live fixture');assert.equal(p.dataMode,'live');assert.equal(p.level,42);
 globalThis.fetch=async()=>Response.json({basicInfo:{accountId:'23146856',nickname:'Wrong account'}});
 p=await(await lookup(env)).json();assert.equal(p.nickname,'JosiaBira');assert.equal(p.fallbackReason,'SCHEMA_CHANGED');
 globalThis.fetch=async()=>new Response('',{status:401});
 p=await(await lookup(env)).json();assert.equal(p.fallbackReason,'WRAPPER_AUTH_FAILURE');
}finally{globalThis.fetch=saved}
console.log('Fallback/gateway: observed identity only, missing values null, no cross-UID fallback, admission preserved, disable flags, auth/rate/network failures, 404 preserved, live priority, UID validation, server-only token.');
