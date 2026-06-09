# Polla Mundialista

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=OscarRomero1717_PollaBizagi&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=OscarRomero1717_PollaBizagi)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=OscarRomero1717_PollaBizagi&metric=coverage)](https://sonarcloud.io/summary/new_code?id=OscarRomero1717_PollaBizagi)

Aplicación web fullstack para registro de predicciones deportivas, cálculo automático de puntajes y ranking de participantes.

**Repositorio:** [github.com/OscarRomero1717/PollaBizagi](https://github.com/OscarRomero1717/PollaBizagi)

## URLs de producción

| Servicio | URL |
|----------|-----|
| **Frontend (Azure Static Web Apps)** | Ver en Azure Portal → Static Web App → https://ambitious-meadow-0965a6f0f.7.azurestaticapps.net/login |
| **API (Render)** | `https://pollabizagi.onrender.com` |
| **Base de datos** | Azure SQL — `PollaMundialista` |

> https://ambitious-meadow-0965a6f0f.7.azurestaticapps.net/login

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | .NET 8 — Clean Architecture |
| Frontend | Angular 17 (standalone) |
| Base de datos | Azure SQL (SQL Server) |
| Autenticación | ASP.NET Core Identity + JWT |
| Despliegue | Azure Static Web Apps + Render (API) + Azure SQL |

## Requisitos previos (desarrollo local)

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) y npm
- **SQL Server LocalDB** (incluido con Visual Studio en Windows)

Tiempo estimado para levantar el proyecto en local: **menos de 30 minutos**.

## Inicio rápido — Backend

```powershell
git clone https://github.com/OscarRomero1717/PollaBizagi.git
cd PollaBizagi/backend

dotnet build PollaMundialista.slnx
dotnet test PollaMundialista.slnx
.\scripts\run-api.ps1
```

| Recurso | URL |
|---------|-----|
| API HTTP | `http://localhost:5299` |
| API HTTPS | `https://localhost:7289` |
| Swagger (Development) | `https://localhost:7289/swagger` |

La primera ejecución aplica migraciones EF y seed (12 partidos + usuarios demo).

## Inicio rápido — Frontend

En una **segunda terminal**:

```powershell
cd PollaBizagi/frontend/polla-web
npm install
ng serve
```

| Recurso | URL |
|---------|-----|
| App Angular | `http://localhost:4200` |
| API configurada en dev | `http://localhost:5299` (`environment.ts`) |

## Credenciales demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Usuario | `user@polla.demo` | `User123!` |
| Admin | `admin@polla.demo` | `Admin123!` |

## Flujo de prueba (local o producción)

1. **Usuario** — iniciar sesión → ir a **Partidos** → registrar una predicción.
2. **Admin** — iniciar sesión → ir a **Admin** → publicar resultado oficial de un partido.
3. **Usuario** — revisar puntos en **Mis predicciones** y posición en **Leaderboard**.

En producción, la primera petición a la API en Render Free puede tardar ~30–60 s (cold start).

## Estructura del repositorio

```
PollaBizagi/
├── backend/                 # API .NET, tests, scripts, docs
│   ├── src/
│   ├── tests/
│   ├── scripts/
│   ├── docs/
│   └── PollaMundialista.slnx
├── frontend/
│   ├── polla-web/           # SPA Angular 17
│   └── docs/
│       └── azure-swa-setup.md
├── docs/
│   └── sonarcloud-setup.md  # Guía SonarCloud
├── sonar-project.properties # Config análisis SonarCloud
└── .github/workflows/       # CI/CD SWA + SonarCloud
```

## Estado del proyecto

| Fase | Tareas | Estado |
|------|--------|--------|
| Backend MVP | 001–026 | ✅ Completado |
| Frontend Angular | 027–034 | ✅ Completado |
| Azure SQL | 035 | ✅ Completado |
| API en Render | 036 | ✅ Completado |
| Frontend en Azure SWA | 037 | ✅ Completado |
| CORS producción | 038 | ✅ Completado |
| README final | 039 | ✅ Completado |
| Diagrama C4 | 040 | ✅ Completado |
| SonarCloud | — | ✅ Configurado (activar token en GitHub) |

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [backend/README.md](backend/README.md) | Comandos y scripts del API |
| [frontend/README.md](frontend/README.md) | Comandos del SPA Angular |
| [backend/docs/architecture.md](backend/docs/architecture.md) | Arquitectura C4 + secuencia scoring  |
| [backend/docs/database.md](backend/docs/database.md) | Modelo de datos y tablas |
| [backend/AI_LOG.md](backend/AI_LOG.md) | Registro de uso de IA en el desarrollo |
| [docs/sonarcloud-setup.md](docs/sonarcloud-setup.md) | Análisis de calidad con SonarCloud |
| [docs/observability.md](docs/observability.md) | Logs, correlation ID y health checks  |

## Licencia

Proyecto de prueba técnica.
