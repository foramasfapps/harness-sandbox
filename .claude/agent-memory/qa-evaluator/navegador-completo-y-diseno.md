---
name: navegador-completo-y-diseno
description: Fallos que los tests e2e por defecto no ven en este proyecto, el error del icono de la página con el Chromium reducido, los requisitos de diseño sin CA, los anuncios repetidos al redibujar y RN-13 camino a camino
metadata:
  type: feedback
---

Los tests de consola en verde con el Chromium por defecto de Playwright no demuestran que la consola esté limpia en un navegador de verdad, y los requisitos de `states.md` y `flows.md` sin CA no los prueba nadie.

**Why:** en `tareas` (01-11-2026), el Chromium reducido sin interfaz no pide `/favicon.ico`, así que CA-29 pasaba, y con `channel: "chromium"` aparece un error 404 en consola. Además, la región que anuncia los avisos (DP-06), los iconos y el borde de 2 px no los cubría ningún CA y no estaban hechos, con todos los tests en verde. En la verificación de T-05 a T-08 (02-11-2026) volvió a pasar: "Guardar" como botón principal, la casilla deshabilitada sin estilo y los botones de edición debajo del campo en escritorio.

**How to apply:**
- Cuando un CA diga "sin errores en consola", comprueba también con `test.use({ channel: "chromium" })`, y espera un momento antes de comprobar la lista: el icono se pide después de cargar.
- En Modo 3, repasa `states.md`, `flows.md` y la lista de decisiones de `plan.md` de las tareas revisadas, no solo los CA. Mide con estilos calculados, cajas (`boundingBox`) y el árbol de accesibilidad.
- Busca valores escritos a mano que el plan manda sacar de una constante. Se prueba cambiando la constante al vuelo con `page.route` y mirando la propiedad del campo.
- Prueba los dos modos de color: el texto de ayuda sin estilo propio da 3,58:1 en oscuro.
- Busca lo que `app.js` hace sin mirar el resultado de `saveTasks`, en cada camino (añadir, marcar, editar, borrar): quitar un aviso antes de saber si se ha guardado rompe RN-13. Un test que recorra solo añadir da por bueno un arreglo a medias.
- La app redibuja la lista entera: busca mensajes dentro de `role="alert"` que se vuelven a crear al redibujar (se anuncian otra vez). Se prueba con un `MutationObserver` mientras se marca otra fila.
- Los tests de QA sin CA no los ejecuta el `verify` de ninguna tarea (filtra por `CA-xx:`). Al anotarlos en `acceptance_tests`, dilo en el informe para que se lancen por archivo.
