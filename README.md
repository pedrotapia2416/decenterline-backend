# decenterline-backend

Backend separado para Decenterline, construido con NestJS, Swagger y una base de arquitectura hexagonal.

## Estructura

- `src/domain`: reglas y tipos del dominio.
- `src/application`: puertos y casos de uso.
- `src/presentation`: adaptadores HTTP, controladores y DTOs.

## Endpoints

- `GET /health`
- Swagger disponible en `GET /docs`

## Arranque

```bash
npm install
npm run start:dev
```

## Notas

La carpeta del front permanece desacoplada en `decenterline-web`.
