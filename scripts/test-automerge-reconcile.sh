#!/usr/bin/env bash
# Proof for scripts/automerge-reconcile.sh with a fake `gh` (no network, no real merge).
# usage: bash scripts/test-automerge-reconcile.sh   (exit 0 = every case behaved as expected)
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
SHA=1111111111111111111111111111111111111111
OTHER=2222222222222222222222222222222222222222
URL=https://github.com/aziwar/example-repo/pull/7
cat > "$T/gh" <<'EOS'
#!/usr/bin/env bash
# `gh pr view` call number N prints $FAKE_DIR/prN.json when it exists, else $FAKE_DIR/pr.json. `gh pr merge` is only logged;
# a `--disable-auto` call also clears autoMergeRequest in pr.json so the post-disarm read-back sees the new state.
if [ "$1 $2" = "pr view" ]; then
  n=$(cat "$FAKE_DIR/n" 2>/dev/null || echo 0); n=$((n+1)); echo "$n" > "$FAKE_DIR/n"
  f="$FAKE_DIR/pr$n.json"; [ -f "$f" ] || f="$FAKE_DIR/pr.json"; cat "$f"; exit 0
fi
if [ "$1 $2" = "pr merge" ]; then
  echo "$*" >> "$FAKE_DIR/merge.log"; echo "MERGE $*" >> "$FAKE_DIR/all.log"
  case "$*" in *--disable-auto*) jq '.autoMergeRequest=null' "$FAKE_DIR/pr.json" > "$FAKE_DIR/pr.tmp" && mv "$FAKE_DIR/pr.tmp" "$FAKE_DIR/pr.json"; rm -f "$FAKE_DIR"/pr?.json ;; esac
  exit 0
