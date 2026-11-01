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
