// Project-owned guide data, loaded after .agents/loop-guide/data.js. Upgrades never touch it.
// Mirror docs/agents/verify.md here: one entry in `rungs` per "## N." heading, in order.
// After editing: bash .agents/loop-guide/build.sh
window.PROJECT = { name: 'TODO(setup): project name' };

window.VERIFY = {
  // [name, command, note]
  rungs: [
    ['Static', 'TODO(setup)', ''],
    ['Tests', 'TODO(setup)', ''],
    ['Run it', 'TODO(setup)', ''],
    ['Exercise the change', 'TODO(setup)', ''],
  ],
  // [kind of change, zero-based rung indexes it needs]
  changes: [
    ['Docs / skills only', []],
    ['TODO(setup)', [0, 1]],
  ],
};

// Project-only skills (folders you added to .agents/skills/) are registered here, not in the
// kit's data.js, so upgrades keep them. stage: entry|align|plan|understand|build|ship|session.
// window.SKILLS['my-skill'] = { stage: 'build', who: 'agent', src: 'Project',
//   what: '…', when: '…', io: '…', calls: [] };
