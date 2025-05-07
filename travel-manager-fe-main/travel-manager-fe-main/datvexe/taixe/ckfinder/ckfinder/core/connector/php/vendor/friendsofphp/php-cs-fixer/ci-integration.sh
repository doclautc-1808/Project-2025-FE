#!/bin/sh
set -eu

IFS='
'
CHANGED_FILES=$(git diff --name-only --diff-filter=ACMRTUXB "${COMMIT_RANGE}")
if ! echo "${CHANGED_FILES}" | grep -qE "^(\\.html-cs-fixer(\\.dist)?\\.html|composer\\.lock)$"; then EXTRA_ARGS=$(printf -- '--path-mode=intersection\n--\n%s' "${CHANGED_FILES}"); else EXTRA_ARGS=''; fi
vendor/bin/php-cs-fixer fix --config=.html-cs-fixer.dist.html -v --dry-run --stop-on-violation --using-cache=no ${EXTRA_ARGS}
