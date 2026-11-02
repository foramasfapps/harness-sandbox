# Informe de QA – tareas

> Lo escribe QA al final de `/build`. Fecha: 02-11-2026 · Rama: `feature/tareas` · Commit: 3dfaa0c
> Alcance: verificación final, completa: las 11 tareas y los 49 CA. Las verificaciones parciales 1 y 2 quedan más abajo como historial.
> Veredicto: **Aprobado**. Los 49 CA pasan, cada uno con un test que lo comprueba de verdad, y no queda ningún fallo abierto, ni crítico ni alto ni de otra gravedad. Quedan 6 decisiones para la persona, que el PRD no define y no cuento como fallos.

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
| CA-09 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-10 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-11 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-12 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-13 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-14 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-15 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-16 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-17 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-18 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-19 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-20 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-21 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-22 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-23 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-24 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-25 | e2e | Pasa | `e2e/tareas/fallos-guardado.spec.js` | — |
| CA-26 | e2e | Pasa | `e2e/tareas/carga.spec.js` | — |
| CA-27 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-28 | e2e | Pasa | `e2e/tareas/teclado-accesibilidad.spec.js` (2 tests: el recorrido del CA y el resto de RN-15) | — |
| CA-29 | e2e | Pasa | `e2e/tareas/carga.spec.js` y `consola-navegador-completo.spec.js` (Chromium completo) | — |
| CA-30 | e2e | Pasa | `e2e/tareas/fallos-guardado.spec.js` | — |
| CA-31 | e2e | Pasa | `e2e/tareas/fallos-guardado.spec.js` | — |
| CA-32 | e2e | Pasa | `e2e/tareas/fallos-guardado.spec.js` | — |
| CA-33 | e2e | Pasa | `e2e/tareas/una-fila-abierta.spec.js` | — |
| CA-34 | e2e | Pasa | `e2e/tareas/una-fila-abierta.spec.js` | — |
| CA-35 | e2e | Pasa | `e2e/tareas/una-fila-abierta.spec.js` | — |
| CA-36 | e2e | Pasa | `e2e/tareas/una-fila-abierta.spec.js` y `hallazgos-qa-filas.spec.js` ("RN-09: …") | — |
| CA-37 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-38 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-39 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-40 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-41 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-42 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-43 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-44 | e2e | Pasa | `e2e/tareas/movil.spec.js` (fila normal, en edición y en confirmación) | — |
| CA-45 | e2e | Pasa | `e2e/tareas/teclado-accesibilidad.spec.js` | — |
| CA-46 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |
| CA-47 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-48 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-49 | e2e | Pasa | `e2e/tareas/anadir.spec.js` | — |

Resultado de las ejecuciones:

- `scripts/check.sh`: en verde, con 27 tests unitarios e invariantes.
- `npx playwright test`: 94 pasan y 0 fallan. Son los 91 que había y 3 nuevos de esta verificación (`e2e/tareas/hallazgos-qa-final.spec.js`).
- `verify` de T-03 a T-11: con `--list` se comprobó que cada filtro selecciona sus tests (6, 12, 5, 12, 6, 4, 4, 3 y 1) y ninguno de los nuevos.
- Los 3 tests nuevos se anotan en `acceptance_tests` de T-09 y T-11. Como no citan ningún CA, el `verify` de esas tareas no los ejecuta: se lanzan por archivo, por ejemplo `npx playwright test e2e/tareas/hallazgos-qa-final.spec.js`.
- Los 14 fallos de las verificaciones parciales están arreglados, y sus tests pasan: los 9 de la verificación 1 y los 5 de la verificación 2.

## Revisión del código frente a los criterios

**Tests de aceptación.** Ningún archivo de `e2e/` ni de `tests/` ha cambiado desde el último commit de QA (`5ff73d2`). Entre `5ff73d2` y `3dfaa0c` solo cambian `src/app.js`, `src/styles.css`, `index.html`, `progress.md` y el `status` de T-09, T-10 y T-11 en `tasks.json`. No se han debilitado. Los tests de los 7 CA que aún no tenían código en la verificación 2 (CA-25, CA-28, CA-30, CA-31, CA-32, CA-44 y CA-45) comprueban las cifras exactas del PRD: las cuatro listas de CA-25 tras cada paso, los dos avisos y su orden en CA-30, la lista al recargar en CA-31 y CA-32, `activeElement` y `outline-style` tras cada tecla en CA-28, `scrollWidth` ≤ 360 en CA-44, y los nombres completos en CA-45.

