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
  echo "$*" >> "$FAKE_DIR/merge.log"
  case "$*" in *--disable-auto*) jq '.autoMergeRequest=null' "$FAKE_DIR/pr.json" > "$FAKE_DIR/pr.tmp" && mv "$FAKE_DIR/pr.tmp" "$FAKE_DIR/pr.json"; rm -f "$FAKE_DIR"/pr?.json ;; esac
  exit 0
fi
if [ "$1" = api ]; then
  [ -f "$FAKE_DIR/checks.out" ] || exit 1
  cat "$FAKE_DIR/checks.out"; exit 0
fi
echo "unexpected gh call: $*" >&2; exit 9
EOS
chmod +x "$T/gh"
export PATH="$T:$PATH" GITHUB_REPOSITORY=aziwar/example-repo FAKE_DIR="$T"
ARMEDJ='{"enabledBy":{"login":"aziwar"},"mergeMethod":"SQUASH"}'
pj() { # head draft labels comments [autoMergeRequest-json] [state]
  printf '{"headRefOid":"%s","isDraft":%s,"labels":%s,"comments":%s,"autoMergeRequest":%s,"state":"%s"}\n' "$1" "$2" "$3" "$4" "${5:-null}" "${6:-OPEN}"; }
mkpr() { rm -f "$T"/pr?.json "$T/n" "$T/merge.log"; pj "$@" > "$T/pr.json"; }
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

# --- inputs and the no-bypass checks
bash "$HERE/automerge-reconcile.sh" "https://github.com/other/repo/pull/1" >"$T/out" 2>&1; rc=$?
if [ $rc -ne 0 ]; then echo "ok   foreign repo URL refused"; else echo "FAIL foreign repo URL accepted"; fails=$((fails+1)); fi
mkpr $SHA false '[{"name":"risk:LOW"}]' '[]'; run "armed call is native + head-pinned (--match-head-commit, squash)" 0 "--squash --match-head-commit $SHA"
if ! grep -nE 'gh pr merge( |.*)--admin|--merge-queue' "$HERE/automerge-reconcile.sh" >/dev/null; then echo "ok   script never uses --admin"; else echo "FAIL script uses --admin"; fails=$((fails+1)); fi
echo "failures=$fails"; [ $fails -eq 0 ]
