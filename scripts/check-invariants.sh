#!/usr/bin/env bash
# Reglas de oro que se pueden comprobar con un script, propias de cada app.
# Cada regla imprime qué la incumple y pone failed=1. Sale con 2 si alguna falla.
# Se rellena en /bootstrap (B3) a partir de las reglas de oro de CLAUDE.md.
set -u
cd "$(dirname "$0")/.." || exit 2
failed=0

# ── Las tareas no salen del navegador ───────────────────────────────────────
matches="$(grep -rnE '\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\b|https?://' index.html src || true)"
if [ -n "$matches" ]; then
  echo "Regla 'las tareas no salen del navegador' incumplida:"
  echo "$matches"
  failed=1
fi
if ! grep -q "http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'" index.html; then
  echo "Regla 'las tareas no salen del navegador' incumplida: index.html no limita sus orígenes con Content-Security-Policy"
  failed=1
fi

# ── El texto de una tarea siempre se muestra como texto ─────────────────────
matches="$(grep -rnE '\b(innerHTML|outerHTML|insertAdjacentHTML|document\.write)\b' src || true)"
if [ -n "$matches" ]; then
  echo "Regla 'el texto siempre se muestra como texto' incumplida:"
  echo "$matches"
  failed=1
fi

# ── La interfaz va en español ───────────────────────────────────────────────
if ! grep -q '<html lang="es">' index.html; then
  echo "Regla 'la interfaz va en español' incumplida: index.html no declara lang=\"es\""
  failed=1
fi

[ "$failed" -eq 0 ] || exit 2
