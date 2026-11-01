# Arquitectura

> Estado: Borrador · Se escribe en G0 (B2 del playbook) y la mantiene el Arquitecto.

## Stack

| Pieza | Elección | Por qué | ADR |
|---|---|---|---|
| {{Frontend}} | {{…}} | {{…}} | {{0001}} |

## Entornos

| Entorno | Para qué | Base de datos |
|---|---|---|
| Local | Desarrollo y agentes | Local, con datos semilla (nunca reales) |
| Vista previa | Revisión en G3 | {{…}} |
| Producción | Uso real | Solo la persona aplica migraciones |

## Estructura del código

{{Carpetas principales y qué vive en cada una.}}

## Seguridad

{{Autenticación, autorización, secretos.}}

## Tests

| Nivel | Qué cubre | Herramienta | Dónde |
|---|---|---|---|
| Unitario | Reglas y cálculos | {{…}} | {{…}} |
| Integración | Base de datos y permisos | {{…}} | {{…}} |
| Aceptación | Un test por criterio de aceptación (lo escribe QA) | {{…}} | `tests/acceptance/` |
| e2e | Flujos de pantalla | Playwright | `e2e/` |

## Despliegue

{{Cómo llega el código a vista previa y a producción.}}
