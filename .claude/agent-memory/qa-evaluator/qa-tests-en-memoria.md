---
name: qa-tests-en-memoria
description: Cómo inyectar fallos y probar que un test en rojo puede ponerse en verde cuando el arnés no deja a QA escribir fuera de e2e/, tests/acceptance/ y docs/delivery/
metadata:
  type: feedback
---

El hook `scope_guard.py` bloquea a QA cualquier escritura fuera de `tests/acceptance/`, `e2e/` y `docs/delivery/`, también en el scratchpad. No se rodea con `cat >` desde Bash: se trabaja sin archivos.

**Why:** en `tareas` (01-11-2026), el Write al scratchpad falló en la verificación final. Sustituye al consejo de usar una app desechable en el scratchpad de [[playwright-test-traps]]: esa copia ya no se puede crear con Write.

**How to apply:**
- Los scripts de exploración van por entrada estándar: `node - <<'EOF'`. Se carga Playwright con `require("<raíz>/node_modules/playwright")`.
- Para inyectar fallos en e2e: un servidor `http` dentro de ese mismo script, en el puerto 4173, que lee los archivos del proyecto y aplica el cambio al servirlos. `playwright.config.js` reutiliza ese servidor si `CI` no está definido.
- Lanza Playwright con `spawn` asíncrono, nunca con `spawnSync`: este bloquea el proceso y el servidor de ese mismo script deja de responder. Con `--reporter=json` se leen de stdout los títulos en rojo, y se resta la línea base.
- Para los tests unitarios: `node --import "data:text/javascript,..."` con `registerHooks` de `node:module`, que cambia el código al cargarlo.
- La misma técnica sirve para demostrar que un test nuevo en rojo puede ponerse en verde: se sirve la app con el arreglo aplicado en memoria. Prueba también un arreglo a medias (un solo camino) para ver que el test lo sigue marcando en rojo.
- Con `| tail` en la orden, la salida no aparece hasta el final. 51 fallos sobre unos 50 tests tardan bastante más de 10 minutos: lánzalo en segundo plano desde el principio y sin `tail`.
- Las capturas van a `docs/delivery/<feature>/qa/`.
