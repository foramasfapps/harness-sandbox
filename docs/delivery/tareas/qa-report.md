# Informe de QA – tareas

> Estado: Borrador (verificación parcial) · Lo escribe QA al final de `/build`. Fecha: 01-11-2026 · Rama: `feature/tareas` · Commit: 2d7a17e
> Alcance: solo T-01, T-02, T-03 y T-04 (15 de los 49 CA). Los otros 34 CA son de tareas sin construir y quedan sin evaluar.
> Veredicto: Con fallos

| Tarea | Resultado | Motivo |
|---|---|---|
| T-01 | Pasa | 15 tests unitarios en verde; cumplen lo que pide su `verify`. |
| T-02 | Pasa | 10 tests unitarios en verde. Los suyos no comprobaban "nada escribe al leer" con `[]` ni con una lista válida; el código lo cumple y ahora lo cubre un test nuevo. |
| T-03 | **Falla** | CA-29 no se cumple en un navegador completo: hay un error en consola (fallo 1). |
| T-04 | Pasa, con fallos | Sus 12 CA pasan. Quedan 1 fallo medio compartido con T-03, 1 medio que debe resolver T-09 y varios bajos. |

## Criterios de aceptación

| CA | Nivel | Resultado | Prueba | Pasos para reproducir (si falla) |
|---|---|---|---|---|
| CA-01 | e2e | Pasa | `e2e/tareas/carga.spec.js` | — |
| CA-02 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-03 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-04 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-05 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-06 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-07 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-08 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-26 | e2e | Pasa | `e2e/tareas/carga.spec.js` | — |
| CA-27 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-29 | e2e | **Falla** | `e2e/tareas/consola-navegador-completo.spec.js` (en rojo); los dos de `carga.spec.js` pasan | Se abre la página con Chromium completo (`channel: "chromium"`) y `tasks.v1` con cualquiera de los 10 valores. Se espera una consola sin errores. Se obtiene `Failed to load resource: 404` en `/favicon.ico`: `index.html` no declara icono y el navegador lo pide. |
| CA-42 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-43 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-46 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-49 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |

Resultado de las ejecuciones:

- `scripts/check.sh`: en verde, con 27 tests unitarios e invariantes.
- `verify` de T-03: 5 pasan y 1 falla, el test nuevo de CA-29.
- `verify` de T-04: 12 pasan.
- `npx playwright test`: 21 pasan y 44 fallan. De los 44, 35 son de T-05 a T-11, sin construir, y 9 son tests nuevos de este informe.

## Revisión del código frente a los criterios

**Tests de aceptación.** Ningún archivo de `e2e/` confirmado ha cambiado desde `729aff1`: no se han debilitado.

**Fallos inyectados.** Para ver si los tests detectan errores de verdad, se cambió la app en memoria, sin tocar archivos:

| Tests | Cambios inyectados | Detectados | Sin detectar |
|---|---|---|---|
| e2e de T-03 y T-04 | 31 | 29 | 2: quitar el foco tras un rechazo (DP-02) y dar a todas las tareas el mismo `id` |
| Unitarios de T-01 y T-02 | 16 | 12 | 4 (ver abajo) |

Los huecos que eran reales están cerrados con tests nuevos, que hoy pasan y detectan esos cambios:

- **`id` repetido:** CA-08 añade una sola tarea sobre otra con `id` `t1`, así que no lo veía. Sería grave: con dos `id` iguales, toda la lista pasa a ser ilegible al recargar (RN-12).
- **DP-02:** solo lo comprobaba un test de CA-28, hoy en rojo por otros motivos.
- **Escribir al leer con `[]` o con una lista válida:** dos de los 4 unitarios sin detectar.

Los otros 2 unitarios no son huecos de la app:

- Quitar el `try` interno de `getStore()` no cambia nada, porque `loadTasks` y `saveTasks` ya tienen el suyo.
- Cambiar `STORAGE_KEY` no lo ve `storage.test.js` porque importa la constante. Los e2e usan el texto `tasks.v1`, así que deberían verlo, aunque ese cambio no se ejecutó contra ellos.

