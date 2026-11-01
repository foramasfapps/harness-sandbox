#!/usr/bin/env bash
# Comprueba todo: tipos, lint, tests e invariantes. Lo usan el hook Stop, la CI y las personas.
# Los comandos viven en .claude/harness.json (checks.*). Un comando vacío se salta con aviso.
# Sale con 0 si todo pasa y con 2 si algo falla.
set -u
cd "$(dirname "$0")/.." || exit 2
cfg() { python3 .claude/hooks/harness_config.py "$1"; }

failed=0
for name in typecheck lint test; do
  cmd="$(cfg "checks.$name")"
  if [ -z "$cmd" ]; then
    echo "· $name: sin configurar (rellena checks.$name en .claude/harness.json)"
    continue
  fi
  echo "▶ $name: $cmd"
  if ! bash -c "$cmd"; then
    echo "✗ $name ha fallado"
    failed=1
  fi
done

echo "▶ invariantes: scripts/check-invariants.sh"
if ! scripts/check-invariants.sh; then
  echo "✗ invariantes incumplidas"
  failed=1
fi

if [ "$failed" -ne 0 ]; then
  exit 2
fi
echo "✓ todo en verde"
