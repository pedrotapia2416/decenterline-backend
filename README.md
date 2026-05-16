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

- `MONGO_URI`: cadena de conexión a MongoDB Atlas.
- `MONGO_DB_NAME`: nombre de la base de datos a usar.
- `AUTH_BOOTSTRAP_USERNAME`: usuario inicial que se crea en MongoDB si no existe.
- `AUTH_BOOTSTRAP_PASSWORD`: contraseña del usuario inicial.
- `AUTH_BOOTSTRAP_ROLES`: roles iniciales del usuario, separados por coma.
- `AUTH_TOKEN_SECRET`: secreto para firmar tokens JWT.
- `AUTH_TOKEN_TTL_SECONDS`: duración del token en segundos.
