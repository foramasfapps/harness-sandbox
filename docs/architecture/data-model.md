# Modelo de datos

> Versión: 1 · Estado: Implementado (02-11-2026) · Lo mantiene el Arquitecto. Cada cambio indica el PRD que lo introduce, p. ej. *(PRD 03)*.

## Principios

1. Se guarda lo mínimo: solo lo que la pantalla necesita.
2. Los datos no salen del navegador (D-01).

## Glosario

| Término | En código | Significado |
|---|---|---|
| Tarea | `task` | Algo que la persona tiene que hacer |
| Lista legible | `readable` | Lo guardado en `tasks.v1` cumple las reglas de validación y se puede mostrar *(PRD 01)* |

## Entidades

### task

Las tareas se guardan como una lista en JSON, en la clave `tasks.v1` de `localStorage`. El orden de la lista es el orden en pantalla. Se guarda la lista completa tras cada cambio correcto; al abrir la página nunca se escribe.

- `id`: texto único y no vacío, generado con `crypto.randomUUID()`
- `text`: texto de la tarea
- `completed`: `true` o `false`
- Reglas: una tarea nunca queda sin texto.

Dónde se aplica: las reglas, en `src/tasks.js` (`isValidTaskList` para lo guardado); leer, convertir el JSON y escribir, solo en `src/storage.js`.

## Cálculos derivados

| Cálculo | Fórmula / fuente |
|---|---|
| Ninguno | — |

## Reglas de validación

- `text` se recorta de espacios al principio y al final, y no puede quedar vacío.
- *(PRD 01)* `text` admite como máximo 200 caracteres (`MAX_TEXT_LENGTH`), contados como la longitud de JavaScript (`.length`). Se aplica en los campos de añadir y editar, con `maxLength`, antes de recortar los espacios (RN-08, CA-49). El código no recorta el texto por longitud.
- *(PRD 01)* Lo guardado es válido si es una lista JSON en la que cada elemento es un objeto con:
  - `id` de tipo texto, no vacío y sin repetir en la lista;
  - `text` de tipo texto con algo más que espacios;
  - `completed` verdadero o falso.

  Basta un elemento inválido para tratar toda la lista como ilegible (RN-12, D-15). Un `text` guardado de más de 200 caracteres se acepta y se muestra (D-15). Los campos de más no se comprueban.
- *(PRD 01)* La clave inexistente o `[]` es una lista vacía y legible. El texto `"null"` guardado, o cualquier JSON que no sea una lista, es ilegible (RN-12, CA-29).
- *(PRD 01)* Lo ilegible no se toca hasta que se guarda con éxito el primer cambio, que lo reemplaza (RN-13, D-10). Si el almacenamiento no está disponible, la lista se trata como ilegible y nunca se lanza un error (CA-30).
- *(PRD 01)* Las tareas nuevas y las desmarcadas se colocan al principio de la lista guardada, y las completadas al final (RN-01 a RN-03, D-05). Editar no cambia la posición (RN-04).

## Cambios en la v1

Fecha: 02-11-2026 (`/close` de `tareas`). Motivo: aplicar lo que `docs/delivery/tareas/plan.md` dejó propuesto, aprobado en G2 el 01-11-2026 con la pregunta 3 en la opción A, y lo que se construyó.

- Reglas de validación del PRD 01: máximo de 200 caracteres, forma válida de lo guardado, lista vacía, lista ilegible y orden.
- `id` pasa a ser explícitamente "no vacío" (D-15).
- Glosario: "Lista legible".
- Sin migración: la forma de los datos no cambia y la clave sigue siendo `tasks.v1`. Lo guardado con la versión 0 sigue siendo válido salvo que rompa las reglas que la versión 0 ya tenía (texto vacío, `id` repetido).
- Queda abierto, sin cambio en el modelo: P-06 (una tarea guardada de más de 200 caracteres se puede editar y conserva su longitud) y P-07 (los caracteres invisibles, como U+200B, no cuentan como espacio al recortar).
