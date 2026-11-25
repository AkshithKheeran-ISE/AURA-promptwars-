#!/usr/bin/env node
/**
 * @file check-bundle-budget.mjs
 * Performance budget check for the production bundle.
 *
 * Runs after `npm run build`. Gzips every JS chunk in dist/assets and
 * fails the build when the bundle grows past the budgets below.
 *
 * Budgets (gzip, measured 2026-11-25, ~20% headroom over actuals):
 * - TOTAL_JS_GZIP_BUDGET_KB  230 KB — actual ~192 KB
 * - MAX_CHUNK_GZIP_BUDGET_KB  85 KB — actual max 66 KB (vendor chunk)
 *
 * Why gzip: it is what the browser actually downloads. Why a budget:
 * the app is a family tool used on cheap phones and slow networks; a
 * silent bundle regression is a real usability regression.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const TOTAL_JS_GZIP_BUDGET_KB = 230;
const MAX_CHUNK_GZIP_BUDGET_KB = 85;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'dist', 'assets');

if (!existsSync(assetsDir)) {
  console.error(`✖ dist/assets not found — run 'npm run build' first.`);
  process.exit(1);
}

const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));

if (jsFiles.length === 0) {
  console.error('✖ No JS chunks found in dist/assets.');
  process.exit(1);
}

const rows = jsFiles
  .map((file) => {
    const raw = readFileSync(join(assetsDir, file));
    const gzip = gzipSync(raw, { level: 9 });
    return { file, rawKb: raw.length / 1024, gzipKb: gzip.length / 1024 };
  })
  .sort((a, b) => b.gzipKb - a.gzipKb);

const totalGzipKb = rows.reduce((sum, r) => sum + r.gzipKb, 0);
const largest = rows[0];

console.log('Bundle budget check (gzip):\n');
for (const r of rows) {
  console.log(
    `  ${r.gzipKb.toFixed(1).padStart(7)} KB gzip  (${r.rawKb.toFixed(0)} KB raw)  ${r.file}`
  );
}
console.log(
  `\n  Total JS: ${totalGzipKb.toFixed(1)} KB gzip (budget ${TOTAL_JS_GZIP_BUDGET_KB} KB)`
);
console.log(
  `  Largest chunk: ${largest.file} at ${largest.gzipKb.toFixed(1)} KB gzip (budget ${MAX_CHUNK_GZIP_BUDGET_KB} KB)`
);

const failures = [];
if (totalGzipKb > TOTAL_JS_GZIP_BUDGET_KB) {
  failures.push(
    `Total JS ${totalGzipKb.toFixed(1)} KB exceeds budget ${TOTAL_JS_GZIP_BUDGET_KB} KB — ` +
      'split a route, drop a dependency, or raise the budget deliberately.'
  );
}
if (largest.gzipKb > MAX_CHUNK_GZIP_BUDGET_KB) {
  failures.push(
    `${largest.file} at ${largest.gzipKb.toFixed(1)} KB exceeds chunk budget ${MAX_CHUNK_GZIP_BUDGET_KB} KB — ` +
      'code-split the route or lazy-load the heavy part.'
  );
}

if (failures.length > 0) {
  console.error(`\n✖ Performance budget FAILED:\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}

console.log('\n✓ Performance budget passed.');
