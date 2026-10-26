// HTTP boundary to a separately hosted 0xMe-compatible Protobuf wrapper.
// Game credentials and compiled schemas stay in that service, never in the browser.
export async function fetchProtobufProfile(uid, region, env, fetcher=fetch) {
  if (!env.FF_PROTOBUF_BASE_URL || !env.FF_PROTOBUF_TOKEN) throw new Error('WRAPPER_NOT_CONFIGURED');
  const base = new URL(env.FF_PROTOBUF_BASE_URL);
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) throw new Error('WRAPPER_CONFIG_INVALID');
  const regions = region === 'auto' ? ['ME','SG','IND','BR'] : [region.toUpperCase()];
  const signal = AbortSignal.timeout(9000);
  for (const candidate of regions) {
    const target = new URL('/get_player_personal_show', base);
    target.searchParams.set('uid',uid);
    target.searchParams.set('server',candidate);
    target.searchParams.set('need_gallery_info','true');
    const response = await fetcher(target,{headers:{Authorization:'Bearer '+env.FF_PROTOBUF_TOKEN,'User-Agent':'ScoutMetrics/2.0',Accept:'application/json'},redirect:'error',signal});
    if(response.status===404){await response.body?.cancel();continue}
    if([401,403].includes(response.status))throw new Error('WRAPPER_AUTH_FAILURE');
    if(response.status===429)throw new Error('WRAPPER_RATE_LIMITED');
    if(!response.ok)throw new Error('WRAPPER_UNAVAILABLE');
    if(!(response.headers.get('content-type')||'').includes('json'))throw new Error('SCHEMA_CHANGED');
    const raw=JSON.parse(await readLimited(response));
    if(raw.status==='error'||raw.success===false)throw new Error('WRAPPER_UNAVAILABLE');
    const profile=normalize(raw.data||raw,uid,candidate.toLowerCase());
    return {...profile,source:'Passerelle Protobuf',dataMode:'live',live:true,readonly:true,status:'resolved'};
  }
  throw new Error('WRAPPER_NOT_FOUND');
}
