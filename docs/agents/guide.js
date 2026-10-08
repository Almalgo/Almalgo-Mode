// Project-owned guide data for the Almalgo-Mode kit repo itself. Mirrors docs/agents/verify.md.
window.PROJECT = { name: 'Almalgo Mode' };

window.VERIFY = {
  rungs: [
    ['Static', 'node .agents/skills/check.mjs', 'Names, links, cross-refs, guide coverage, PDF freshness'],
    ['Guide', 'bash .agents/loop-guide/build.sh', 'Rebuild the PDF and look at the pages you changed'],
    ['Install into a scratch repo', './install.sh --target "$(mktemp -d)"', 'Fresh install, then an upgrade that must leave docs/agents/ untouched'],
  ],
  changes: [
    ['README or docs only', []],
    ['A skill, playbook or principle', [0, 1]],
    ['Guide (loop-guide/)', [0, 1]],
    ['install.sh, templates, check.mjs', [0, 2]],
  ],
};
