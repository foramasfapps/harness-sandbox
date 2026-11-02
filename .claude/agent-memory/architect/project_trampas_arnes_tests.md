---
name: trampas-arnes-tests
description: Por qué los tests de aceptación en rojo no pueden ir en tests/acceptance y qué no comprueba check.sh en esta app
metadata:
  type: project
---

`npm test` ejecuta `tests/**`, así que un test de aceptación en rojo en `tests/acceptance/` deja `scripts/check.sh` en rojo y el Developer no puede terminar ninguna tarea. `check.sh` no ejecuta Playwright, de modo que `e2e/` sí admite rojo, pero "check.sh en verde" no demuestra ningún CA de pantalla.

**Why:** detectado al planificar `tareas` (01-11-2026, pendiente de G2). La tabla de Tests de `docs/architecture/README.md` todavía pone la aceptación en `tests/acceptance/`.

**How to apply:** al planificar, los CA que aún no pueden pasar van en `e2e/<feature>/`, cada CA se asigna a la tarea en la que puede ponerse en verde, y `verify` ejecuta Playwright por ID (`-g "CA-03:"`). Vuelve a comprobarlo si cambia `checks.test` en `.claude/harness.json`.
