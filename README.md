# Agua Fix API

API REST desarrollada en **NestJS v11** con **TypeScript**, **PostgreSQL**, **TypeORM** y **Nodemailer** para que los ciudadanos reporten fugas de agua en la vía pública y se envíen alertas por correo a la cuadrilla de mantenimiento.

---

## Arquitectura y Tecnologías

- **Framework**: [NestJS 11](https://nestjs.com/) (TypeScript)
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM con migraciones (`synchronize: false`)
- **Variables de Entorno**: `dotenv` + `env-var` (`src/config/envs.ts`)
- **Seguridad**: Hashing de contraseñas con `bcryptjs`
- **Mailing**: `nodemailer` con plantilla HTML estructurada
- **Patrón de Arquitectura**: `Module -> Controller -> Service -> Repository`
- **Validación de Entradas**: `class-validator` y `class-transformer` con `ValidationPipe(whitelist: true)`

---

## Estructura del Proyecto

```
agua-fix-api/
├── src/
│   ├── config/
│   │   ├── envs.ts                  # Validación de variables con env-var y dotenv
│   │   └── data-source.ts           # DataSource para TypeORM CLI y migraciones
│   ├── database/
│   │   └── migrations/              # Migraciones de base de datos
│   ├── email/
│   │   ├── email.module.ts
│   │   └── email.service.ts         # Transporter nodemailer y sendEmail(to, subject, template)
│   ├── auth/
│   │   ├── entities/
│   │   │   └── user.entity.ts       # Entidad User (SYSTEM_USER)
│   │   ├── repositories/
│   │   │   └── users.repository.ts  # Capa de repositorio para User
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.controller.ts       # POST /auth/register, POST /auth/login
│   │   ├── auth.service.ts          # Hasheo con bcryptjs y BadRequestException en error
│   │   └── auth.module.ts
│   ├── reports/
│   │   ├── entities/
│   │   │   └── report.entity.ts     # Entidad Report (WATER_REPORT)
│   │   ├── repositories/
│   │   │   └── reports.repository.ts# Capa de repositorio para Report
│   │   ├── dto/
│   │   │   └── create-report.dto.ts # address, description, severity, reporterPhone
│   │   ├── templates/
│   │   │   └── report.template.ts   # generateReportTemplate(dto): HTML inline
│   │   ├── reports.controller.ts    # POST /reports (guarda y envía correo), GET /reports
│   │   ├── reports.service.ts       # Lógica de persistencia de reportes
│   │   └── reports.module.ts
│   ├── app.module.ts                # TypeOrmModule.forRootAsync + Módulos
│   └── main.ts                      # ValidationPipe(whitelist: true) y listen(envs.PORT)
├── .env
├── .env.example
├── docker-compose.yml               # PostgreSQL 16
├── package.json
└── tsconfig.json
```

---

## Puesta en Marcha

### 1. Iniciar PostgreSQL con Docker Compose
```bash
docker compose up -d
```

### 2. Ejecutar Migraciones
```bash
npm run migration:run
```

### 3. Iniciar el Servidor en Desarrollo
```bash
npm run start:dev
```

El servidor quedará disponible en: `http://localhost:3000`

---

## Colección de Bruno lista para usar

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

#### Registrar Usuario
- **Ruta**: `POST /auth/register`
- **Body**:
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "isNotificationEnabled": true
  }
  ```
- **Respuesta (201 Created)**:
  ```json
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "isNotificationEnabled": true
  }
  ```

#### Iniciar Sesión
- **Ruta**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "juan@example.com",
    "password": "password123"
  }
  ```
- **Respuesta (200 OK)**:
  ```json
  {
    "message": "Inicio de sesión exitoso",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "isNotificationEnabled": true
    }
  }
  ```
- **Credenciales inválidas (400 Bad Request)**:
  ```json
  {
    "message": "Credenciales inválidas: correo o contraseña incorrectos",
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

---

### 2. Reportes de Fugas (`/reports`)

#### Crear Reporte
- **Ruta**: `POST /reports`
- **Body**:
  ```json
  {
    "address": "Av. Universidad 405, Col. Lomas del Campestre",
    "description": "Fuga considerable de agua potable en banqueta frente al predio",
    "severity": "high",
    "reporterPhone": "4771234567"
  }
  ```
- **Acción realizada**:
  1. El controlador invoca `reportsService.create(createReportDto)` y guarda el registro en la tabla `WATER_REPORT`.
  2. Genera la plantilla HTML con `generateReportTemplate(createReportDto)`.
  3. Invoca `emailService.sendEmail` para notificar a la cuadrilla de mantenimiento (`MAINTENANCE_EMAIL`).
- **Respuesta (201 Created)**:
  ```json
  {
    "id": 1,
    "address": "Av. Universidad 405, Col. Lomas del Campestre",
    "description": "Fuga considerable de agua potable en banqueta frente al predio",
    "severity": "high",
    "reporterPhone": "4771234567",
    "isResolved": false,
    "createdAt": "2026-03-12T04:00:00.000Z"
  }
  ```

#### Listar Reportes
- **Ruta**: `GET /reports`
- **Respuesta (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "address": "Av. Universidad 405, Col. Lomas del Campestre",
      "description": "Fuga considerable de agua potable en banqueta frente al predio",
      "severity": "high",
      "reporterPhone": "4771234567",
      "isResolved": false,
      "createdAt": "2026-03-12T04:00:00.000Z"
    }
  ]
  ```

---

## Comandos de Migraciones TypeORM

- **Ejecutar migraciones pendientes**:
  ```bash
  npm run migration:run
  ```
- **Revertir última migración**:
  ```bash
  npm run migration:revert
  ```
- **Generar nueva migración tras cambios en entidades**:
  ```bash
  npm run migration:generate -- src/database/migrations/NombreDeLaMigracion
  ```