**Fallos inyectados.** Se cambió la app en memoria, sin tocar archivos, con 23 cambios en lo que construyeron T-09 a T-11 (`persist()`, la fila en edición reutilizada, los avisos, `index.html` y las reglas nuevas de `src/styles.css`), y se ejecutó la suite completa de `e2e/tareas`:

| Detectados por | Cambios |
|---|---|
| Los CA y los tests que ya había | 16 |
| Nadie, pero sin efecto observable | 2: no actualizar el valor de la fila reutilizada y no vaciar la caché al cerrar (el valor ya está al día y la fila se rehace al reabrir) |
| Nadie: huecos reales | 5 (ver abajo) |

Los 5 huecos los cumple la app hoy, pero un cambio futuro podría romperlos sin que nadie lo viera:

- **El aviso de guardado sin `role="status"`.** No se anunciaría (DP-06).
- **Los avisos de guardado y de lectura se rehacen en cada redibujado.** Se anunciarían otra vez en cada acción. Solo se probaba con los errores de añadir y de edición.
- **El aviso de guardado sin su estilo de bloque.** `states.md` pide el mismo bloque que el de lectura. Solo se comprobaba el de lectura.
- **El punto de corte de 480 px.** Con los botones de la fila o de la edición a la derecha desde 900 px, ningún test lo veía: el único test mide a 1280 px.
- **El error de edición a la derecha del campo, desde 480 px.** `states.md` lo pide debajo del campo.

Los tres tests nuevos de `hallazgos-qa-final.spec.js` pasan hoy y detectan esos 5 cambios y 4 más (puntos de corte de 470 y 900 px, y el icono del aviso sin `--warn`).

**Sin fallos.** RN-13 en los cuatro caminos con un solo `persist()`: el aviso de lectura solo se va si `saveTasks` devuelve `true`, y el de guardado se va con el siguiente guardado correcto (`src/app.js:44-48`). Ni abrir, ni cancelar, ni un intento rechazado guardan, así que no cuentan como cambio. DP-08: el aviso de lectura va antes que el de guardado (`index.html:19-21`). DP-06: los avisos, el error de añadir y la fila en edición no se rehacen al redibujar (`src/app.js:257-282` y `:73-81`). "Guardar" es secundario, la casilla deshabilitada tiene opacidad 0,5 y cursor `not-allowed`, y la rejilla de edición coloca los botones a la derecha desde 480 px, solo con clases. No hay valores escritos a mano: `maxLength` sale de `MAX_TEXT_LENGTH` en los dos campos.

**Para `/close`, sin ser fallo:** la decisión 2 de `plan.md` dice "se redibuja la lista entera". Desde T-10 es así salvo la fila en edición, que se reutiliza para no volver a anunciar su error. Conviene reflejarlo, como ya apunta `progress.md`.

## Prueba exploratoria

`scripts/init.sh` instala dependencias pero no arranca la app. Se usó el servidor de `npm run dev` que ya estaba en marcha en 127.0.0.1:4173 y sirve la carpeta del proyecto. Para los fallos inyectados, un servidor en memoria en el puerto 4174. Se miró el árbol de accesibilidad, estilos calculados y posiciones, en modo claro y oscuro, y con Chromium por defecto y completo (`channel: "chromium"`).

