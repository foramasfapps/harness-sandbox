---
name: spec
description: Convierte las notas de discovery en un PRD con criterios de aceptación comprobables, revisado por pm-reviewer y QA, listo para la puerta G1 (rol PM).
argument-hint: "[nombre-de-la-funcionalidad]"
disable-model-invocation: true
---

# /spec · Escribir la spec

Actúas como **Product Manager**. Conviertes `docs/product/discovery/$ARGUMENTS.md` en un PRD listo para que la persona lo apruebe (**G1**).

## Pasos

1. **Lee** las notas de discovery, `docs/product/decisions.md` y `docs/product/prd-template.md`. Si las notas no están "Listo para /spec", dilo y propón seguir con `/discover`.
2. **Número**: el siguiente libre en `docs/product/prd-NN-*.md`.
3. **Escribe** `docs/product/prd-NN-$ARGUMENTS.md` con la plantilla. Según la talla:
   - **S**: secciones 1, 4, 5, 8 y 10.
   - **M y L**: todas.
4. **Criterios de aceptación**, la parte más importante:
   - Formato Dado / Cuando / Entonces, **con cifras de ejemplo concretas**.
   - Cada uno **comprobable por alguien que no escribió la spec**, sin interpretar.
   - Incluye casos límite, errores y permisos, no solo el camino feliz.
   - Cada CA dice qué RF/RN cubre; todo RF tiene al menos un CA.
5. **Decisiones**: añade las nuevas a `decisions.md` con ID (`D-xx`), estado "Pendiente" y dónde viven (PRD, RF/RN).
6. **Revisión independiente**, en paralelo:
   - Subagente **pm-reviewer**: ambigüedades, huecos MECE, contradicciones con decisiones.
   - Subagente **qa-evaluator** en modo **revisión de CA**: comprobabilidad, cifras, casos límite.
   Pásales la ruta del PRD; no les resumas el contenido.
7. **Decide como PM** qué aceptas de cada revisión y corrige el PRD. No aceptes cambios que amplíen el alcance sin preguntarlo.
8. **Estado**: `Pendiente de G1`.

## Presentación a la persona (G1)

Muy breve, en términos sencillos:

- Qué hace la funcionalidad, en 3 líneas, y su talla.
- Los criterios de aceptación clave (no todos si son muchos).
- Qué cambió tras las revisiones y **qué descartaste y por qué**.
- Preguntas abiertas, cada una con opción recomendada.
- Pregunta final: "¿G1 aprobado?".

Cuando la persona apruebe, cambia el estado a `Aprobado (dd-mm-aaaa)` y propón `/design $ARGUMENTS` (en talla S, directamente `/build $ARGUMENTS` si no hay cambios de modelo de datos; el arquitecto escribe igualmente `tasks.json`).
