import { build, files, prerendered, version } from '$service-worker';
import { precacheAndRoute } from 'workbox-precaching';
console.log({
  build,
  files,
  prerendered,
  version,
});

const precache_list = [
  ...build,
  ...files,
  ...prerendered,
].map(s => ({
  url: s,
  revision: version,
}));

precacheAndRoute(precache_list);
