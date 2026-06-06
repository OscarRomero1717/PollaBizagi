# Polla Mundialista

Aplicación web fullstack para registro de predicciones deportivas, cálculo automático de puntajes y ranking de participantes.

## Stack

- **Backend:** .NET 8 — Clean Architecture (Domain, Application, Infrastructure, Api)
- **Frontend:** Angular 17+ (standalone)
- **Base de datos:** Azure SQL (SQL Server)
- **Autenticación:** ASP.NET Core Identity + JWT
- **Despliegue:** Azure Static Web Apps + Azure App Service

## Estructura del repositorio

```
bizaggi/
├── backend/          # API .NET, tests, scripts, docs técnicos
│   ├── src/
│   ├── tests/
│   ├── scripts/
│   ├── docs/
│   └── PollaMundialista.slnx
├── frontend/
│   └── polla-web/    # SPA Angular 17
├── README.md
└── AI_LOG.md
```

## Estado del proyecto

✅ Backend (001–026) y Frontend MVP (027–034) completados. Pendiente: despliegue Azure (035+).

## Inicio rápido — Backend

```powershell
cd backend
dotnet build PollaMundialista.slnx
dotnet test PollaMundialista.slnx
.\scripts\run-api.ps1
```

API local: `http://localhost:5299` / `https://localhost:7289` (Swagger en Development)

## Inicio rápido — Frontend

```powershell
cd frontend/polla-web
ng serve
```

App local: `http://localhost:4200`

## Credenciales demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@polla.demo` | `Admin123!` |
| User | `user@polla.demo` | `User123!` |

## Documentación

- [Arquitectura](backend/docs/architecture.md)
- [Base de datos](backend/docs/database.md)
- [AI_LOG](AI_LOG.md) — registro de uso de IA en el desarrollo

## Licencia

Proyecto de prueba técnica.
