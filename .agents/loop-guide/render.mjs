#!/usr/bin/env node
// Renders a URL to PDF through the Chrome DevTools Protocol. No npm deps: Node >= 22 (fetch, WebSocket).
// Usage: node render.mjs <chrome-binary> <url> <out.pdf>
// Waits for the page to set <html data-ready>, so the PDF never captures a half-built layout.
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [chrome, url, out] = process.argv.slice(2);
if (!chrome || !url || !out) { console.error('usage: render.mjs <chrome> <url> <out.pdf>'); process.exit(2); }

const profile = mkdtempSync(join(tmpdir(), 'guide-'));
// Port 0: Chrome picks a free port and writes it to DevToolsActivePort in the profile.
const proc = spawn(chrome, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
const cleanup = () => { proc.kill(); try { rmSync(profile, { recursive: true, force: true }); } catch {} };
const fail = (m) => { console.error(m); cleanup(); process.exit(1); };
setTimeout(() => fail('timed out after 60s'), 60000).unref();

let target;
for (let i = 0; i < 100 && !target; i++) {
  try {
    const port = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
    target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page');
  } catch { await new Promise((r) => setTimeout(r, 100)); }
}
if (!target) fail('chrome did not start');

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

await send('Emulation.setDeviceMetricsOverride', { width: 1123, height: 794, deviceScaleFactor: 1, mobile: false });
await send('Page.enable');
await send('Page.navigate', { url });
for (let i = 0; ; i++) {
  const r = await send('Runtime.evaluate', { expression: 'document.documentElement.dataset.ready === "1" && document.fonts.status === "loaded"', returnByValue: true });
  if (r.result?.result?.value) break;
  if (i > 200) fail('page never set data-ready');
  await new Promise((res) => setTimeout(res, 100));
}
await new Promise((r) => setTimeout(r, 400));
const err = await send('Runtime.evaluate', { expression: 'window.__guideError || ""', returnByValue: true });
if (err.result?.result?.value) fail('page error: ' + err.result.result.value);

const pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
if (!pdf.result?.data) fail('printToPDF failed: ' + JSON.stringify(pdf.error));
writeFileSync(out, Buffer.from(pdf.result.data, 'base64'));
ws.close(); proc.kill();
await new Promise((r) => { proc.once('exit', r); setTimeout(r, 3000); });
try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(0);
