#!/usr/bin/env bash
# Reglas de oro que se pueden comprobar con un script, propias de cada app.
# Cada regla imprime qué la incumple y pone failed=1. Sale con 2 si alguna falla.
# Se rellena en /bootstrap (B3) a partir de las reglas de oro de CLAUDE.md.
set -u
cd "$(dirname "$0")/.." || exit 2
failed=0

# ── Ejemplo: ningún porcentaje escrito a mano en la lógica de negocio ───────
# matches="$(grep -rnE '[0-9]+(\.[0-9]+)? ?%|0\.[0-9]+ \* ' src/lib/domain --include='*.ts' | grep -v '\.test\.ts' || true)"
# if [ -n "$matches" ]; then
#   echo "Regla 'ningún parámetro de negocio en el código' incumplida:"
#   echo "$matches"
#   failed=1
# fi

# ── Ejemplo: nada de floats para dinero ─────────────────────────────────────
# matches="$(grep -rnE 'parseFloat\(|toFixed\(' src/lib/domain --include='*.ts' || true)"
# [ -n "$matches" ] && { echo "Dinero con floats:"; echo "$matches"; failed=1; }

[ "$failed" -eq 0 ] || exit 2
