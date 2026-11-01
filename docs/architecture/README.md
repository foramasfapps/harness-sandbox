# Arquitectura

> Estado: Pendiente de G0 · Se escribe en G0 (B2 del playbook) y la mantiene el Arquitecto.

## Stack

| Pieza | Elección | Por qué | ADR |
|---|---|---|---|
| Interfaz | HTML, CSS y JavaScript puros, sin framework ni paso de compilación | Una pantalla con cuatro operaciones no justifica más piezas | 0001 |
| Librería de componentes | Ninguna | Los pocos controles son nativos del navegador | 0001 |
| Datos | `localStorage` del navegador | Sin cuentas ni servidor (D-01) | 0001 |
| Servidor local | `python3 -m http.server` | El arnés ya exige `python3`, y los módulos de JavaScript no cargan abriendo el archivo directamente | — |
| Tests | `node --test` y Playwright | `node --test` viene con Node; Playwright es la única dependencia y solo se usa en desarrollo | — |
| Comprobación de tipos y lint | Sin configurar | Evita dependencias en una app tan pequeña; `scripts/check.sh` lo avisa y sigue | — |

## Entornos

| Entorno | Para qué | Datos |
|---|---|---|
| Local | Desarrollo, agentes y revisión en G3 | `localStorage` del navegador local; los tests preparan sus propios datos |
| Vista previa | No se despliega; en G3 se revisa en local | — |
| Producción | No hay | — |

No hay base de datos, migraciones ni datos de producción a los que proteger.

## Estructura del código

| Ruta | Qué vive ahí |
|---|---|
| `index.html` | La página |
| `src/tasks.js` | Reglas de las tareas, sin tocar la pantalla ni el guardado |
| `src/storage.js` | Leer y guardar en `localStorage` |
| `src/app.js` | Pantalla y eventos |
| `src/styles.css` | Estilos |
| `tests/unit/`, `tests/acceptance/`, `e2e/` | Tests por nivel |

## Seguridad

- No hay cuentas, secretos ni servidor propio.
- Una cabecera de seguridad en `index.html` (`Content-Security-Policy`, `default-src 'self'`) impide al navegador cargar scripts externos y enviar datos fuera. Hace cumplir la regla "las tareas no salen del navegador".
- El texto de las tareas se inserta con `textContent`, nunca con `innerHTML`.
- Estas dos reglas se comprobarán también en `scripts/check-invariants.sh`.

## Tests

| Nivel | Qué cubre | Herramienta | Dónde |
|---|---|---|---|
| Unitario | Reglas de las tareas | `node --test` | `tests/unit/` |
| Integración | No aplica: no hay base de datos ni permisos | — | — |
| Aceptación | Un test por criterio de aceptación (lo escribe QA) | `node --test` | `tests/acceptance/` |
| e2e | Flujos de pantalla y guardado al recargar | Playwright (Chromium) | `e2e/` |

## Despliegue

Ninguno por ahora. La app se ejecuta en local y la revisión de G3 se hace ahí. Si más adelante hiciera falta publicarla, bastaría cualquier alojamiento de archivos estáticos, como GitHub Pages.
