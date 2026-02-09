#!/usr/bin/env bash
set -euo pipefail

PATTERN='qwerty\.kaiyi\.cool|qwertylearner\.ai|qwerty-learner\.vercel\.app|kaiyiwing\.github\.io/qwerty-learner'

TARGETS=(
  "src"
  "public"
  "index.html"
  "README.md"
  "playwright.config.ts"
  ".github/workflows"
)

echo "Checking for legacy brand domains..."
if rg -n -S "$PATTERN" "${TARGETS[@]}"; then
  echo
  echo "Brand check failed: found legacy domains above."
  exit 1
fi

echo "Brand check passed."
