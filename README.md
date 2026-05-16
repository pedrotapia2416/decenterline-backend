# decenterline-backend

Backend separado para Decenterline, construido con NestJS, Swagger y una base de arquitectura hexagonal.

## Estructura

- `src/domain`: reglas y tipos del dominio.
- `src/application`: puertos y casos de uso.
- `src/presentation`: adaptadores HTTP, controladores y DTOs.

## Endpoints

- `GET /health`
- `POST /auth/login`
- `GET /auth/me`
- Swagger disponible en `GET /docs`

## Arranque

```bash
npm install
npm run start:dev
```

## Notas

La carpeta del front permanece desacoplada en `decenterline-web`.

## Variables de entorno

- `AUTH_USERNAME`: usuario permitido para login.
- `AUTH_PASSWORD`: contraseña permitida para login.
- `AUTH_TOKEN_SECRET`: secreto para firmar tokens.
- `AUTH_TOKEN_TTL_SECONDS`: duración del token en segundos.