**Los tests en rojo se pueden poner en verde.** Con los arreglos aplicados en memoria pasan los 10 tests nuevos que existían entonces y los 17 de T-03 y T-04.

**Reglas y decisiones mal aplicadas:**

- `src/app.js:125` pone `state.readable = true` antes de guardar y sin mirar lo que devuelve `saveTasks` (línea 126). RN-13 solo permite quitar el aviso con un cambio guardado con éxito (fallo 2).
- `index.html:14` escribe `maxlength="200"` a mano. La decisión 6 de `plan.md` pide tomarlo de `MAX_TEXT_LENGTH`, para que el 200 esté en un solo sitio (fallo 9).
- `index.html:18`: el contenedor de avisos existe, pero no se anuncia a los lectores de pantalla, como pide DP-06 (fallo 3).

**Sin fallos.** RN-01 y RN-05 en `addTask`; RN-02 a RN-04 en `setCompleted` y `editTask`; RN-12 en `isValidTaskList`; solo `storage.js` toca `localStorage`; el texto se inserta con `textContent`. No queda "Hola, mundo" en la app.

**Riesgos de `plan.md` comprobados:**

- `preventDefault()` no choca con `form-action 'none'`: al añadir no hay errores de la política de seguridad, tampoco en el navegador completo.
- `maxlength` no parte un emoji al pegar: 101 emojis dan 100 enteros (longitud 200, sin mitades).

## Prueba exploratoria

Se probó con el árbol de accesibilidad y estilos calculados, a 1280 y 360 px, en modo claro y oscuro. `scripts/init.sh` no arranca la app en este proyecto (instala dependencias), así que se usó el mismo servidor de `npm run dev` en otro puerto.

| Qué se probó | Resultado |
|---|---|
| Árbol de accesibilidad con datos, vacío y con avisos | Nombres de casilla, "Editar" y "Borrar" correctos. Queda una lista vacía "Tareas" (fallo 7) y ninguna región que anuncie avisos (fallo 3). |
| Foco tras añadir y tras rechazo, con ratón e Intro | Siempre en el campo, con contorno de 2 px en `--accent` y 2 px de separación. |
| Orden de tabulación | "Añadir", casilla, "Editar", "Borrar", como en `flows.md`. |
| Abrir la página o un rechazo sin clave guardada | `tasks.v1` sigue sin existir. |
| Ilegible con `setItem` fallando y almacenamiento bloqueado | Desaparece el aviso de lectura y no aparece ninguno (fallo 2). |
| `<img src=x onerror=alert(1)>` y comillas | Texto literal, 0 elementos `img`. |
| Solo tabulador, espacio duro (U+00A0) o espacio ideográfico (U+3000) | Se rechaza, con el mensaje de error. |
| Pegar texto con saltos de línea | Quedan espacios en su lugar: "uno dos tres". |
| 2000 tareas guardadas | Cargan en 70 ms, y añadir una más funciona. |
| Tarea con un campo extra, y clave con texto vacío | La primera se acepta. La segunda da el aviso de lectura y conserva la clave. |
| 360 px con 200 "a" | `scrollWidth` 360; controles de al menos 44 px de alto. Captura: `docs/delivery/tareas/qa/movil-oscuro-360.png`. |
| Error y aviso a la vez | Captura: `docs/delivery/tareas/qa/error-y-aviso-escritorio.png`. |

**Sin comprobar:**

- Safari en iOS, aceptado en `plan.md`.
- Un lector de pantalla real: solo se miraron los atributos.
- CA-28 y CA-45: sus tests siguen en rojo porque necesitan editar y borrar. Aquí solo se miró a mano la fila normal.

**Para decidir, sin contarlos como fallos porque el PRD no los define:**