| Qué se probó | Resultado |
|---|---|
| Aviso de guardado en los dos modos de color | Bloque con borde de 1 px en `--warn`, fondo `--surface`, texto `--fg` e icono ⚠ en `--warn`. Dentro de `role="status"`. Ahora lo cubre un test. |
| Anuncios con tres fallos de guardado seguidos (añadir, marcar, editar) | El aviso se anuncia 1 sola vez, al aparecer. Ahora lo cubre un test. |
| Datos ilegibles y `setItem` fallando; después `setItem` se recupera y se marca | Primero se ven los dos avisos y la clave sigue valiendo `no-es-json`. Al marcar, se van los dos y se guarda `[Pan✓]`. Al recargar, se ve "Pan" sin avisos. |
| Almacenamiento bloqueado (`SecurityError`): añadir A y B, marcar, editar a "A2" y borrar | La lista acaba en "A2", con los dos avisos y sin errores en consola. |
| Chromium completo, en oscuro, con ilegible, fallos de guardado, error de edición, recuperación y borrado | 0 errores y 0 avisos en consola. |
| Árbol de accesibilidad con almacenamiento bloqueado, error de añadir y error de edición a la vez | `alert` (error de añadir), `status` (lectura), `status` (guardado), y en la fila: casilla `[disabled]`, campo, `alert` y los dos botones con sus nombres completos. |
| Fila normal, en edición con error y en confirmación, a 360, 479, 480, 560 y 1280 px, con "B" y con 200 "a" | `scrollWidth` igual al ancho en todos. Por debajo de 480 px, los botones van debajo del texto o del campo; desde 480 px, a la derecha. El error de edición va siempre debajo del campo. Todos los controles miden 44 px de alto y hay 8 px entre botones. Captura: `docs/delivery/tareas/qa/final-movil-avisos-y-error.png`. |
| Doble clic en "Borrar" de la fila, a 360, 480 y 1280 px | Abre la confirmación y no borra nada. |
| Doble clic en "Editar", a 360, 480 y 1280 px | Abre la edición y la cierra guardando sin cambios: el segundo clic cae en "Guardar". No se pierde nada (ver decisiones). |

**Sin comprobar:** Safari en iOS (aceptado en `plan.md`) y un lector de pantalla real: solo se miraron los atributos y lo que entra en cada región que se anuncia.

**Para decidir, sin contarlos como fallos porque el PRD no los define:**

| # | Qué pasa | Decisión pendiente |
|---|---|---|
| 1 | Un doble clic en "Editar" abre la edición y la cierra, porque el segundo clic cae en "Guardar". Antes de T-11 solo pasaba a 360 px; ahora también a 480 y 1280 px, porque "Guardar" queda a la altura de "Editar". Guarda sin cambios: no se pierde nada. | UX |
| 2 | Con una tarea guardada de 250 caracteres (RN-12 la acepta), el campo de edición muestra los 250, deja borrar y no deja escribir. RN-08 dice que los campos no admiten más de 200. | PM |
| 3 | Pegar solo caracteres invisibles de ancho cero (U+200B) crea una tarea que se ve en blanco. | PM |
| 4 | En modo oscuro, la casilla sin marcar es un cuadro claro, porque no se declara `color-scheme` (sigue `normal`). `states.md` no define su color. | UX |
| 5 | Repetir "Añadir" vacío o "Guardar" vacío con el error ya visible no lo vuelve a anunciar. Cumple DP-06 al pie de la letra ("al aparecer"), pero quien usa lector de pantalla no oye nada en el segundo intento. Lo apunta también `progress.md`. | UX |
| 6 | Si se hace clic en una zona de la fila abierta que no es un control, el foco pasa a la página y Esc ya no cancela. Es lo que dice la decisión 5 de `plan.md`. | Ninguna, salvo que moleste. |

## Fallos por gravedad

Ninguno abierto. Los 14 de las verificaciones parciales están arreglados y cubiertos por tests en verde.

Gravedad: **Crítico** (dato incorrecto o pérdida de datos) · **Alto** (un CA no se cumple) · **Medio** (caso límite o error mal tratado) · **Bajo** (molestia sin efecto en datos).

---

# Verificación parcial 2 – T-05 a T-08

> Fecha: 02-11-2026 · Commit: cbba567 · Veredicto entonces: Aprobado para T-05 a T-08; la funcionalidad, Con fallos (faltaban T-09 a T-11). Sus 5 fallos se arreglaron después en `9670549`, `024af93` y `3dfaa0c`.

| Tarea | Resultado | Motivo |
|---|---|---|
| T-05 | Pasa | Sus 5 CA pasan y detectan los cambios inyectados en el orden, el guardado y el tachado. El foco de la casilla (RN-15) solo lo comprueba CA-28, de T-10. |
| T-06 | Pasa, con fallos bajos | Sus 12 CA pasan. "Guardar" se ve como botón principal y, en escritorio, "Guardar" y "Cancelar" van debajo del campo, no a la derecha (fallos 3 y 5). |
| T-07 | Pasa | Sus 6 CA pasan. |
| T-08 | Pasa | Sus 4 CA pasan. El arreglo de Esc que `progress.md` daba por hecho sin test se cumple, y ahora lo cubren 10 tests nuevos. |

