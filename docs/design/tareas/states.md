# Estados – Tareas

> Estado: Aprobado (01-11-2026) · Fecha: 01-11-2026 · PRD: `docs/product/prd-01-tareas.md` (v1.2) · Sistema de diseño: `docs/design/design-system.md`
> Los textos entre comillas son los literales del PRD; mandan sobre cualquier ejemplo. Las dudas de diseño (DP-xx de `flows.md`) quedaron resueltas en G2.

## Reglas visuales comunes

- Tokens del sistema de diseño; claro u oscuro según el dispositivo. Texto 16 px, secundario 14 px. Radio 8 px, sin sombras.
- Columna: móvil, ancho completo con 16 px de margen; escritorio, 560 px centrada.
- Todo botón, casilla y campo mide al menos 44 px de alto y de ancho táctil. Entre botones, 8 px.
- Foco visible: contorno de 2 px en `--accent`, con 2 px de separación, en todo lo que se puede usar con teclado.
- Botones: "Añadir" es el principal (relleno `--accent`, texto `--on-accent`); es el único principal de la vista. "Editar", "Guardar" y "Cancelar" son secundarios (borde `--border`, texto `--fg`). "Borrar" es secundario en la fila normal y **destructivo** en la confirmación (borde y texto `--error`). Destructivo no es relleno rojo: es un contorno, para no alarmar de más.
- Errores y avisos: icono (triángulo de aviso) + texto en `--error` o `--warn`, nunca solo color. Un error de campo va debajo del campo y el campo cambia a la variante "con error" (borde `--error` de 2 px).
- Completada: casilla marcada + texto tachado + `--muted`. Las tres señales juntas; el estado no depende del color.
- Texto de la tarea: `overflow-wrap: anywhere`; una cadena de 200 caracteres sin espacios se parte en líneas y nunca provoca desplazamiento horizontal. El texto se muestra siempre como texto literal.
- Carga: no hay estado de carga. Leer y guardar es inmediato; la primera pintura ya lleva los datos. No se diseña spinner.

## Patrón nuevo

Ninguno. Se reutilizan Botón, Campo de texto, Casilla, Fila de tarea y los patrones Lista, Formulario, Vacío y Error. Dos extensiones menores, sin componente nuevo:

1. Fila de tarea con dos variantes más a las del sistema: **confirmando borrado** y **editando con error**. El sistema solo nombra "editando". Se añaden al componente Fila de tarea al aprobar el diseño.
2. Los **avisos de lectura y de guardado** usan el patrón Error, pero en un bloque propio bajo el formulario, porque no pertenecen a ningún campo.

---

## Pantalla "Tareas"

### 1. Formulario de añadir

| Estado | Móvil (360 px) | Escritorio (560 px) |
|---|---|---|
| Normal, vacío | Campo con texto de ayuda "Escribe una tarea" (DP-01) y botón "Añadir" en la misma línea. Campo flexible, botón de ancho propio (mín. 88 px). | Igual, con más ancho para el campo. |
| Escribiendo | El texto reemplaza la ayuda. Sin contador. A 200 caracteres no entra más (CA-07, CA-42). | Igual. |
| Error: vacío o solo espacios (CA-04) | Debajo, a ancho completo: icono + "Escribe algo para añadir la tarea." El campo con borde de error. El contenido del campo no cambia. Foco en el campo (DP-02). | Igual. |
| Error resuelto | Tras añadir una tarea válida el mensaje desaparece (CA-05). | Igual. |
| Tras añadir con éxito | Campo vacío y con foco (CA-02, CA-03). | Igual. |
| Cargando | No aplica. | No aplica. |

Ejemplo de CA-49: se pegan 5 espacios y 200 "a"; el campo muestra 5 espacios y 195 "a" y se guarda el texto "aaa…" de 195 caracteres.

### 2. Lista de tareas

| Estado | Contenido |
|---|---|
| Vacía (CA-01, CA-23) | En lugar de la lista, una frase centrada en `--muted`, 16 px: "Añade tu primera tarea." Sin icono ni botón extra: el campo de arriba ya es la acción. Aparece sin avisos si la clave no existe o vale `[]`. |
| Con datos | Una fila por tarea, de arriba abajo en el orden guardado. Filas separadas por borde de 1 px en `--border`, sin sombras. |
| Con datos, ilegible la lectura (CA-26, CA-29) | La lista aparece vacía ("Añade tu primera tarea.") y encima, el aviso de lectura. |
| Cargando | No aplica. |

