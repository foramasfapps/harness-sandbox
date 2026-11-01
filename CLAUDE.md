# {{APP_NAME}}

> Si esta línea y los marcadores `{{...}}` siguen sin rellenar, estás en el **repositorio plantilla**, no en una app: sigue `docs/process/template-maintenance.md` y no rellenes nada.

## Qué es la app

{{Una o dos frases: qué problema resuelve y para quién. Lo que NO es.}}

Visión completa: `docs/product/vision.md`.

## Reglas de oro

Invariantes no negociables. Las que se pueden comprobar automáticamente están además en `scripts/check-invariants.sh`.

- **Documentación en español; código en inglés** (variables, funciones, tablas, campos).
- **Nunca claves ni secretos en el código**: variables de entorno.
- **Nunca trabajar contra datos de producción**: los agentes usan el entorno local (`scripts/init.sh`).
- **Commits pequeños**, con un solo cambio cada uno, en una rama; nunca directamente en `main`.
- {{Regla propia de la app, p. ej. "Dinero en céntimos enteros, nunca floats".}}

## Comandos

| Para qué | Comando |
|---|---|
| Arrancar el entorno local | `scripts/init.sh` |
| Comprobar todo (tipos, lint, tests, invariantes) | `scripts/check.sh` |
| Desarrollo | `{{dev}}` |
| Tests unitarios | `{{test}}` |
| Tests e2e | `{{e2e}}` |

## Forma de trabajar

Cada funcionalidad pasa por fases con una puerta de aprobación humana:

1. `/discover` y `/spec`: el PM entrevista y escribe el PRD → **G1** (spec aprobada).
2. `/design`: UX y Arquitecto preparan diseño, plan y `tasks.json` → **G2** (diseño y plan aprobados).
3. `/build`: QA escribe los tests de aceptación, el Developer los pone en verde y QA verifica → **G3** (PR aprobado).
4. `/close`: la documentación vuelve a reflejar lo construido.

Solo cuenta como cierto lo que tiene `Estado: Aprobado (fecha)`. Si algo contradice la spec o el plan, no se improvisa: se apunta como bloqueo en `progress.md`.

Explicar las cosas en términos sencillos, sin dar por sabida la jerga técnica.

## Mapa de documentos

| Qué | Dónde |
|---|---|
| Cómo trabajamos (modelo, roles, controles) | `docs/process/` |
| Visión, decisiones, PRD | `docs/product/` |
| Sistema de diseño y diseño por funcionalidad | `docs/design/` |
| Arquitectura, modelo de datos, ADR | `docs/architecture/` |
| Plan, tareas, progreso e informe de QA por funcionalidad | `docs/delivery/<feature>/` |

Lee solo lo que la tarea necesita; los documentos largos tienen índice.
