#!/usr/bin/env bash
set -euo pipefail

FORENSIC_ID="${1:-manual}"
SELECTOR_TAG="${2:-selector-fix}"

BRANCH_NAME="healing/${FORENSIC_ID}/${SELECTOR_TAG}"

git checkout -b "${BRANCH_NAME}"
echo "${BRANCH_NAME}"