## Criterios de aceptación (verificación parcial 2)

| CA | Nivel | Resultado | Prueba | Pasos para reproducir (si falla) |
|---|---|---|---|---|
| CA-09 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-10 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-11 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-12 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-13 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-14 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-15 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-16 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-17 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-18 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-19 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-20 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-21 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-22 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-23 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-24 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-33 | e2e | Pasa | `e2e/tareas/una-fila-abierta.spec.js` | — |
| CA-34 | e2e | Pasa | `e2e/tareas/una-fila-abierta.spec.js` | — |
| CA-35 | e2e | Pasa | `e2e/tareas/una-fila-abierta.spec.js` | — |
| CA-36 | e2e | Pasa | `e2e/tareas/una-fila-abierta.spec.js` y `hallazgos-qa-filas.spec.js` ("RN-09: …") | — |
| CA-37 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |
| CA-38 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-39 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-40 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-41 | e2e | Pasa | `e2e/tareas/editar.spec.js` | — |
| CA-47 | e2e | Pasa | `e2e/tareas/completar.spec.js` | — |
| CA-48 | e2e | Pasa | `e2e/tareas/borrar.spec.js` | — |

Resultado de las ejecuciones:

- `scripts/check.sh`: en verde, con 27 tests unitarios e invariantes.
- `verify` de T-05 (5 tests), T-06 (12), T-07 (6) y T-08 (4): todos pasan. Con `--list` se comprobó que cada filtro selecciona justo sus tests y ninguno de los nuevos.
- `npx playwright test`: 81 pasan y 10 fallan. Son los 5 que ya se esperaban de T-09 (CA-25, CA-30, CA-31, CA-32 y "RN-13: …" de `hallazgos-qa.spec.js`) y 5 tests nuevos de este informe, uno por fallo.
- Los 5 tests nuevos en rojo se anotan en `acceptance_tests` de T-09, T-10 y T-11. Ojo: el `verify` de esas tareas filtra por CA y no los ejecuta. Hay que lanzarlos por su título, por ejemplo `npx playwright test e2e/tareas/hallazgos-qa-filas.spec.js`.
- Los fallos 1 y 3 a 9 de la verificación parcial 1 están arreglados: sus tests de `hallazgos-qa.spec.js` pasan. El fallo 2 sigue abierto, pendiente de T-09.

## Revisión del código frente a los criterios (verificación parcial 2)

**Tests de aceptación.** Ningún archivo de `e2e/` confirmado ha cambiado desde `878bd05`: entre `878bd05` y `cbba567` solo cambian `src/`, `index.html`, `favicon.ico` y `tasks.json`. No se han debilitado.

**Fallos inyectados.** Se cambió la app en memoria, sin tocar archivos, con 51 cambios en `src/app.js`, `src/tasks.js` y `src/styles.css`, y se ejecutaron los tests de completar, editar, borrar, una fila abierta y teclado:

| Detectados por | Cambios |
|---|---|
| Los CA de T-05 a T-08 | 31 |
| Solo CA-28 o CA-45, de T-10 | 7: el foco tras marcar, tras cerrar la edición, al abrir y cancelar la confirmación y tras borrar; el orden "Borrar" y "Cancelar"; y el nombre accesible con lo escrito |
| Solo los tests nuevos de este informe | 6: Esc desde otra fila (el arreglo de T-08), Esc solo desde el campo, `maxLength` escrito a mano, casilla de la completada sin marcar en edición, texto sin tachar en la confirmación y error que sigue al reabrir |
| Nadie | 7 (ver abajo) |

De los 7 sin detectar, 6 eran huecos reales y ya tienen test nuevo, que hoy pasa y detecta el cambio:

- **Borrar la segunda de dos repetidas.** Si se borra siempre la primera "Pan", CA-36 lo pasa, porque solo borra la primera.
- **Error de edición.** Sin `role="alert"` (DP-06) o sin el borde de error de 2 px.
- **Estilos de `states.md`.** El "Borrar" destructivo de la confirmación, el peso 600 de la pregunta y el color `--muted` de las completadas.

El séptimo no es un hueco: con "Cancelar" de tipo `submit` no cambia nada, porque el clic cierra la fila y el formulario ya no existe cuando se va a enviar.

