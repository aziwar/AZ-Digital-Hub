#!/usr/bin/env bash
# Lens-gated native auto-merge (owner approval 2026-11-02 12:43 KWT, Rahmi ticket 7398cd8d).
# usage: automerge-reconcile.sh <pr_url>      (env DRYRUN=1 prints the gh call instead of running it)
# Decides from the PR's CURRENT state whether GitHub native auto-merge may be armed, and arms or disarms it:
#   ARM only when the PR is open, not a draft, has neither label no-automerge nor needs:owner-yes, and the owner account
#   (OWNER_LOGIN, default aziwar) commented "lens-verdict: <lens> PASS <full head sha>" on the EXACT current head for the
#   lenses the risk label requires:  risk:LOW = none (CI/ruleset only)  risk:NORMAL = fable  risk:HIGH = fable + astra.
#   No risk label counts as NORMAL; several risk labels count as the highest.
#   DISARM whenever the PR is not eligible (new head without verdicts, hold label, draft, label change) and auto-merge is armed.
# Why disarm here: GitHub itself disarms auto-merge on a push only when the pusher has NO write permission
# (docs.github.com .../automatically-merging-a-pull-request), so a writer's push must be handled by the `synchronize` run of this script.
# Reused from 211's validated gate (cloudbot-plugins scripts/automerge-gate.sh): strict schema, exact head, hold labels,
# fail closed on every parse error, re-read right before the arm. The re-read narrows but cannot close the last race.
# Optional LOW_NEEDS_CHECK=1 (report-stack, whose ruleset has NO required checks): risk:LOW arms only when the exact head has at least
# one completed SUCCESSFUL check run; with none (or when the check-runs call fails) LOW is treated as NORMAL and needs the fable verdict.
# Server-side half (Astra HIGH on PRs 20/65): every decision is ALSO posted as the commit status `lens-gate` on the exact head
# (scripts/lens-gate-status.sh): success = eligible, pending = verdict missing or draft, failure = hold label or PR closed. The
# status is posted BEFORE the arm/disarm call. When the ruleset requires the context `lens-gate`, a new head cannot merge until the
# trusted workflow has posted success for that head, so a late, queued or missing run cannot let stale approval ride along.
# Exit: 0 = decision applied (including "nothing to do"); 1 = refused or error (best-effort disarm was attempted).
set -u
PR_URL="${1:-}"
OWNER_LOGIN="${OWNER_LOGIN:-aziwar}"
REPO="${GITHUB_REPOSITORY:-}"
FIELDS=headRefOid,isDraft,labels,comments,autoMergeRequest,state
STATE_SCHEMA='(.headRefOid|type=="string") and (.isDraft|type=="boolean") and (.state|type=="string") and has("autoMergeRequest")
  and (.labels|type=="array" and all(.[]; type=="object" and (.name|type=="string")))'
COMMENT_SCHEMA='(.comments|type=="array" and all(.[]; type=="object" and (.body|type=="string") and (.author|type=="object") and (.author.login|type=="string")))'

