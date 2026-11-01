#!/usr/bin/env bash
# Arranca el entorno local: la app y una base de datos local con datos semilla, nunca producción.
# Se puede ejecutar varias veces sin romper nada. El comando vive en .claude/harness.json (init).
set -u
cd "$(dirname "$0")/.." || exit 1
cmd="$(python3 .claude/hooks/harness_config.py init)"
if [ -z "$cmd" ]; then
  echo "· init sin configurar (rellena 'init' en .claude/harness.json en /bootstrap)."
  exit 0
fi
echo "▶ $cmd"
bash -c "$cmd"