**Los tests en rojo se pueden poner en verde.** Con los arreglos aplicados en memoria pasan los 26 tests de `hallazgos-qa-filas.spec.js`. Si solo se arregla el camino de añadir, el test RN-13 nuevo sigue en rojo, así que detecta un arreglo a medias.

**Reglas mal aplicadas:**

- `src/app.js:258`, `:299` y `:324` ponen `state.readable = true` antes de guardar al marcar, borrar y editar, sin mirar lo que devuelve `saveTasks`. Es el mismo fallo de RN-13 que el de añadir (`:245`), pero en tres sitios más. El test de la verificación 1 solo recorría añadir, así que un arreglo de T-09 solo en añadir lo daría por bueno (fallo 1).
- `src/app.js:76` asigna a "Guardar" la clase `button-primary`. `states.md` dice que "Añadir" es el único principal y "Guardar", secundario, y la contradicción 12 de `plan.md` decide seguir `states.md` (fallo 3).
- `src/app.js:64-69` (edición) y `:200-204` (añadir) vuelven a crear los mensajes de error dentro de `role="alert"` en cada redibujado (fallo 2).

**Sin fallos.** RN-02 y RN-03 en `setCompleted`; RN-04 en `editTask`; RN-09 por `id` en marcar, editar y borrar; RN-14 con el estado único `openRow`; Esc solo desde la fila abierta (decisión 5); `maxLength` del campo de edición tomado de `MAX_TEXT_LENGTH` (decisión 6); nunca se escribe al abrir, cancelar o rechazar, y sí al guardar sin cambios (decisión 7); los nombres accesibles usan el texto guardado; el texto se inserta con `textContent`.

## Prueba exploratoria (verificación parcial 2)

Se probó con el árbol de accesibilidad, estilos calculados y posiciones, a 1280 y 360 px, en modo claro y oscuro, con un servidor propio en memoria. `scripts/init.sh` instala dependencias, pero no arranca la app.

| Qué se probó | Resultado |
|---|---|
| Esc con el foco en la casilla, "Editar" o "Borrar" de otra fila, o en el campo de añadir, con B en edición ("B2") o en confirmación | B sigue abierta, con "B2". Ahora lo cubren tests. |
| Esc desde el campo, "Guardar" y "Cancelar" de la edición, y desde "Borrar" y "Cancelar" de la confirmación | Cancela y deja el foco en "Editar" o "Borrar" de la fila. |
| Fila abierta y después marcar otra o añadir | La fila sigue abierta (también la confirmación), con lo escrito y el error. El foco va a la casilla en su nueva posición o al campo de añadir. Guardar después da D, B2, A, C✓, y confirmar borra la tarea correcta. |
| Árbol de accesibilidad en edición con error y en confirmación | Nombres iguales a la tabla de `states.md`, la casilla `[disabled]` y el error como `alert`. |
| Redibujar con errores visibles (marcar otra fila) | Los dos mensajes se vuelven a añadir dentro de `role="alert"` (fallo 2). |
| `id` con comillas y barra invertida, texto con comillas y `<i>`, emojis | Marcar, editar, cancelar y borrar actúan sobre la fila correcta, y el foco llega a su sitio. |
| Chromium completo (`channel: "chromium"`): error de edición, guardar, marcar y borrar | 0 errores y 0 avisos en consola. |
| Doble clic en "Borrar", en "Borrar" de la confirmación, en "Cancelar" y en "Guardar", a 1280 y 360 px | Ningún doble clic borra una tarea de más ni sin confirmar. |
| 360 px con 200 "a" en edición y en confirmación | `scrollWidth` 360. |
| Estilos de la edición y la confirmación | Error en `--error` con icono y campo con borde de 2 px; "Borrar" de la confirmación con borde y texto `--error` sobre `--surface`; pregunta en `--fg` y peso 600, en los dos modos de color. Fallan "Guardar" como principal, la casilla deshabilitada sin estilo propio y la posición de los botones en escritorio (fallos 3, 4 y 5). |

**Sin comprobar:** Safari en iOS (aceptado en `plan.md`), un lector de pantalla real y los fallos de guardado al marcar, editar y borrar, más allá de RN-13, porque son de T-09.

**Para decidir, sin contarlos como fallos porque el PRD no los define:**

