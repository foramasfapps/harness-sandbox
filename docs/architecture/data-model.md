# Modelo de datos

> Versión: 0 · Estado: Pendiente de G0 · Lo mantiene el Arquitecto. Cada cambio indica el PRD que lo introduce, p. ej. *(PRD 03)*.

## Principios

1. Se guarda lo mínimo: solo lo que la pantalla necesita.
2. Los datos no salen del navegador (D-01).

## Glosario

| Término | En código | Significado |
|---|---|---|
| Tarea | `task` | Algo que la persona tiene que hacer |

## Entidades

### task

Las tareas se guardan como una lista en JSON, en la clave `tasks.v1` de `localStorage`. El orden de la lista es el orden en pantalla.

- `id`: texto único, generado con `crypto.randomUUID()`
- `text`: texto de la tarea
- `completed`: `true` o `false`
- Reglas: una tarea nunca queda sin texto.

## Cálculos derivados

| Cálculo | Fórmula / fuente |
|---|---|
| Ninguno | — |

## Reglas de validación

- `text` se recorta de espacios al principio y al final, y no puede quedar vacío.
