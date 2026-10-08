#!/usr/bin/env bash
# Installs or upgrades Almalgo Mode in a git repository.
#
#   curl -fsSL https://raw.githubusercontent.com/Almalgo/Almalgo-Mode/main/install.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/Almalgo/Almalgo-Mode/main/install.sh | bash -s -- --ref v1.0.0
#   ./install.sh [--target <repo>] [--ref <git ref>] [--force]     # from a local clone
#
# Kit-owned (replaced on every run): .agents/skills/<kit skills>, .agents/loop-guide/,
#   .cursor/agents/almalgo-agent.md, .agents/ALMALGO_MODE_VERSION.
# Project-owned (never overwritten): docs/agents/*, AGENTS.md, GLOSSARY.md, docs/adr/,
#   and any skill folder in .agents/skills/ that isn't part of the kit.
set -euo pipefail

REPO_URL="${ALMALGO_MODE_REPO:-https://github.com/Almalgo/Almalgo-Mode}"
TARGET="$PWD"; REF=""; FORCE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    --ref) REF="$2"; shift 2 ;;
    --force) FORCE=1; shift ;;
    -h|--help) sed -n '2,12p' "$0" 2>/dev/null || true; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

die() { echo "almalgo-mode: $*" >&2; exit 1; }
TARGET="$(cd "$TARGET" && pwd)" || die "no such directory: $TARGET"
git -C "$TARGET" rev-parse --show-toplevel >/dev/null 2>&1 || die "$TARGET is not a git repository"
TARGET="$(git -C "$TARGET" rev-parse --show-toplevel)"
command -v node >/dev/null || die "node (>= 22) is required"

# ---- Locate the kit: this script's own checkout, or a downloaded tarball. ----
SELF_DIR=""
[[ -n "${BASH_SOURCE[0]:-}" && -f "${BASH_SOURCE[0]}" ]] && SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
if [[ -z "$REF" && -n "$SELF_DIR" && -f "$SELF_DIR/.agents/skills/almalgo-mode/SKILL.md" ]]; then
  KIT="$SELF_DIR"
  VERSION="$(git -C "$KIT" describe --tags --always --dirty 2>/dev/null || echo local)"
else
  REF="${REF:-main}"
  command -v curl >/dev/null || die "curl is required"
  curl -fsSL "$REPO_URL/archive/$REF.tar.gz" | tar -xz -C "$TMP" || die "could not download $REPO_URL @ $REF"
  KIT="$(find "$TMP" -mindepth 1 -maxdepth 1 -type d | head -1)"
  VERSION="$REF"
fi
[[ "$KIT" != "$TARGET" ]] || die "refusing to install the kit into its own repository"

# ---- Refuse to clobber uncommitted kit edits unless --force. ----
if [[ $FORCE -eq 0 ]] && [[ -n "$(git -C "$TARGET" status --porcelain -- .agents .cursor/agents 2>/dev/null)" ]]; then
  die "uncommitted changes under .agents/ or .cursor/agents/. Commit or stash them, or pass --force."
fi

# ---- Copy kit-owned files. ----
mkdir -p "$TARGET/.agents/skills" "$TARGET/.cursor/agents"
for d in "$KIT"/.agents/skills/*/; do
  name="$(basename "$d")"
  rm -rf "$TARGET/.agents/skills/$name"
  cp -R "$d" "$TARGET/.agents/skills/$name"
done
for f in README.md check.mjs; do cp "$KIT/.agents/skills/$f" "$TARGET/.agents/skills/$f"; done
mkdir -p "$TARGET/.agents/loop-guide"
for f in index.html data.js build.sh render.mjs; do cp "$KIT/.agents/loop-guide/$f" "$TARGET/.agents/loop-guide/$f"; done
chmod +x "$TARGET/.agents/loop-guide/build.sh"
cp "$KIT/.cursor/agents/almalgo-agent.md" "$TARGET/.cursor/agents/almalgo-agent.md"
echo "$VERSION" > "$TARGET/.agents/ALMALGO_MODE_VERSION"

# Skills removed upstream since the last install: report, never delete (they may be yours).
if [[ -f "$TARGET/.agents/.almalgo-mode-skills" ]]; then
  while read -r old; do
    [[ -n "$old" && ! -d "$KIT/.agents/skills/$old" && -d "$TARGET/.agents/skills/$old" ]] \
      && echo "note: '$old' is no longer part of the kit. Delete .agents/skills/$old if you don't use it."
  done < "$TARGET/.agents/.almalgo-mode-skills"
fi
( cd "$KIT/.agents/skills" && ls -d */ | tr -d / ) > "$TARGET/.agents/.almalgo-mode-skills"

# ---- Line endings for the hashed files (append once; never rewrite an existing file). ----
GA="$TARGET/.gitattributes"
if ! grep -q 'almalgo-mode' "$GA" 2>/dev/null; then
  printf '\n# almalgo-mode: keep hashed guide sources LF on every OS\n.agents/** text=auto eol=lf\n.agents/agentic-loop-guide.pdf binary\n.cursor/agents/** text=auto eol=lf\ndocs/agents/** text=auto eol=lf\n' >> "$GA"
fi

# ---- Project-owned stubs: create only what's missing. ----
mkdir -p "$TARGET/docs/agents"
for f in verify.md guide.js triage-labels.md domain.md; do
  [[ -f "$TARGET/docs/agents/$f" ]] || cp "$KIT/.agents/skills/setup-almalgo-mode/templates/$f" "$TARGET/docs/agents/$f"
done
[[ -f "$TARGET/docs/agents/issue-tracker.md" ]] || printf '# Issue tracker\n\nTODO(setup): run /setup-almalgo-mode to pick GitHub, GitLab, or local markdown.\n' > "$TARGET/docs/agents/issue-tracker.md"

echo "Almalgo Mode $VERSION installed in $TARGET"
if grep -rq 'TODO(setup)' "$TARGET/docs/agents"; then
  cat <<'EOF'

Next:
  1. Open the repo in Cursor (or OpenCode / Codex) and run:  /setup-almalgo-mode
     It fills docs/agents/ (verify ladder, tracker, labels), adds the AGENTS.md section,
     and builds .agents/agentic-loop-guide.pdf.
  2. node .agents/skills/check.mjs   # must print "ok"
  3. Commit .agents/ .cursor/agents/ docs/agents/ AGENTS.md .gitattributes
EOF
else
  cat <<'EOF'

Upgrade done. Rebuild the guide and check:
  bash .agents/loop-guide/build.sh && node .agents/skills/check.mjs
Then review `git diff` and commit.
EOF
fi
