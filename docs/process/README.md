# Cómo trabajamos

Este proyecto se construye con un **arnés agéntico**: varios agentes de Claude Code con roles distintos, que se pasan el trabajo mediante documentos y que están vigilados por controles automáticos. Tú decides en cuatro momentos; el resto lo hacen ellos.

## La idea en tres capas

| Capa | Qué es | Ejemplo |
|---|---|---|
| **Documentos** | La memoria compartida. Lo que no está escrito, no existe para los agentes | El PRD, el plan, la lista de tareas |
| **Agentes** | Roles con su propia tarea, herramientas y memoria | El PM que te entrevista; el QA que intenta romper lo construido |
| **Controles** | Reglas que se cumplen siempre, decida lo que decida el modelo | No se puede terminar un turno con tests en rojo; nadie toca la base de datos de producción |

Por qué tres capas: las instrucciones escritas (como `CLAUDE.md`) son **consejos** que el modelo suele seguir; los controles son **obligatorios**. Lo que no admite excepciones va en controles.

## Los roles

| Rol | Qué hace | Qué no hace |
|---|---|---|
| **PM** (Product Manager) | Te entrevista, escribe la spec (PRD) con criterios de aceptación y lleva el registro de decisiones | Decidir por ti |
| **UX/UI** | Diseña recorridos, estados y bocetos de cada pantalla antes de programar; luego compara lo construido con los bocetos | Programar |
| **Arquitecto** | Cruza la spec con el modelo de datos y el código, detecta contradicciones, escribe el plan y la lista de tareas; guarda la coherencia | Editar el código |
| **Developer** | Construye una tarea cada vez, con tests, en su rama | Cambiar la spec o los tests de aceptación |
| **QA** | Revisa que los criterios se puedan comprobar, escribe los tests de aceptación antes del código y verifica al final, en el código y en la app | Editar el código de la app; aprobar por buena voluntad |

Principio central: **quien hace no evalúa**. Un agente que revisa su propio trabajo tiende a aprobarlo.

## Las fases y sus puertas

```text
G0  /bootstrap (una vez por app)    visión, reglas de oro, stack, sistema de diseño   ✋ apruebas

Por cada funcionalidad:
    /discover + /spec    PM te entrevista; QA revisa los criterios    → PRD                 ✋ G1
    /design              UX y Arquitecto en paralelo                  → diseño, plan, tareas ✋ G2
    /build               QA escribe tests → Developer → QA verifica   → PR + informe QA     ✋ G3
                         (sin ti)
    /close               PM y Arquitecto ponen al día la documentación y las lecciones
```

| Puerta | Qué apruebas |
|---|---|
| **G0** | Que la visión, las reglas de oro y el stack son los correctos |
| **G1** | Que la spec describe lo que quieres, con ejemplos concretos |
| **G2** | Los bocetos, y las dudas y contradicciones (te llegan todas juntas, con una opción recomendada) |
| **G3** | El resultado: lo pruebas en la vista previa, lees el informe de QA y haces el merge |

Entre G2 y G3 los agentes trabajan solos. Los agentes **nunca** hacen merge.

## Tallas

No todo merece el proceso completo. En `/spec` el PM propone una talla y tú la confirmas:

| Talla | Ejemplo | Proceso |
|---|---|---|
| **S** | Un campo, un texto, un fallo pequeño | Spec corta, tests de aceptación y construcción; sin entrevista ni bocetos |
| **M** | Una pantalla nueva sobre un modelo existente | Ciclo completo; bocetos solo si no reutiliza patrones |
| **L** | Un módulo con modelo de datos nuevo y varias pantallas | Ciclo completo con prueba exploratoria y revisión visual |

## Dónde vive cada cosa

| Carpeta | Contenido |
|---|---|
| `docs/process/` | Este documento, los controles, las lecciones aprendidas y el playbook |
| `docs/product/` | Visión, registro de decisiones, notas de entrevistas (`discovery/`) y PRD |
| `docs/design/` | Sistema de diseño y, por funcionalidad, recorridos, estados y bocetos |
| `docs/architecture/` | Arquitectura, modelo de datos y decisiones técnicas difíciles de revertir (ADR) |
| `docs/delivery/<feature>/` | Plan, lista de tareas (`tasks.json`), progreso e informe de QA |
| `.claude/` | Agentes, skills (procedimientos), reglas por carpeta y controles |

## Cómo se mantiene bajo el consumo

Lo que más gasta es rehacer. Por eso: criterios revisados antes de programar, comprobaciones automáticas en lugar de revisiones del modelo, ceremonia según la talla, contexto corto y el modelo justo para cada rol. En cada cierre se anotan el consumo y los fallos que se escaparon; si un recorte hace subir los fallos, se deshace. Detalle en el [playbook](playbook.md), sección 1.9.
