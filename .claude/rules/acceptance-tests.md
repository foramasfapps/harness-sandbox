---
paths:
  - "tests/acceptance/**"
  - "e2e/**"
---

# Tests de aceptación

- Son de **QA**: los escribe el agente `qa-evaluator` a partir de los CA aprobados, antes de que exista el código.
- El developer **no los edita** (el arnés lo bloquea). Si un test parece mal, se apunta como bloqueo en `docs/delivery/<feature>/progress.md` y lo resuelve QA, o la persona si es un problema de la spec.
- Un test por CA, nombrado con su ID (`CA-03: …`), con las cifras exactas del criterio.
- Se prueba lo observable (la interfaz pactada en `plan.md`), no detalles internos.
