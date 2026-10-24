# Agua Fix API 💧

API REST desarrollada en **NestJS v11** con **TypeScript**, **PostgreSQL**, **TypeORM**, **AWS S3** y **Nodemailer** para que los ciudadanos reporten fugas de agua en la vía pública con evidencia fotográfica. La aplicación se distribuye como imagen de contenedor en **Docker Hub** mediante un pipeline automatizado de **GitHub Actions**.

---

## 🚀 Tecnologías y Arquitectura

- **Framework**: [NestJS 11](https://nestjs.com/) (TypeScript)
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM con migraciones (`synchronize: false`)
- **Almacenamiento de Archivos (Fotos)**: AWS S3 con `@aws-sdk/client-s3` (`StorageModule` / `StorageService`)
- **Contenedores**: Docker (`Dockerfile` multi-stage con `node:22-alpine`) y Docker Compose (`compose.yaml`)
- **CI/CD**: GitHub Actions para build y push automático a Docker Hub (`latest`)
- **Variables de Entorno**: `dotenv` + `env-var` (`src/config/envs.ts`)
- **Seguridad**: Contraseñas hasheadas con `bcryptjs`
- **Mailing**: `nodemailer` con plantilla HTML responsiva que incluye la fotografía de la fuga (`<img>`)

---

## 📁 Estructura del Proyecto

```
agua-fix-api/
├── .github/
│   └── workflows/
│       └── docker-publish.yml       # GitHub Actions: build & push a Docker Hub
├── src/
│   ├── config/
│   │   ├── envs.ts                  # Validación de variables con env-var y dotenv
│   │   └── data-source.ts           # DataSource para TypeORM CLI y migraciones
│   ├── database/
│   │   └── migrations/              # Migraciones de base de datos
│   │       ├── 1741830000000-InitialMigration.ts
│   │       └── 1741840000000-AddPhotoUrlToWaterReport.ts
│   ├── storage/
│   │   ├── storage.module.ts
│   │   └── storage.service.ts       # Subida de fotos a AWS S3 con @aws-sdk/client-s3
│   ├── email/
│   │   ├── email.module.ts
│   │   └── email.service.ts         # Transporter nodemailer y sendEmail(to, subject, template)
│   ├── auth/
│   │   ├── entities/
│   │   │   └── user.entity.ts       # Entidad User (SYSTEM_USER)
│   │   ├── repositories/
│   │   │   └── users.repository.ts
│   │   ├── dto/
│   │   ├── auth.controller.ts       # POST /auth/register, POST /auth/login
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── reports/
│   │   ├── entities/
│   │   │   └── report.entity.ts     # Entidad Report con photoUrl y repairPhotoUrl
│   │   ├── repositories/
│   │   │   └── reports.repository.ts
│   │   ├── dto/
│   │   │   └── create-report.dto.ts
│   │   ├── templates/
│   │   │   └── report.template.ts   # Plantilla HTML con <img> para la foto
│   │   ├── reports.controller.ts    # POST /reports (multipart con foto), GET /reports
│   │   ├── reports.service.ts
│   │   └── reports.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .dockerignore
├── Dockerfile
├── compose.yaml                     # Orquestación de la API + PostgreSQL
├── .env.example
├── .env
├── package.json
└── tsconfig.json
```

---

## 🛠️ Puesta en Marcha Local

### 1. Variables de Entorno
Copia el archivo `.env.example` a `.env` y configura tus credenciales de PostgreSQL, Nodemailer y AWS:
```bash
cp .env.example .env
```

### 2. Iniciar con Docker Compose
Para levantar la base de datos PostgreSQL y la API en contenedores:
```bash
docker compose -f compose.yaml up -d
```

### 3. Ejecutar Migraciones
```bash
npm run migration:run
```

### 4. Modo Desarrollo Local
Si deseas ejecutar la API directamente con Node.js:
```bash
npm run start:dev
```

El servidor quedará disponible en: `http://localhost:3000`

---

## 🐶 Colección de Bruno lista para usar

El proyecto incluye la colección completa de **Bruno** en la carpeta `bruno/`.

Para usarla:
1. Abre la aplicación de escritorio **Bruno**.
2. Haz clic en **Open Collection**.
3. Selecciona la carpeta `agua-fix-api/bruno`.
4. En la esquina superior derecha de Bruno, asegúrate de seleccionar el entorno **Local** (apunta a `http://localhost:3000`).
5. ¡Listo! Tendrás las carpetas `Auth` y `Reports` con todas las peticiones configuradas con sus bodies y métodos.

---

## 📡 Endpoints de la API

### 1. Autenticación (`/auth`)
- **`POST /auth/register`**: Registra un usuario en `SYSTEM_USER` con contraseña cifrada (`bcryptjs`).
- **`POST /auth/login`**: Inicia sesión validando credenciales (arroja `400 Bad Request` si son inválidas).

### 2. Reportes de Fugas (`/reports`)
- **`POST /reports`**:
  - Petición **`multipart/form-data`**.
  - Campos: `address`, `description`, `severity` (`low`/`medium`/`high`), `reporterPhone`.
  - Archivo obligatorio: **`photo`** (si no se incluye, lanza `400 Bad Request`).
  - Acción: Sube la foto al bucket S3 en la carpeta `reports/`, persiste el reporte con `photoUrl` en PostgreSQL y envía correo con la plantilla HTML y la etiqueta `<img>`.
- **`GET /reports`**: Lista todos los reportes incluyendo `photoUrl` y `repairPhotoUrl`.

---

## 🐳 Docker y GitHub Actions CI/CD

- **Construcción local de la imagen**:
  ```bash
  docker build -t mauag13docker/agua-fix-api:latest .
  ```
- **Pipeline CI/CD**:
  En cada push a la rama `main`, el workflow `.github/workflows/docker-publish.yml` se autentica en Docker Hub usando los secretos `DOCKER_USER` y `DOCKER_PASSWORD`, construye la imagen y la publica con la etiqueta `latest`.
