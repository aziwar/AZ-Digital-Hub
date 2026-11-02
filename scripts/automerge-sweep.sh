#!/usr/bin/env bash
# Bounded reconciliation of every open PR against the default branch (ticket 7398cd8d, Astra MEDIUM + the "maintenance" half of HIGH).
# usage: automerge-sweep.sh        env: GITHUB_REPOSITORY (owner/name), DEFAULT_BRANCH, GH_TOKEN; DRYRUN=1 for the reconcile calls
# Runs from the scheduled workflow: re-evaluates PRs whose state changed without an event the workflow listens to (a comment
# deleted, a check that finished later, a missed run). Dependabot PRs are never armed: they only get lens-gate=success so a required
# lens-gate context cannot block them (their own gate is the repo's existing checks).
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="${GITHUB_REPOSITORY:-}"; BASE="${DEFAULT_BRANCH:-}"
[ -n "$REPO" ] && [ -n "$BASE" ] || { echo "automerge-sweep: REFUSED GITHUB_REPOSITORY and DEFAULT_BRANCH are required" >&2; exit 1; }
LIST=$(gh pr list --repo "$REPO" --state open --base "$BASE" --limit 1000 --json url,headRefOid,author) || { echo "automerge-sweep: REFUSED cannot list the PRs" >&2; exit 1; }
printf '%s' "$LIST" | jq -e 'type=="array" and all(.[]; (.url|type=="string") and (.headRefOid|type=="string") and (.author|type=="object") and (.author.login|type=="string") and (.author.is_bot|type=="boolean"))' >/dev/null \
  || { echo "automerge-sweep: REFUSED unexpected PR list schema (fail closed)" >&2; exit 1; }
[ "$(printf '%s' "$LIST" | jq 'length')" -lt 1000 ] || { echo "automerge-sweep: REFUSED 1000 or more open PRs: list may be truncated (fail closed)" >&2; exit 1; }
bad=0; n=0
while IFS=$'\t' read -r url head login is_bot; do
  [ -n "$url" ] || continue
  n=$((n+1))
  # Exact Dependabot identity as gh returns it (verified live: {"is_bot":true,"login":"app/dependabot"}); lookalike logins are reconciled normally.
  if [ "$is_bot" = "true" ] && [ "$login" = "app/dependabot" ]; then
    bash "$HERE/lens-gate-status.sh" "$head" success "dependabot PR: never armed by the lens gate" || bad=$((bad+1))
  else
    bash "$HERE/automerge-reconcile.sh" "$url" || bad=$((bad+1))
  fi
done < <(printf '%s' "$LIST" | jq -r '.[] | [.url, .headRefOid, .author.login, (.author.is_bot|tostring)] | @tsv' | tr -d '\015')
echo "automerge-sweep: $n PR(s) checked, $bad failure(s)"
[ "$bad" -eq 0 ]
