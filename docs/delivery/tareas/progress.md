# Progreso – tareas

> Lo escriben los agentes en `/build`, al terminar cada tarea. Es lo primero que lee una sesión nueva para retomar el trabajo.

## Estado

| Tareas | Passing | Failing | Blocked |
|---|---|---|---|
| 11 | 3 | 8 | 0 |

## Bloqueos

Lo que contradice la spec o el plan, o un test que parece mal. No se improvisa: se resuelve volviendo a G1 o G2.

| # | Tarea | Qué pasa | Quién lo resuelve |
|---|---|---|---|

## Registro

<!-- Una entrada por tarea, la más reciente arriba:
### T-01 · <fecha> · <agente>
- **Hecho:**
- **Verificado con:**
- **Aprendido:**
- **Queda:**
-->

### T-03 · 01-11-2026 · developer
- **Hecho:** `index.html` nuevo (sin "Hola, mundo"), `src/styles.css` con tokens claro/oscuro y `src/app.js` con estado único, carga, lista, mensaje de vacío y aviso de lectura. Botones sin acción todavía; el foco tras redibujar queda preparado (`state.focus`).
- **Verificado con:** `npx playwright test e2e/tareas -g "CA-01:|CA-26:|CA-29:|smoke"` (5 en verde) y `scripts/check.sh` en verde.
- **Aprendido:** el aviso de lectura solo existe en el DOM cuando toca; el mensaje de vacío usa `hidden`.
- **Queda:** conectar añadir (T-04), completar, editar y borrar; estilos de edición y confirmación llegan con sus tareas.

### T-02 · 01-11-2026 · developer
- **Hecho:** `src/storage.js` (STORAGE_KEY, loadTasks, saveTasks) y `tests/unit/storage.test.js`.
- **Verificado con:** `node --test tests/unit/storage.test.js` (10 en verde) y `scripts/check.sh` en verde.
- **Aprendido:** loadTasks reutiliza isValidTaskList; sin clave da lista vacía legible y nunca escribe.
- **Queda:** nada.

### T-01 · 01-11-2026 · developer
- **Hecho:** `src/tasks.js` (addTask, editTask, setCompleted, removeTask, isValidTaskList, MAX_TEXT_LENGTH) y `tests/unit/tasks.test.js`.
- **Verificado con:** `node --test tests/unit/tasks.test.js` (15 en verde) y `scripts/check.sh` en verde.
- **Aprendido:** setCompleted con un id inexistente devuelve una copia sin cambios.
- **Queda:** nada.