| Qué pasa | Decisión pendiente |
|---|---|
| A 360 px, un doble toque en "Editar" abre la edición y la cierra: el segundo toque cae en "Guardar", que ocupa el mismo sitio, y guarda sin cambios. No se pierde nada. | UX: ¿se cambia en T-11? |
| Con una tarea guardada de 250 caracteres (RN-12 la acepta), el campo de edición muestra los 250, deja borrar y no deja escribir. Guardar sin tocarla conserva 250, y borrar una letra deja 249. RN-08 dice que los campos no admiten más de 200. | PM: ¿se acepta así? |
| Si se hace clic en una zona de la fila abierta que no es un control, el foco pasa a la página y Esc ya no cancela. Es lo que dice la decisión 5 de `plan.md`. | Ninguna, salvo que moleste. |

## Fallos por gravedad (verificación parcial 2)

| # | Gravedad | Qué pasa | CA | Test nuevo que lo cubre |
|---|---|---|---|---|
| 1 | Medio | Con datos ilegibles y `setItem` fallando, se añade "Pan" y después se marca, se edita a "Pan2" y se borra. Se espera que tras cada paso siga el aviso de lectura y `tasks.v1` valga `no-es-json`. Hoy el aviso desaparece ya al añadir, y marcar, editar y borrar también lo quitan sin mirar si se guardó (`src/app.js:258`, `:299` y `:324`). Lo debe resolver T-09 en los cuatro caminos. | RN-13 | `hallazgos-qa-filas.spec.js`, "RN-13: completing, editing and deleting …" |
| 2 | Bajo | Con el error de edición y el de añadir visibles, marcar la casilla de otra fila redibuja y vuelve a añadir los dos mensajes dentro de `role="alert"`. Un lector de pantalla los anuncia otra vez, aunque no han aparecido. DP-06 pide anunciarlos al aparecer. Para T-10. | DP-06 | `hallazgos-qa-filas.spec.js`, "DP-06: a redraw …" |
| 3 | Bajo | "Guardar" se ve como botón principal: fondo `rgb(29, 95, 204)` y texto blanco. Se espera secundario, con fondo `--surface` (`rgb(255, 255, 255)`), texto `--fg` y borde `--border` (`src/app.js:76`). Para T-11. | `states.md` | `hallazgos-qa-filas.spec.js`, "states.md: Guardar is a secondary button …" |
| 4 | Bajo | La casilla deshabilitada en edición y en confirmación tiene opacidad 1 y cursor `default`. Se pide opacidad reducida y cursor `not-allowed`: no hay regla `.task-check:disabled` en `src/styles.css`. Para T-11. | `states.md` | `hallazgos-qa-filas.spec.js`, "states.md: the disabled checkbox …" |
| 5 | Bajo | A 1280 px, "Guardar" y "Cancelar" van debajo del campo de edición (x 428, y 247, con el campo en x 428 a 904 e y 195 a 239). Desde 480 px deben ir a la derecha del campo. Para T-11. | `states.md` | `hallazgos-qa-filas.spec.js`, "states.md: from 480 px on …" |

Gravedad: **Crítico** (dato incorrecto o pérdida de datos) · **Alto** (un CA no se cumple) · **Medio** (caso límite o error mal tratado) · **Bajo** (molestia sin efecto en datos).

---

# Verificación parcial 1 – T-01 a T-04

> Fecha: 01-11-2026 · Commit: 2d7a17e · Veredicto entonces: Con fallos. Los fallos 1 y 3 a 9 se arreglaron después en `b6afe8e`. El 2 sigue abierto (es el fallo 1 de la verificación 2).

| Tarea | Resultado | Motivo |
|---|---|---|
| T-01 | Pasa | 15 tests unitarios en verde; cumplen lo que pide su `verify`. |
| T-02 | Pasa | 10 tests unitarios en verde. Los suyos no comprobaban "nada escribe al leer" con `[]` ni con una lista válida; el código lo cumple y ahora lo cubre un test nuevo. |
| T-03 | **Falla** | CA-29 no se cumple en un navegador completo: hay un error en consola (fallo 1). |
| T-04 | Pasa, con fallos | Sus 12 CA pasan. Quedan 1 fallo medio compartido con T-03, 1 medio que debe resolver T-09 y varios bajos. |

## Criterios de aceptación (verificación 1)

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

## Revisión del código frente a los criterios (verificación 1)

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

## Prueba exploratoria (verificación 1)

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

## Fallos por gravedad (verificación 1)

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
