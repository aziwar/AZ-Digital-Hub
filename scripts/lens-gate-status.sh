#!/usr/bin/env bash
# Posts the commit status `lens-gate` on one exact head SHA (ticket 7398cd8d, Astra HIGH on PRs 20 and 65).
# usage: lens-gate-status.sh <full 40-hex sha> <success|pending|failure> <description>      (env DRYRUN=1 only prints)
# Why: a commit status belongs to ONE sha. When the ruleset requires the context `lens-gate`, a new head has no status until the
# trusted workflow posts one, so it cannot merge on stale approval, whether or not the reconcile run is late, queued or missing.
# Without that ruleset requirement the status is informational only (see the PR body for the one command that turns it on).
set -u
SHA="${1:-}"; STATE="${2:-}"; DESC="${3:-}"
REPO="${GITHUB_REPOSITORY:-}"
[ -n "$REPO" ] || { echo "lens-gate-status: REFUSED GITHUB_REPOSITORY is not set" >&2; exit 1; }
[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "lens-gate-status: REFUSED sha must be 40 hex" >&2; exit 1; }
case "$STATE" in success|pending|failure) ;; *) echo "lens-gate-status: REFUSED state must be success, pending or failure" >&2; exit 1 ;; esac
DESC="${DESC//$'\n'/ }"; DESC="${DESC:0:140}"
if [ "${DRYRUN:-0}" = "1" ]; then echo "lens-gate-status: dry run: $STATE on $SHA ($DESC)"; exit 0; fi
gh api -X POST "repos/${REPO}/statuses/${SHA}" -f state="$STATE" -f context="lens-gate" -f description="$DESC" >/dev/null \
  || { echo "lens-gate-status: REFUSED could not post the status" >&2; exit 1; }
echo "lens-gate-status: $STATE on $SHA"
