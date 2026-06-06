# Arquitectura — Polla Mundialista

_Documento pendiente. Se completará en la Tarea 040 con diagrama C4 y flujo de scoring._

## Contenedores previstos (MVP)

- **Angular SPA** — Azure Static Web Apps
- **ASP.NET Core 8 API** — Azure App Service
- **Azure SQL Database** — persistencia relacional

## Capas backend (Clean Architecture)

1. `Polla.Domain`
2. `Polla.Application`
3. `Polla.Infrastructure`
4. `Polla.Api`

## Persistencia (Tarea 012)

- `AppDbContext`: Identity (`ApplicationUser`) + `Matches` + `Predictions`
- Constraints: UNIQUE (`UserId`, `MatchId`), FKs con `Restrict`, check goles ≥ 0
- Leaderboard: JOIN `Predictions` + `AspNetUsers` en `PredictionRepository` (Infra)
