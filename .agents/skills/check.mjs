#!/usr/bin/env node
// Validates the Almalgo Mode install: skill frontmatter, links, cross-references; that the
// project config in docs/agents/ exists with no TODO(setup) left; that the loop guide covers
// every skill, playbook, principle and verify rung; and that .agents/agentic-loop-guide.pdf
// was rebuilt after the last change to .agents/, .cursor/agents/ or docs/agents/.
// Run: node .agents/skills/check.mjs   (--skip-pdf: skip the freshness check; --source-hash: print it)
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));
const repo = resolve(root, '../..');
const skills = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory());
const errors = [];

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });

for (const s of skills) {
  const file = join(root, s, 'SKILL.md');
  if (!existsSync(file)) { errors.push(`${s}: missing SKILL.md`); continue; }
  const fm = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const name = fm.match(/^name:\s*(.+)$/m)?.[1].trim();
  const desc = fm.match(/^description:\s*(.+)$/m)?.[1].trim();
  if (name !== s) errors.push(`${s}: frontmatter name "${name}" != folder`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) errors.push(`${s}: invalid skill name`);
  if (!desc || desc.length > 1024) errors.push(`${s}: description missing or > 1024 chars`);
}

const known = new Set(skills);
// Explicit references only: `/name`, "Skill tool with "name"", "the `name` skill", "**name** skill".
const refs = [
  /(?:^|\s|\()`\/([a-z][a-z0-9-]+)`(?![./\w])/gm,
  /Skill tool (?:twice, )?(?:with|for) [`"]([a-z][a-z0-9-]+)[`"]/g,
  /`([a-z][a-z0-9-]+)` skill\b/g,
  /\*\*([a-z][a-z0-9-]+)\*\* skill\b/g,
];
// Cursor built-ins, plus names upstream prose uses as terms rather than invocations.
const builtins = ['loop', 'in-cloud', 'autopilot', 'show-me', 'model-invoked', 'user-invoked', 'tmp', 'settings'];
for (const f of [...walk(root), ...['AGENTS.md', '.cursor/agents/almalgo-agent.md'].map((p) => join(repo, p)).filter(existsSync)]) {
  const text = readFileSync(f, 'utf8').replace(/^(```|~~~)[\s\S]*?^\1/gm, '');
  const rel = f.replace(repo + '/', '');
  for (const [, target] of text.matchAll(/\]\(((?!https?:|#|mailto:)[^)\s]*[./][^)\s]*?)(?:#[^)]*)?\)/g)) {
    if (!existsSync(resolve(dirname(f), target))) errors.push(`${rel}: broken link ${target}`);
  }
  for (const re of refs) for (const [, n] of text.matchAll(re)) {
    if (!known.has(n) && !builtins.includes(n)) errors.push(`${rel}: unknown skill "${n}"`);
  }
}

// ---- Loop guide (.agents/loop-guide/data.js) must describe exactly what's on disk. ----
const agents = resolve(root, '..');
const guide = join(agents, 'loop-guide');
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(guide, 'data.js'), 'utf8'), sandbox);
// ---- Project-owned config (docs/agents/), written by /setup-almalgo-mode. ----
const docs = join(repo, 'docs', 'agents');
const projectGuide = join(docs, 'guide.js');
const required = ['verify.md', 'guide.js', 'issue-tracker.md', 'triage-labels.md', 'domain.md'];
const missing = required.filter((f) => !existsSync(join(docs, f)));
if (missing.length) errors.push(`docs/agents/ is missing ${missing.join(', ')}. Run /setup-almalgo-mode (or copy from the kit's templates/).`);
else {
  vm.runInNewContext(readFileSync(projectGuide, 'utf8'), sandbox);
  for (const f of required) {
    const todo = readFileSync(join(docs, f), 'utf8').split('\n').findIndex((l) => l.includes('TODO(setup)'));
    if (todo >= 0) errors.push(`docs/agents/${f}:${todo + 1}: unfinished TODO(setup). Run /setup-almalgo-mode.`);
  }
}
const G = sandbox.window;
const inGuide = Object.keys(G.SKILLS);
for (const s of skills) {
  if (!G.SKILLS[s]) { errors.push(`loop-guide/data.js: skill "${s}" missing from SKILLS`); continue; }
  const userInvoked = /^disable-model-invocation:\s*true/m.test(readFileSync(join(root, s, 'SKILL.md'), 'utf8'));
  if ((G.SKILLS[s].who === 'you') !== userInvoked) errors.push(`loop-guide/data.js: "${s}" who should be "${userInvoked ? 'you' : 'agent'}"`);
}
for (const s of inGuide) {
  if (!known.has(s)) errors.push(`loop-guide/data.js: SKILLS has "${s}" but .agents/skills/${s} doesn't exist`);
  for (const c of G.SKILLS[s].calls) if (!known.has(c)) errors.push(`loop-guide/data.js: ${s} calls unknown "${c}"`);
}
const pbDir = join(root, 'almalgo-mode', 'playbooks');
for (const f of readdirSync(pbDir).filter((f) => f.endsWith('.md'))) {
  const pb = G.PLAYBOOKS.find((p) => p.file === f);
  if (!pb) { errors.push(`loop-guide/data.js: playbook ${f} missing from PLAYBOOKS`); continue; }
  const steps = (readFileSync(join(pbDir, f), 'utf8').match(/^\d+\. /gm) || []).length;
  if (pb.steps.length < steps) errors.push(`loop-guide/data.js: ${f} has ${steps} steps, guide shows ${pb.steps.length}`);
  for (const [, used] of pb.steps) for (const c of used) if (!known.has(c)) errors.push(`loop-guide/data.js: ${f} uses unknown "${c}"`);
}
for (const p of G.PLAYBOOKS) if (!existsSync(join(pbDir, p.file))) errors.push(`loop-guide/data.js: PLAYBOOKS has ${p.file} but the file doesn't exist`);
const modeText = readFileSync(join(root, 'almalgo-mode', 'SKILL.md'), 'utf8');
const principles = [...(modeText.split('## Principles')[1] ?? '').split('## Autonomy')[0].matchAll(/^- \*\*(.+?)\.\*\*/gm)].map((m) => m[1]);
const guidePrinciples = G.PRINCIPLES.flatMap(([, list]) => list.map(([n]) => n));
for (const n of principles) if (!guidePrinciples.includes(n)) errors.push(`loop-guide/data.js: principle "${n}" missing from PRINCIPLES`);
for (const n of guidePrinciples) if (!principles.includes(n)) errors.push(`loop-guide/data.js: PRINCIPLES has "${n}", not in almalgo-mode/SKILL.md`);
if (!missing.length) {
  const rungs = (readFileSync(join(docs, 'verify.md'), 'utf8').match(/^## \d+\. /gm) || []).length;
  if (!rungs) errors.push('docs/agents/verify.md: no rungs (need "## 1. <name>" headings).');
  if (rungs !== G.VERIFY.rungs.length) errors.push(`docs/agents/guide.js: verify.md has ${rungs} rungs, guide shows ${G.VERIFY.rungs.length}`);
  for (const [name, on] of G.VERIFY.changes) for (const i of on) if (i >= rungs) errors.push(`docs/agents/guide.js: "${name}" points at rung ${i + 1}, which doesn't exist`);
}
for (const f of G.FLOWS) for (const [who] of f.nodes) if (!['you', 'agent', 'gh', 'stack'].includes(who)) errors.push(`loop-guide/data.js: flow ${f.id} bad actor "${who}"`);

// ---- PDF freshness: a hash of every source file under .agents/, .cursor/agents/, docs/agents/. ----
const PDF = join(agents, 'agentic-loop-guide.pdf');
const STAMP = join(guide, 'pdf-source.sha256');
// Tracked + not-ignored untracked files only, so editor swap files and .DS_Store don't count.
const sourceHash = () => {
  const out = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', '.agents', '.cursor/agents', 'docs/agents'], { cwd: repo });
  const list = out.toString().split('\0').filter(Boolean)
    .filter((p) => existsSync(join(repo, p)))
    .filter((p) => join(repo, p) !== PDF && join(repo, p) !== STAMP)
    .sort();
  const h = createHash('sha256');
  for (const p of list) h.update(p + '\0').update(readFileSync(join(repo, p)).toString('utf8').replace(/\r\n/g, '\n')).update('\0');
  return h.digest('hex');
};

if (process.argv.includes('--source-hash')) { console.log(sourceHash()); process.exit(0); }
if (!process.argv.includes('--skip-pdf')) {
  const stamp = existsSync(STAMP) ? readFileSync(STAMP, 'utf8').trim() : '';
  if (!existsSync(PDF) || stamp !== sourceHash())
    errors.push('.agents/agentic-loop-guide.pdf is out of date. Update .agents/loop-guide/data.js (kit) or docs/agents/guide.js (project) if the loop changed, then run: bash .agents/loop-guide/build.sh');
}

console.log(errors.length ? errors.join('\n') : `ok: ${skills.length} skills, guide in sync`);
process.exit(errors.length ? 1 : 0);
