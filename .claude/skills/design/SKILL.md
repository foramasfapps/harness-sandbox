---
name: design
description: Fase de diseño y plan de una funcionalidad con el PRD aprobado. Lanza en paralelo al diseñador UX y al arquitecto, junta sus dudas y las presenta para la puerta G2.
argument-hint: "[nombre-de-la-funcionalidad]"
disable-model-invocation: true
---

# /design · Diseño y plan

Orquestas la fase entre G1 y G2 para **$ARGUMENTS**.

## Antes de empezar

- Comprueba que `docs/product/prd-*-$ARGUMENTS.md` existe y está `Aprobado`. Si no, para y propón `/spec $ARGUMENTS`.
- Lee la talla del PRD.

## Pasos

1. **Lanza en paralelo** (pásales la ruta del PRD y el nombre `$ARGUMENTS`; no resumas el contenido):
   - Subagente **ux-designer**, salvo en talla S (y en talla M sin pantallas nuevas, solo `flows.md` y `states.md`).
   - Subagente **architect** en modo **planificar**.
2. **Junta** lo que devuelven:
   - Dudas de producto del diseñador + preguntas y contradicciones del arquitecto, **sin duplicados**.
   - Si una duda cambia el PRD, es una cuestión de producto: márcala así.
3. **Si alguna respuesta cambia el diseño o el plan**, pide al agente correspondiente que lo ajuste (retómalo con su contexto si es posible) antes de presentar.

## Presentación a la persona (G2)

En términos sencillos y breve:

1. Qué se va a construir y en cuántas tareas.
2. Bocetos: rutas de `docs/design/$ARGUMENTS/mockups/` (o los estados clave).
3. **Preguntas**, todas juntas, numeradas, cada una con opciones y la **recomendada** primero (usa la herramienta de opción múltiple si está disponible).
4. Riesgos principales.
5. "¿G2 aprobado?"

## Al aprobar

- Aplica las respuestas a `plan.md`, `tasks.json` y al diseño. Si cambian el PRD, actualízalo como PM con una sección "Cambios en la vX.Y".
- Marca `plan.md`, el diseño y `tasks.json` (`"approved": "dd-mm-aaaa"`) como aprobados, y los ADR como "Aprobado".
- Propón `/build $ARGUMENTS`, recomendando lanzarlo en una sesión en la nube si es largo.
