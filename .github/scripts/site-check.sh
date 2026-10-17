#!/usr/bin/env bash
# Production smoke checks for https://www.zewar.xyz
# Usage: .github/scripts/site-check.sh [base_url]
# Env:   RETRY_DELAY (seconds, default 30)  - wait before the single retry of a failing check
#        GITHUB_OUTPUT (optional)           - receives failed=<names> and ok=<true|false>
# Exit:  0 all checks pass, 1 any check failed after its retry.
set -uo pipefail

BASE="${1:-${SITE_URL:-https://www.zewar.xyz}}"
BASE="${BASE%/}"
RETRY_DELAY="${RETRY_DELAY:-30}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# fetch <url> -> writes body to $TMP/body, headers to $TMP/headers; prints "code|content_type"
fetch() {
  curl -sS -L --max-time 30 --retry 2 --retry-delay 3 --retry-all-errors \
    -A "zewar-site-monitor/1.0 (+https://github.com/aziwar/AZ-Digital-Hub)" \
    -H 'Cache-Control: no-cache' \
    -o "$TMP/body" -D "$TMP/headers" \
    -w '%{http_code}|%{content_type}' "$1" 2>"$TMP/err" || echo "000|"
}

# expect_page <path> <title-substring> <description-substring>
check_page() {
  local res code
  res="$(fetch "$BASE$1")"; code="${res%%|*}"
  [[ "$code" == 200 ]] || { echo "HTTP $code"; return 1; }
  local title desc
  title="$(tr '\n' ' ' <"$TMP/body" | grep -o '<title[^>]*>[^<]*</title>' | head -1 | sed -E 's/<[^>]+>//g')"
  desc="$(tr '\n' ' ' <"$TMP/body" | grep -oE '<meta name="description" content="[^"]*"' | head -1 | sed -E 's/.*content="//; s/"$//')"
  [[ "$title" == *"$2"* ]] || { echo "title '$title' missing '$2'"; return 1; }
  [[ -n "$desc" && "$desc" == *"$3"* ]] || { echo "meta description '${desc:0:80}' missing '$3'"; return 1; }
  echo "200, title ok"
}

check_status() { # <path> <content-type-prefix (optional)>
  local res code ctype
  res="$(fetch "$BASE$1")"; code="${res%%|*}"; ctype="${res#*|}"
  [[ "$code" == 200 ]] || { echo "HTTP $code"; return 1; }
  [[ -z "${2:-}" || "$ctype" == "$2"* ]] || { echo "content-type '$ctype' != $2"; return 1; }
  echo "200 $ctype"
}

check_health() {
  check_status /api/health application/json >/dev/null || { check_status /api/health application/json; return 1; }
  local status
  status="$(grep -oE '"status":"[a-z_]+"' "$TMP/body" | head -1 | cut -d'"' -f4)"
  [[ "$status" == ok || "$status" == degraded ]] || { echo "unexpected status '$status'"; return 1; }
  echo "200 status=$status"
}

CHECKS=(
  "en-page|check_page /en 'Ahmed Ziwar' 'Kuwait'"
  "ar-page|check_page /ar 'أحمد زيور' 'الكويت'"
  "og-image|check_status /en/opengraph-image image/png"
  "sitemap|check_status /sitemap.xml"
  "robots|check_status /robots.txt"
  "health|check_health"
)

failed=()
run_check() { # <name> <cmd> <final:0|1>
  local out
  if out="$(eval "$2")"; then
    printf 'PASS  %-9s %s\n' "$1" "$out"; return 0
  fi
  printf '%s  %-9s %s\n' "$([[ $3 == 1 ]] && echo FAIL || echo WARN)" "$1" "$out"
  return 1
}

pending=()
for entry in "${CHECKS[@]}"; do
  name="${entry%%|*}"; cmd="${entry#*|}"
  run_check "$name" "$cmd" 0 || pending+=("$entry")
done

if ((${#pending[@]})); then
  echo "Retrying ${#pending[@]} failing check(s) in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
  for entry in "${pending[@]}"; do
    name="${entry%%|*}"; cmd="${entry#*|}"
    run_check "$name" "$cmd" 1 || failed+=("$name")
  done
fi

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  { echo "failed=${failed[*]}"; echo "ok=$([[ ${#failed[@]} -eq 0 ]] && echo true || echo false)"; } >>"$GITHUB_OUTPUT"
fi

if ((${#failed[@]})); then
  echo "RESULT: ${#failed[@]} failing: ${failed[*]}"
  exit 1
fi
echo "RESULT: all ${#CHECKS[@]} checks passed against $BASE"