gh_merge() { # runs `gh pr merge` or only prints it
  if [ "${DRYRUN:-0}" = "1" ]; then echo "automerge-reconcile: dry run: gh pr merge $*"; return 0; fi
  gh pr merge "$@"
}
fail() { # fail closed: try to disarm, then exit 1
  echo "automerge-reconcile: REFUSED $*" >&2
  [ -n "$PR_URL" ] && gh_merge --disable-auto "$PR_URL" >/dev/null 2>&1
  exit 1
}
[ -n "$REPO" ] || { echo "automerge-reconcile: REFUSED GITHUB_REPOSITORY is not set" >&2; exit 1; }
[[ "$PR_URL" =~ ^https://github\.com/${REPO}/pull/[0-9]+$ ]] || { echo "automerge-reconcile: REFUSED pr_url must be https://github.com/${REPO}/pull/<n>" >&2; exit 1; }

post_gate() { # posts lens-gate for $HEAD from the last evaluate(); failing to post is a refusal (never arm without it)
  bash "$(dirname "$0")/lens-gate-status.sh" "$HEAD" "$GATE" "$WHY" >/dev/null || fail "could not post the lens-gate status"
}

# evaluate <PR JSON>: sets HEAD, ARMED (true|false), ELIGIBLE (1|0), WHY. Any parse problem calls fail().
evaluate() {
  local J="$1" STATE DRAFT HOLD RISKS NEED FABLE ASTRA
  printf '%s' "$J" | jq -e "$STATE_SCHEMA" >/dev/null || fail "PR JSON does not have the expected schema (fail closed)"
  printf '%s' "$J" | jq -e "$COMMENT_SCHEMA" >/dev/null || fail "PR comments do not have the expected schema (fail closed)"
  HEAD=$(printf '%s' "$J" | jq -r '.headRefOid') || fail "cannot parse headRefOid"
  [[ "$HEAD" =~ ^[0-9a-f]{40}$ ]] || fail "headRefOid is not a full SHA"
  ARMED=$(printf '%s' "$J" | jq -r '.autoMergeRequest != null') || fail "cannot parse autoMergeRequest"
  STATE=$(printf '%s' "$J" | jq -r '.state') || fail "cannot parse state"
  DRAFT=$(printf '%s' "$J" | jq -r '.isDraft') || fail "cannot parse isDraft"
  HOLD=$(printf '%s' "$J" | jq -r '[.labels[].name | select(. == "no-automerge" or . == "needs:owner-yes")] | join(",")') || fail "cannot parse labels"
  RISKS=$(printf '%s' "$J" | jq -r '[.labels[].name | select(. == "risk:LOW" or . == "risk:NORMAL" or . == "risk:HIGH")] | join(",")') || fail "cannot parse risk labels"
  case ",$RISKS," in *,risk:HIGH,*) NEED=HIGH ;; *,risk:NORMAL,*) NEED=NORMAL ;; *,risk:LOW,*) NEED=LOW ;; *) NEED=NORMAL ;; esac
  ELIGIBLE=0
  GATE=pending
  WHY=""
  if [ "$NEED" = LOW ] && [ "${LOW_NEEDS_CHECK:-0}" = "1" ] && [ "$STATE" = "OPEN" ]; then
    CHECKS=$(gh api "repos/${REPO}/commits/${HEAD}/check-runs" --jq '[.check_runs[] | select(.status == "completed" and .conclusion == "success")] | length' 2>/dev/null) || CHECKS=0
    [[ "$CHECKS" =~ ^[0-9]+$ ]] || CHECKS=0
    if [ "$CHECKS" -lt 1 ]; then NEED=NORMAL; WHY="risk:LOW has no successful check run on this head, treated as NORMAL; "; fi
  fi
  if [ "$STATE" != "OPEN" ]; then GATE=failure; WHY="PR is not open ($STATE)"
  elif [ "$DRAFT" != "false" ]; then WHY="PR is a draft"
  elif [ -n "$HOLD" ]; then GATE=failure; WHY="hold label present: $HOLD"
  else
    FABLE=$(printf '%s' "$J" | jq -r --arg u "$OWNER_LOGIN" --arg s "$HEAD" '[.comments[] | select(.author.login == $u) | select(.body | test("^\\s*lens-verdict: fable PASS " + $s + "\\s*$"))] | length') || fail "cannot parse comments"
    ASTRA=$(printf '%s' "$J" | jq -r --arg u "$OWNER_LOGIN" --arg s "$HEAD" '[.comments[] | select(.author.login == $u) | select(.body | test("^\\s*lens-verdict: astra PASS " + $s + "\\s*$"))] | length') || fail "cannot parse comments"
    if [ "$NEED" = LOW ]; then ELIGIBLE=1; GATE=success; WHY="risk:LOW needs no lens verdict"
    elif [ "$FABLE" -lt 1 ]; then WHY="${WHY}risk $NEED needs 'lens-verdict: fable PASS $HEAD' by $OWNER_LOGIN on the current head"
    elif [ "$NEED" = HIGH ] && [ "$ASTRA" -lt 1 ]; then WHY="${WHY}risk HIGH also needs 'lens-verdict: astra PASS $HEAD' by $OWNER_LOGIN on the current head"
    else ELIGIBLE=1; GATE=success; WHY="risk $NEED lens verdicts present on $HEAD"; fi
  fi
}

J=$(gh pr view "$PR_URL" --json "$FIELDS") || fail "cannot read the PR"
evaluate "$J"
if [ "$ELIGIBLE" = 1 ] && [ "$ARMED" = false ]; then
  # re-read right before arming: a hold label, risk change, new head or comment change after the first read must be seen
  FIRST_HEAD="$HEAD"
  J2=$(gh pr view "$PR_URL" --json "$FIELDS") || fail "cannot re-read the PR before arming"
  evaluate "$J2"
  [ "$HEAD" = "$FIRST_HEAD" ] || fail "head moved between the checks; run again"
  if [ "$ELIGIBLE" = 1 ] && [ "$ARMED" = false ]; then
    post_gate
    gh_merge --auto --squash --match-head-commit "$HEAD" "$PR_URL" || fail "gh pr merge --auto failed"
    echo "automerge-reconcile: ARMED $PR_URL at $HEAD ($WHY)"; exit 0
  fi
fi
post_gate
if [ "$ELIGIBLE" = 1 ]; then echo "automerge-reconcile: KEEP armed ($WHY)"; exit 0; fi
if [ "$ARMED" = true ]; then
  gh_merge --disable-auto "$PR_URL" || fail "gh pr merge --disable-auto failed"
  if [ "${DRYRUN:-0}" != "1" ]; then
    J3=$(gh pr view "$PR_URL" --json "$FIELDS") || fail "cannot confirm the disarm"
    [ "$(printf '%s' "$J3" | jq -r '.autoMergeRequest != null')" = false ] || fail "auto-merge is still armed after the disarm"
  fi
  echo "automerge-reconcile: DISARMED $PR_URL ($WHY)"; exit 0
fi
echo "automerge-reconcile: NOT ARMED, nothing to do ($WHY)"; exit 0
