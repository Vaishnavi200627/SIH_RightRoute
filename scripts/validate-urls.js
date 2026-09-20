// Reads every URL from src/data/resources.json and checks it responds.
// Run: node scripts/validate-urls.js
// Exits non-zero if any URL fails, so CI can flag it.

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESOURCES_PATH = join(__dirname, '..', 'src', 'data', 'resources.json');
const { resources } = JSON.parse(readFileSync(RESOURCES_PATH, 'utf-8'));

const urls = Object.values(resources)
  .map(r => r.url)
  .filter(u => u.startsWith('http'));

function checkUrl(url) {
  return new Promise(resolve => {
    const req = https.get(url, { timeout: 10000 }, res => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 400
      });
      res.destroy();
    });
    req.on('error', err => resolve({ url, ok: false, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, ok: false, error: 'timeout' });
    });
  });
}

const results = await Promise.all(urls.map(checkUrl));

let failed = 0;
for (const r of results) {
  if (r.ok) {
    console.log(`OK   ${r.status}  ${r.url}`);
  } else {
    failed++;
    console.log(`FAIL ${r.status || '-'}  ${r.url}  ${r.error || ''}`);
  }
}

console.log(`\n${results.length - failed}/${results.length} URLs reachable`);
if (failed > 0) process.exit(1);