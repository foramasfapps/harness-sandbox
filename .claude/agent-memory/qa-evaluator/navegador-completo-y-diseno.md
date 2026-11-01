---
name: navegador-completo-y-diseno
description: Fallos que los tests e2e por defecto no ven en este proyecto, el error del icono de la página con el Chromium reducido y los requisitos de diseño sin CA
metadata:
  type: feedback
---

Los tests de consola en verde con el Chromium por defecto de Playwright no demuestran que la consola esté limpia en un navegador de verdad, y los requisitos de `states.md` y `flows.md` sin CA no los prueba nadie.

**Why:** en `tareas` (01-11-2026), el Chromium reducido sin interfaz no pide `/favicon.ico`, así que CA-29 pasaba, y con `channel: "chromium"` aparece un error 404 en consola. Además, la región que anuncia los avisos (DP-06), los iconos y el borde de 2 px no los cubría ningún CA y no estaban hechos, con todos los tests en verde.

**How to apply:**
- Cuando un CA diga "sin errores en consola", comprueba también con `test.use({ channel: "chromium" })`, y espera un momento antes de comprobar la lista: el icono se pide después de cargar.
- En Modo 3, repasa `states.md`, `flows.md` y la lista de decisiones de `plan.md` de las tareas revisadas, no solo los CA. Mide con estilos calculados y el árbol de accesibilidad.
- Busca valores escritos a mano que el plan manda sacar de una constante. Se prueba cambiando la constante al vuelo con `page.route` y mirando la propiedad del campo.
- Prueba los dos modos de color: el texto de ayuda sin estilo propio da 3,58:1 en oscuro.
- Busca lo que `app.js` hace sin mirar el resultado de `saveTasks`: quitar un aviso antes de saber si se ha guardado rompe RN-13.
