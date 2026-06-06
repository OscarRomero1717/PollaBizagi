# Polla Mundialista — Backend

API .NET 8 con Clean Architecture.

## Estructura

```
backend/
├── src/
│   ├── Polla.Domain/
│   ├── Polla.Application/
│   ├── Polla.Infrastructure/
│   └── Polla.Api/
├── tests/
│   └── Polla.Domain.Tests/
├── scripts/
└── docs/
```

## Comandos

```powershell
# Compilar
dotnet build PollaMundialista.slnx

# Tests
dotnet test PollaMundialista.slnx

# Migración BD
dotnet ef database update --project src/Polla.Infrastructure --startup-project src/Polla.Api

# Arrancar API (migrate + seed automático)
.\scripts\run-api.ps1
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `run-api.ps1` | Inicia la API en `http://localhost:5299` y `https://localhost:7289` |
| `setup-database.ps1` | Compila y aplica migraciones EF |
| `reset-database.ps1` | Elimina y recrea la BD local |
| `manual-api-test.ps1` | Smoke test E2E de endpoints |
| `explore-database.sql` | Consultas para inspeccionar datos |

## Credenciales demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@polla.demo` | `Admin123!` |
| User | `user@polla.demo` | `User123!` |
