# ADR 0001 – Página estática con datos en `localStorage`

> Estado: Aprobado · Fecha: 01-11-2026

## Contexto

La app es una lista de tareas para una persona y un ensayo del arnés (D-01, D-02). Se pidió el stack más sencillo posible. Dónde viven los datos es lo más difícil de cambiar después.

## Opciones

| Opción | A favor | En contra |
|---|---|---|
| A. HTML, CSS y JavaScript puros con `localStorage` | Sin compilación ni dependencias en la app; un servidor de archivos basta | Sin sincronización; los datos dependen de un navegador; sin ayudas de framework si la app creciera |
| B. Vite y React con `localStorage` | Componentes y herramientas conocidas; más parecido a una app real | Más dependencias y configuración, sin beneficio para una sola pantalla |
| C. Next.js con base de datos alojada | Sincronización; ejercitaría migraciones y vistas previas del arnés | Cuentas, secretos y entornos; contradice D-01 y empuja la talla por encima de M |

## Decisión

Opción A: es la que cumple el encargo con menos piezas.

## Consecuencias

- **Se gana:** nada que compilar, alojar ni mantener en producción.
- **Se pierde:** las tareas no pasan a otro dispositivo y se borran con los datos del navegador. El ensayo no ejercitará migraciones, entornos con base de datos ni datos semilla.
- **Para revertirla:** sustituir `src/storage.js` por llamadas a un servidor y añadir cuentas y un paso para traer los datos existentes.

## Cambios

### 02-11-2026 · Consecuencias observadas al construir `tareas`

La decisión se mantiene. Construir el PRD 01 confirmó lo previsto y sacó a la luz tres costes que no estaban escritos:

- **Sin framework, el redibujado y la accesibilidad se resuelven a mano.** Redibujar toda la lista hacía que un lector de pantalla anunciara otra vez los errores ya visibles (DP-06). Se resolvió reutilizando la fila en edición y sin reconstruir los avisos visibles (`docs/delivery/tareas/plan.md`, "Cambios en la v1.1"). Si la app crece en pantallas o estados, este es el primer sitio donde un framework ahorraría trabajo.
- **La cabecera de seguridad limita también lo propio:** nada de estilos en línea ni iconos `data:`; todo va en archivos del mismo origen.
- **`crypto.randomUUID()` exige HTTPS o `localhost`.** Publicar la app requiere HTTPS, y el servidor local no puede abrirse a la red para probar desde un móvil.

Ninguno obliga a revisar la decisión.