Ejemplo con datos (CA-10, CA-24): `A`, `C2`, `B` (completada). Al recargar tras añadir C, B, A, completar B y editar C a "C2", se ve:

```
[ ] A                         [Editar] [Borrar]
[ ] C2                        [Editar] [Borrar]
[x] ~~B~~  (en --muted)       [Editar] [Borrar]
```

### 3. Fila de tarea

Estructura en **móvil**: cuadrícula de dos columnas. Casilla (44 px) a la izquierda; a la derecha, el texto, que puede ocupar varias líneas. Los botones van **debajo del texto**, alineados con él, en una línea (cada uno de al menos 44 px de alto). En **escritorio** (a partir de 480 px de ancho de ventana) los botones pasan a la derecha, en la misma línea que el texto, alineados arriba. El texto toma el espacio restante.

| Estado | Lo que se ve | Teclado y foco |
|---|---|---|
| Pendiente | Casilla sin marcar, texto en `--fg`, "Editar", "Borrar" (CA-02, CA-13). | Orden: casilla, Editar, Borrar. |
| Completada (CA-10, CA-12) | Casilla marcada, texto tachado en `--muted`, "Editar", "Borrar". Se edita y se borra igual (CA-18, CA-37). | Igual. |
| Editando (CA-13) | No están el texto fijo ni "Editar" ni "Borrar". Aparece un campo con el texto actual, ocupando todo el ancho disponible, y debajo (móvil) o a la derecha (escritorio) "Guardar" y "Cancelar". La casilla se ve deshabilitada (CA-34). | Foco al campo, con el texto seleccionado. Intro guarda, Esc cancela. |
| Editando con error (CA-17, CA-40, CA-41) | Lo anterior más, debajo del campo, icono + "Escribe algo para guardar la tarea." y campo con borde de error. Sigue la edición. | Foco en el campo (DP-03). "Cancelar" o Esc: vuelve la fila a normal con el texto original, sin error. Escribir un texto válido y guardar: se va el error. |
| Confirmando borrado (CA-20) | Se mantiene a la vista el texto de la tarea (con su estilo, tachado si es completada). Debajo, la pregunta "¿Borrar esta tarea?" en `--fg`, peso 600, y los botones "Borrar" (destructivo) y "Cancelar". "Editar" no está. La casilla está deshabilitada (CA-34). | Foco en "Cancelar". Esc cancela y el foco va al "Borrar" de la fila (CA-48). |
| Fila deshabilitada (solo casilla) | Casilla con opacidad reducida y cursor "no permitido". El texto sigue legible en su color. | No recibe foco. |
| Texto de 200 caracteres sin espacios, a 360 px (CA-44) | El texto se parte en varias líneas dentro de su columna. La casilla, "Editar" y "Borrar" se ven, sin desplazamiento horizontal (`scrollWidth` ≤ 360). | Igual. |
| Cargando | No aplica. | — |

Texto de HTML (CA-09): `<b>hola</b>` se ve literalmente `<b>hola</b>`; en el campo de edición también.

Una sola fila a la vez en "editando" o "confirmando" (CA-33). Abrir una cancela la anterior sin guardar: lo escrito se pierde, la fila anterior vuelve a mostrar el texto original. Añadir una tarea no cierra la fila abierta (CA-35): la nueva aparece arriba, la fila abierta conserva el campo con lo que había escrito.

### 4. Avisos (bloque bajo el formulario)

| Aviso | Texto | Cuándo se ve | Cuándo se va |
|---|---|---|---|
| De lectura | "No se han podido leer tus tareas guardadas. Si haces un cambio, se reemplazarán." | Al abrir, si lo guardado no se puede leer (CA-26, CA-29, CA-30). | Con el primer cambio guardado con éxito (CA-27). Un intento rechazado, como "Añadir" vacío, no cuenta (CA-43). |
| De guardado | "No se han podido guardar los cambios." | Tras cualquier cambio que no se pueda guardar (CA-25, CA-30). La lista sigue funcionando. | Con el siguiente guardado correcto (CA-31). |