fi
if [ "$1" = api ]; then
  case "$*" in *statuses/*)
    [ -f "$FAKE_DIR/status.fail" ] && exit 1
    echo "STATUS $*" >> "$FAKE_DIR/all.log"; echo "$*" >> "$FAKE_DIR/status.log"; exit 0 ;;
  esac
  [ -f "$FAKE_DIR/checks.out" ] || exit 1
  cat "$FAKE_DIR/checks.out"; exit 0
fi
if [ "$1 $2" = "pr list" ]; then cat "$FAKE_DIR/list.json"; exit 0; fi
echo "unexpected gh call: $*" >&2; exit 9
EOS
chmod +x "$T/gh"
export PATH="$T:$PATH" GITHUB_REPOSITORY=aziwar/example-repo FAKE_DIR="$T"
ARMEDJ='{"enabledBy":{"login":"aziwar"},"mergeMethod":"SQUASH"}'
pj() { # head draft labels comments [autoMergeRequest-json] [state]
  printf '{"headRefOid":"%s","isDraft":%s,"labels":%s,"comments":%s,"autoMergeRequest":%s,"state":"%s"}\n' "$1" "$2" "$3" "$4" "${5:-null}" "${6:-OPEN}"; }
mkpr() { rm -f "$T"/pr?.json "$T/n" "$T/merge.log" "$T/status.log" "$T/all.log" "$T/status.fail"; pj "$@" > "$T/pr.json"; }
verdict() { printf '{"author":{"login":"%s"},"body":"lens-verdict: %s PASS %s"}' "$1" "$2" "$3"; }
FABLE="[$(verdict aziwar fable $SHA)]"
BOTH="[$(verdict aziwar fable $SHA),$(verdict aziwar astra $SHA)]"
fails=0
run() { # name want-exit want-merge-pattern(or NONE) -- runs the script with the current fake state
  local name="$1" wantrc="$2" pat="$3"; bash "$HERE/automerge-reconcile.sh" "$URL" >"$T/out" 2>&1; local rc=$?
  local log=""; [ -f "$T/merge.log" ] && log="$(cat "$T/merge.log")"
  local ok=1
  [ "$rc" = "$wantrc" ] || ok=0
  if [ "$pat" = NONE ]; then [ -z "$log" ] || ok=0; else printf '%s' "$log" | grep -q -- "$pat" || ok=0; fi
  case "$pat" in *--squash*) ;; *) printf '%s' "$log" | grep -q -- '--squash' && ok=0 ;; esac   # a non-arming case must never arm
  if [ $ok = 1 ]; then echo "ok   $name"; else echo "FAIL $name (exit $rc, want $wantrc; merge calls: [${log:-none}]): $(tr '\n' ' ' < "$T/out" | cut -c1-200)"; fails=$((fails+1)); fi
}
ARM="--auto --squash --match-head-commit $SHA $URL"

# --- risk levels
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]';                    run "LOW arms with no verdict (CI/ruleset only)" 0 "$ARM"
mkpr $SHA false '[{"name":"risk:NORMAL"}]' '[]';                 run "NORMAL without verdict does not arm" 0 NONE
mkpr $SHA false '[{"name":"risk:NORMAL"}]' "$FABLE";             run "NORMAL with fable on this head arms" 0 "$ARM"
mkpr $SHA false '[{"name":"risk:NORMAL"}]' "[$(verdict aziwar fable $OTHER)]"; run "NORMAL with fable for ANOTHER head does not arm" 0 NONE
mkpr $SHA false '[{"name":"risk:NORMAL"}]' "[$(verdict someone fable $SHA)]";  run "NORMAL with fable by a non-owner does not arm" 0 NONE
mkpr $SHA false '[{"name":"risk:HIGH"}]' "$FABLE";               run "HIGH with fable only does not arm" 0 NONE
mkpr $SHA false '[{"name":"risk:HIGH"}]' "[$(verdict aziwar astra $SHA)]";     run "HIGH with astra only does not arm" 0 NONE
mkpr $SHA false '[{"name":"risk:HIGH"}]' "$BOTH";                run "HIGH with fable + astra arms" 0 "$ARM"
mkpr $SHA false '[]' '[]';                                       run "no risk label counts as NORMAL: no verdict, no arm" 0 NONE
mkpr $SHA false '[]' "$FABLE";                                   run "no risk label counts as NORMAL: fable arms" 0 "$ARM"
mkpr $SHA false '[{"name":"risk:LOW"},{"name":"risk:HIGH"}]' "$FABLE"; run "LOW+HIGH counts as HIGH: fable only does not arm" 0 NONE

# --- hold labels, draft, state
mkpr $SHA false '[{"name":"risk:LOW"},{"name":"no-automerge"}]' '[]';       run "hold no-automerge blocks arming" 0 NONE
mkpr $SHA false '[{"name":"risk:LOW"},{"name":"needs:owner-yes"}]' '[]';    run "hold needs:owner-yes blocks arming" 0 NONE
mkpr $SHA true '[{"name":"risk:LOW"}]' '[]';                      run "draft does not arm" 0 NONE
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]' null CLOSED;         run "closed PR does not arm" 0 NONE

# --- disarm: hold label / new push / draft while armed
mkpr $SHA false '[{"name":"risk:LOW"},{"name":"no-automerge"}]' '[]' "$ARMEDJ"; run "armed + hold label added => disarm" 0 "--disable-auto"
mkpr $OTHER false '[{"name":"risk:NORMAL"}]' "$FABLE" "$ARMEDJ"; D="--disable-auto $URL"; run "armed + NEW HEAD (verdict is for the old head) => disarm" 0 "$D"
mkpr $SHA true '[{"name":"risk:LOW"}]' '[]' "$ARMEDJ";            run "armed + converted to draft => disarm" 0 "--disable-auto"
mkpr $SHA false '[{"name":"risk:NORMAL"}]' "$FABLE" "$ARMEDJ";    run "armed + still eligible => keep, no merge call" 0 NONE
mkpr $SHA false '[{"name":"risk:HIGH"}]' "$FABLE" "$ARMEDJ";      run "armed + risk raised to HIGH without astra => disarm" 0 "--disable-auto"

# --- race: something changes between the first read and the arm
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; pj $SHA false '[{"name":"risk:LOW"},{"name":"no-automerge"}]' '[]' > "$T/pr2.json"
run "hold added after the first read: not armed" 0 NONE
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; pj $OTHER false '[{"name":"risk:LOW"}]' '[]' > "$T/pr2.json"
run "head moved after the first read: not armed, refused (+ disarm attempt)" 1 "--disable-auto"
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; pj $SHA false '[{"name":"risk:HIGH"}]' '[]' > "$T/pr2.json"
run "risk raised to HIGH after the first read: not armed" 0 NONE

# --- fail closed on malformed data (never arms; a disarm is attempted)
mkpr $SHA false null '[]';                                        run "labels null => refuse, never arm" 1 "--disable-auto"
mkpr $SHA false '[{"name":"risk:LOW"},7]' '[]';                   run "non-object label member => refuse, never arm" 1 "--disable-auto"
mkpr $SHA false '[7,{"name":"no-automerge"}]' '[]';               run "bad member before a hold => refuse, never arm" 1 "--disable-auto"
mkpr $SHA false '[{"name":5}]' '[]';                              run "label name not a string => refuse" 1 "--disable-auto"
mkpr $SHA false '[{"name":"risk:NORMAL"}]' '[{"body":"lens-verdict: fable PASS '$SHA'"}]'; run "comment without author => refuse, never arm" 1 "--disable-auto"
printf '{"headRefOid":"abc","isDraft":false,"labels":[],"comments":[],"autoMergeRequest":null,"state":"OPEN"}\n' > "$T/pr.json"; rm -f "$T/n" "$T/merge.log"
run "short head SHA => refuse" 1 "--disable-auto"
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; sed -i 's/"autoMergeRequest":null,//' "$T/pr.json"; run "autoMergeRequest missing => refuse" 1 "--disable-auto"

# --- LOW_NEEDS_CHECK=1 (report-stack: no required checks in the ruleset)
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; echo 0 > "$T/checks.out"
LOW_NEEDS_CHECK=1 run "LOW + no successful check run => treated as NORMAL, no verdict, no arm" 0 NONE
mkpr $SHA false '[{"name":"risk:LOW"}]' "$FABLE"; echo 0 > "$T/checks.out"
LOW_NEEDS_CHECK=1 run "LOW + no successful check run + fable verdict => arms" 0 "$ARM"
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; echo 2 > "$T/checks.out"
LOW_NEEDS_CHECK=1 run "LOW + a successful check run on the head => arms without a verdict" 0 "$ARM"
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; rm -f "$T/checks.out"
LOW_NEEDS_CHECK=1 run "LOW + check-runs call fails => fail safe as NORMAL, no arm" 0 NONE
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; echo 0 > "$T/checks.out"
run "LOW_NEEDS_CHECK unset (AZ-Digital-Hub: ruleset requires build + Codex review) => LOW arms" 0 "$ARM"
rm -f "$T/checks.out"

# --- server-side lens-gate commit status (Astra HIGH PR 20/65): posted on the exact head BEFORE any arm/disarm
gate_is() { # name want-state sha
  if grep -q -- "statuses/$3" "$T/status.log" 2>/dev/null && grep -q -- "state=$2" "$T/status.log" && grep -q -- "context=lens-gate" "$T/status.log"; then echo "ok   $1"; else echo "FAIL $1: [$(cat "$T/status.log" 2>&1)]"; fails=$((fails+1)); fi; }
mkpr $SHA false '[{"name":"risk:NORMAL"}]' "$FABLE"; run "eligible: arms" 0 "$ARM"; gate_is "lens-gate=success posted on the head" success $SHA
if [ "$(head -1 "$T/all.log" | cut -c1-6)" = STATUS ]; then echo "ok   status is posted BEFORE the arm call"; else echo "FAIL order: $(cat "$T/all.log")"; fails=$((fails+1)); fi
mkpr $SHA false '[{"name":"risk:NORMAL"}]' '[]'; run "missing verdict: no arm" 0 NONE; gate_is "lens-gate=pending while the verdict is missing" pending $SHA
mkpr $SHA false '[{"name":"risk:LOW"},{"name":"no-automerge"}]' '[]'; run "hold: no arm" 0 NONE; gate_is "lens-gate=failure on a hold label" failure $SHA
mkpr $OTHER false '[{"name":"risk:NORMAL"}]' "$FABLE" "$ARMEDJ"; run "armed + new head: disarm" 0 "--disable-auto"; gate_is "new head gets lens-gate=pending (stale approval cannot ride along)" pending $OTHER
if [ "$(head -1 "$T/all.log" | cut -c1-6)" = STATUS ]; then echo "ok   status is posted BEFORE the disarm call"; else echo "FAIL order: $(cat "$T/all.log")"; fails=$((fails+1)); fi
mkpr $SHA false '[{"name":"risk:NORMAL"}]' "$FABLE"; touch "$T/status.fail"; run "status cannot be posted => refuse, never arm" 1 "--disable-auto"
mkpr $SHA false '[{"name":"risk:NORMAL"}]' "$FABLE" "$ARMEDJ"; rm -f "$T/status.fail"; run "armed + eligible: keep, status success refreshed" 0 NONE; gate_is "keep path also posts success" success $SHA

# --- sweep: dependabot only gets lens-gate=success; other PRs are reconciled (a deleted comment or late check is caught here)
mkpr $SHA false '[{"name":"risk:NORMAL"}]' '[]' "$ARMEDJ"   # verdict was revoked (comment deleted): armed PR with no verdict
printf '[{"url":"%s","headRefOid":"%s","author":{"login":"aziwar"}},{"url":"https://github.com/aziwar/example-repo/pull/8","headRefOid":"%s","author":{"login":"dependabot[bot]"}}]\n' "$URL" "$SHA" "$OTHER" > "$T/list.json"
DEFAULT_BRANCH=main bash "$HERE/automerge-sweep.sh" >"$T/out" 2>&1; rc=$?
if [ $rc = 0 ] && grep -q -- "--disable-auto" "$T/merge.log" && grep -q "statuses/$OTHER" "$T/status.log" && grep -q "state=success" "$T/status.log"; then echo "ok   sweep disarms the PR whose verdict was revoked and passes dependabot (lens-gate success)"; else echo "FAIL sweep rc=$rc: $(cat "$T/out") [$(cat "$T/merge.log" 2>&1)]"; fails=$((fails+1)); fi
if ! grep -q -- "pull/8" "$T/merge.log"; then echo "ok   sweep never arms or disarms a dependabot PR"; else echo "FAIL sweep touched the dependabot PR"; fails=$((fails+1)); fi

# --- workflow wiring (static): revocation events, trusted checkout, base pin, schedule
WF="$HERE/../.github/workflows/auto-merge.yml"
if grep -qE 'types: \[created, edited, deleted\]' "$WF"; then echo "ok   workflow reconciles comment edits AND deletions"; else echo "FAIL workflow lacks created/edited/deleted comment events"; fails=$((fails+1)); fi
if ! grep -q "startsWith(github.event.comment.body" "$WF"; then echo "ok   owner comment events are not filtered by the NEW body prefix (a withdrawn/edited verdict still reconciles)"; else echo "FAIL workflow still filters on the comment body prefix"; fails=$((fails+1)); fi
if grep -q "schedule:" "$WF" && grep -q "automerge-sweep.sh" "$WF"; then echo "ok   workflow has a scheduled sweep"; else echo "FAIL no scheduled sweep"; fails=$((fails+1)); fi
if grep -q "ref: \${{ github.event.repository.default_branch }}" "$WF"; then echo "ok   the privileged checkout is pinned to the default branch"; else echo "FAIL checkout is not pinned to the default branch"; fails=$((fails+1)); fi

# --- inputs and the no-bypass checks
bash "$HERE/automerge-reconcile.sh" "https://github.com/other/repo/pull/1" >"$T/out" 2>&1; rc=$?
if [ $rc -ne 0 ]; then echo "ok   foreign repo URL refused"; else echo "FAIL foreign repo URL accepted"; fails=$((fails+1)); fi
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; run "armed call is native + head-pinned (--match-head-commit, squash)" 0 "--squash --match-head-commit $SHA"
if ! grep -nE 'gh pr merge( |.*)--admin|--merge-queue' "$HERE/automerge-reconcile.sh" >/dev/null; then echo "ok   script never uses --admin"; else echo "FAIL script uses --admin"; fails=$((fails+1)); fi
echo "failures=$fails"; [ $fails -eq 0 ]
