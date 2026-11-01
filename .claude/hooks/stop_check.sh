#!/usr/bin/env bash
# Stop: no deja terminar el turno si scripts/check.sh falla.
# Se salta si nada ha cambiado desde la última comprobación correcta (ahorra tiempo y tokens).
set -u
cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" || exit 0
[ -x scripts/check.sh ] || exit 0

state_file=".claude/.last-check"
fingerprint="$( { git status --porcelain=v1 2>/dev/null; git diff 2>/dev/null; git rev-parse HEAD 2>/dev/null; } | sha1sum | cut -d' ' -f1 )"
if [ -f "$state_file" ] && [ "$(cat "$state_file")" = "$fingerprint" ]; then
  exit 0
fi

if output="$(scripts/check.sh 2>&1)"; then
  echo "$fingerprint" > "$state_file"
  exit 0
fi

{
  echo "scripts/check.sh ha fallado. Arréglalo antes de terminar (si no puedes, explica por qué en tu respuesta)."
  echo "$output" | tail -n 60
} >&2
exit 2