- Los dos son bloques de ancho completo: borde de 1 px y fondo `--surface`, con icono de aviso a la izquierda y el texto. Los dos usan `--warn` para el icono y el borde (hay riesgo de perder datos, pero la app sigue funcionando); el texto va en `--fg` para asegurar el contraste. Sin botón de cerrar.
- Si se ven a la vez (CA-30), van uno bajo otro: lectura primero, guardado después (DP-08).
- Con aviso de guardado visible, la lista conserva lo hecho aunque no esté guardado; al recargar se pierde (CA-32). No se muestra nada extra al respecto.
- Anuncio a lector de pantalla: aparecen como mensaje que se anuncia solo (DP-06).

---

## Foco tras cada acción (RN-15)

| Acción | Dónde queda el foco |
|---|---|
| Añadir con éxito | Campo de añadir |
| Añadir con campo vacío | Campo de añadir (DP-02) |
| Marcar o desmarcar | Esa casilla, en su nueva posición |
| Abrir edición | Campo de edición de esa fila |
| Guardar o cancelar edición | "Editar" de esa fila |
| Guardar con texto vacío | Campo de edición (DP-03) |
| Abrir confirmación de borrado | "Cancelar" de esa fila |
| Cancelar o Esc en la confirmación | "Borrar" de esa fila |
| Confirmar el borrado | Campo de añadir |

## Textos

| Dónde | Texto |
|---|---|
| Lista vacía | Añade tu primera tarea. |
| Error al añadir | Escribe algo para añadir la tarea. |
| Error al guardar edición | Escribe algo para guardar la tarea. |
| Aviso de guardado | No se han podido guardar los cambios. |
| Aviso de lectura | No se han podido leer tus tareas guardadas. Si haces un cambio, se reemplazarán. |
| Confirmación | ¿Borrar esta tarea? |
| Botones | Añadir · Editar · Borrar · Guardar · Cancelar |
| Título (DP-01) | Tareas |
| Ayuda del campo de añadir (DP-01) | Escribe una tarea |

Nombres accesibles (DP-05). Todos incluyen el texto de la tarea (CA-45):

| Control | Nombre para lector de pantalla |
|---|---|
| Campo de añadir | Nueva tarea |
| Casilla | El texto de la tarea (por ejemplo "B") |
| Editar | Editar tarea: B |
| Borrar | Borrar tarea: B |
| Campo de edición | Editar tarea: B |
| Guardar | Guardar cambios de: B |
| Cancelar (edición) | Cancelar edición de: B |
| Borrar (confirmación) | Borrar tarea: B |
| Cancelar (confirmación) | Cancelar borrado de: B |

Los botones muestran solo la palabra visible ("Editar"); el nombre completo es el que lee el lector.

## Cobertura de criterios de aceptación

Los criterios de datos y de lógica (orden, guardado, validación del JSON, `localStorage`) no tienen pantalla propia; se ven en los estados anteriores así:

| Criterios | Dónde se ven |
|---|---|
| CA-01, CA-23 | Lista vacía |
| CA-02, CA-03, CA-06 a CA-08, CA-42, CA-46, CA-49 | Formulario de añadir y fila pendiente |
| CA-04, CA-05 | Formulario: error de añadir |
| CA-09 | Fila: texto literal |
| CA-10 a CA-12, CA-47 | Fila pendiente y completada; foco en la casilla |
| CA-13 a CA-16, CA-18, CA-19, CA-39 | Fila editando |
| CA-17, CA-40, CA-41 | Fila editando con error |
| CA-20 a CA-22, CA-37, CA-48 | Fila confirmando borrado |
| CA-24, CA-36, CA-38 | Lista con datos |
| CA-25, CA-30 a CA-32 | Aviso de guardado |
| CA-26, CA-27, CA-29, CA-30, CA-43 | Aviso de lectura |
| CA-28 | Tabla de foco y recorrido de teclado (`flows.md`, H6) |
| CA-33 a CA-35 | Fila: una sola abierta; casilla deshabilitada; añadir no cierra |
| CA-44 | Fila con 200 caracteres sin espacios a 360 px |
| CA-45 | Tabla de nombres accesibles |
