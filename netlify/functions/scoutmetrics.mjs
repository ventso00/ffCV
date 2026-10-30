import worker from '../../worker/index.js';
const keys = ['FF_COMMUNITY_API_KEY','PROFILE_TEST_FALLBACK','FF_PROTOBUF_BASE_URL','FF_PROTOBUF_TOKEN','PROFILE_IMPORT_ENABLED','MG_PILOT_ROSTER','IDENTITY_PROVIDER','MOOGOLD_PARTNER_ID','MOOGOLD_SECRET','MOOGOLD_FF_PRODUCT_ID','MOOGOLD_FF_SERVER'];
export default async function handler(request, context = {}) {
  const env = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const headers = new Headers(request.headers);
  // Use Netlify's trusted client IP, never a visitor-supplied Cloudflare header.
  headers.set('CF-Connecting-IP', context.ip || 'unknown-client');
  return worker.fetch(new Request(request, {headers}), env);
}
export const config = {path:'/*', preferStatic:true};
