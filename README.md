# iStore E-commerce MVP

## Requisitos

- Node.js 18 o superior
- npm

## Ejecutar en desarrollo

1. Instalar dependencias:
   `npm install`
2. Levantar el proyecto:
   `npm run dev`
3. Abrir en el navegador:
   `http://localhost:3000`

## Ejecutar en producción local

1. Instalar dependencias:
   `npm install`
2. Levantar en modo producción:
   `npm start`

`npm start` genera el build y luego levanta el servidor.

## Scripts útiles

- `npm run build`: genera la versión de producción
- `npm run lint`: valida tipos con TypeScript

## Solución de problemas

- Error `EADDRINUSE: address already in use 0.0.0.0:3000`:
   Ya hay otra instancia corriendo en el puerto 3000. Cierra ese proceso (Ctrl+C en la terminal donde está activo) o usa otro puerto.

- La pestaña o favicon no se actualiza:
   Haz recarga forzada con `Ctrl+F5` porque el navegador puede cachear recursos estáticos.

- Si cambias imágenes en `public/` y no se reflejan:
   Reinicia `npm start` y vuelve a recargar el navegador.