| Qué pasa | Decisión pendiente |
|---|---|
| Pegar solo caracteres invisibles de ancho cero (U+200B) crea una tarea que se ve en blanco. RN-05 habla de espacios y este carácter no lo es, pero choca con el espíritu de "ninguna tarea queda sin texto". | PM: ¿se rechazan? |
| En modo oscuro, la casilla sin marcar es un cuadro blanco de 44 px, porque no se declara `color-scheme` y `states.md` no define su color. | UX: ¿se ajusta en T-11? |
| Dos Intro seguidos añaden la tarea y después muestran el error de texto vacío. Es coherente con RN-06. | Ninguna, salvo que moleste. |

**Previsto, de tareas sin construir:** un fallo de guardado no avisa hasta T-09, y la casilla cambia de aspecto sin guardar hasta T-05, porque `app.js` aún no la atiende.

## Fallos por gravedad

| # | Gravedad | Qué pasa | CA | Test nuevo que lo cubre |
|---|---|---|---|---|
| 1 | Alto | En un navegador completo, cada apertura da un error en consola: 404 en `/favicon.ico`. Los tests no lo veían porque el Chromium reducido por defecto no pide el icono. Un icono `data:` tampoco sirve: lo bloquea la política de seguridad (comprobado). | CA-29 | `e2e/tareas/consola-navegador-completo.spec.js` |
| 2 | Medio | Con datos ilegibles y un guardado que falla, se espera ver los dos avisos. Hoy desaparece el de lectura y no sale ninguno, aunque `tasks.v1` sigue valiendo `no-es-json` y la tarea se perderá al recargar. Lo debe resolver T-09: CA-30, de esa tarea, también falla por esto. | RN-13, CA-30 | `hallazgos-qa.spec.js`, "RN-13: …" |
| 3 | Medio | Ni el error de añadir ni el aviso de lectura se anuncian: hay 0 elementos con `aria-live`, `role="alert"` o `role="status"`. Ninguna tarea cubre DP-06, así que nadie lo resolverá si no se asigna. | DP-06 | `hallazgos-qa.spec.js`, "DP-06: …" |
| 4 | Bajo | Con el aviso de lectura visible, el error de añadir sale debajo de él (en y = 174 px, frente a 122 px del aviso), no justo bajo el formulario. | `flows.md` | `hallazgos-qa.spec.js`, "flows.md: …" |
| 5 | Bajo | El campo con error tiene borde de 1 px en lugar de 2 px (`src/styles.css:167`), y el mensaje no tiene icono. | `states.md` | `hallazgos-qa.spec.js`, "states.md: the field …" |
| 6 | Bajo | El aviso de lectura es texto en `--warn`, sin borde, fondo ni icono. Se pedía un bloque con borde de 1 px en `--warn`, fondo `--surface`, icono y texto en `--fg` (`src/styles.css:103`). | `states.md` | `hallazgos-qa.spec.js`, "states.md: the read warning …" |
| 7 | Bajo | Sin tareas, la lista vacía "Tareas" sigue en el árbol de accesibilidad, cuando el mensaje debe ir "en lugar de la lista". | `states.md` | `hallazgos-qa.spec.js`, "states.md: with no tasks …" |
| 8 | Bajo | En modo oscuro, el texto de ayuda tiene un contraste de 3,58:1 (`#757575` sobre `#1B1F27`), por debajo del 4,5:1 exigido. En modo claro cumple. | `design-system.md` | `hallazgos-qa.spec.js`, "design-system.md: … dark mode" |
| 9 | Bajo | El límite de 200 está escrito a mano en `index.html:14`. Al cambiar `MAX_TEXT_LENGTH` a 10, el campo sigue admitiendo 200. | Decisión 6 de `plan.md` | `hallazgos-qa.spec.js`, "plan.md decision 6: …" |

Gravedad: **Crítico** (dato incorrecto o pérdida de datos) · **Alto** (un CA no se cumple) · **Medio** (caso límite o error mal tratado) · **Bajo** (molestia sin efecto en datos).
