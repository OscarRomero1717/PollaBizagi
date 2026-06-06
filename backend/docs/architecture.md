# Arquitectura — Polla Mundialista

Documento de arquitectura del MVP (Tarea 040): diagrama C4 de contenedores, capas backend y secuencia de scoring.

---

## 1. Contexto del sistema (C4 — Nivel 1)

```mermaid
C4Context
    title Diagrama de contexto — Polla Mundialista

    Person(user, "Usuario", "Registra predicciones y consulta ranking")
    Person(admin, "Administrador", "Publica resultados oficiales")

    System(polla, "Polla Mundialista", "Predicciones deportivas, scoring 3-1-0 y leaderboard")

    Rel(user, polla, "Usa", "HTTPS")
    Rel(admin, polla, "Administra resultados", "HTTPS")
```

---

## 2. Contenedores (C4 — Nivel 2)

Despliegue actual del MVP:

| Contenedor | Tecnología | Hosting |
|------------|------------|---------|
| Angular SPA | Angular 17 standalone | **Azure Static Web Apps** |
| Polla API | ASP.NET Core 8 | **Render** (Docker) |
| Base de datos | Azure SQL (SQL Server) | **Azure** |

```mermaid
C4Container
    title Diagrama de contenedores — Polla Mundialista

    Person(user, "Usuario / Admin", "Navegador web")

    Container_Boundary(c1, "Polla Mundialista") {
        Container(spa, "Angular SPA", "TypeScript / Angular 17", "UI: login, partidos, predicciones, admin, leaderboard")
        Container(api, "Polla API", "ASP.NET Core 8", "REST + JWT + Clean Architecture")
        ContainerDb(db, "Azure SQL", "SQL Server", "Identity, Matches, Predictions")
    }

    Rel(user, spa, "HTTPS")
    Rel(spa, api, "JSON / REST", "HTTPS + Bearer JWT")
    Rel(api, db, "EF Core / TDS", "TCP 1433")
```

### Comunicación entre contenedores

| Origen | Destino | Protocolo | Notas |
|--------|---------|-----------|-------|
| Navegador | Angular SPA | HTTPS | Rutas SPA; fallback en `staticwebapp.config.json` |
| Angular SPA | Polla API | HTTPS + JWT | `environment.prod.ts` → `https://pollabizagi.onrender.com` |
| Polla API | Azure SQL | ADO.NET / EF Core | Connection string vía variable de entorno en Render |
| CORS | Solo origen SWA | — | `Cors__AllowedOrigins__0` en Render (Tarea 038) |

---

## 3. Componentes backend (C4 — Nivel 3)

Clean Architecture con dependencias hacia el dominio:

```mermaid
flowchart TB
    subgraph Api["Polla.Api"]
        Controllers["Controllers\nAuth, Matches, Predictions,\nLeaderboard, Admin"]
        Middleware["JWT + CORS + ExceptionHandling"]
    end

    subgraph Application["Polla.Application"]
        AuthSvc["AuthService"]
        MatchSvc["MatchService"]
        PredSvc["PredictionService"]
        LeadSvc["LeaderboardService"]
    end

    subgraph Domain["Polla.Domain"]
        Entities["Match, Prediction"]
        Scoring["ScoringCalculator\n(RN-04: 3 / 1 / 0)"]
        Exceptions["DomainException, ..."]
    end

    subgraph Infrastructure["Polla.Infrastructure"]
        EF["AppDbContext + Repositories"]
        Identity["Identity + JwtTokenService"]
        Seeder["DbSeeder"]
    end

    Controllers --> AuthSvc & MatchSvc & PredSvc & LeadSvc
    MatchSvc --> PredSvc
    PredSvc --> Scoring
    AuthSvc & MatchSvc & PredSvc & LeadSvc --> EF
    AuthSvc --> Identity
    EF --> Entities
```

### Servicios Application y responsabilidades

| Servicio | RF / UC | Responsabilidad |
|----------|---------|-----------------|
| `AuthService` | RF-01, RF-02 | Registro, login, emisión JWT |
| `MatchService` | RF-04, RF-09 / UC-A02 | Listar partidos; publicar resultado oficial (Admin) |
| `PredictionService` | RF-05–08 / UC-A03 | CRUD predicciones; recálculo de puntos |
| `LeaderboardService` | RF-10 | Ranking agregado por usuario |
| `ScoringCalculator` | RN-04 | Lógica pura 3 / 1 / 0 (Domain, sin EF) |

---

## 4. Regla de scoring (RN-04)

Implementada en `Polla.Domain.Services.ScoringCalculator`:

| Condición | Puntos |
|-----------|--------|
| Marcador exacto (local y visitante) | **3** |
| Acierto de resultado (ganador local / visitante / empate) | **1** |
| Cualquier otro caso | **0** |

```csharp
// Dominio — sin dependencias de infraestructura
ScoringCalculator.Calculate(predictedHome, predictedAway, officialHome, officialAway)
```

---

## 5. Secuencia UC-A02 → UC-A03 (scoring automático)

**UC-A02 — Gestión de resultados oficiales** (Actor: Admin)  
**UC-A03 — Recalcular puntuaciones** (Actor: Sistema, disparado por UC-A02)

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant SPA as Angular SPA
    participant API as AdminController
    participant MS as MatchService
    participant PS as PredictionService
    participant SC as ScoringCalculator
    participant DB as Azure SQL

    Note over Admin,DB: UC-A02 — Admin publica resultado oficial

    Admin->>SPA: Ingresa goles oficiales
    SPA->>API: PUT /api/admin/matches/{id}/result<br/>Bearer JWT (rol Admin)
    API->>MS: SetOfficialResultAsync(matchId, request)
    MS->>MS: Validar rol Admin y goles ≥ 0
    MS->>DB: Obtener Match por id
    MS->>DB: Actualizar OfficialHomeGoals / OfficialAwayGoals

    Note over MS,DB: UC-A03 — Recálculo automático de puntos

    MS->>PS: RecalculatePointsForMatchAsync(matchId)
    PS->>DB: Obtener todas las Predictions del partido
    loop Por cada predicción
        PS->>SC: Calculate(predicted, official)
        SC-->>PS: points (0, 1 o 3)
        PS->>DB: Actualizar PointsAwarded
    end
    PS-->>MS: predictionsUpdated (count)
    MS->>DB: SaveChangesAsync (transacción)
    MS-->>API: SetOfficialResultResponseDto
    API-->>SPA: 200 OK + predictionsUpdated
    SPA-->>Admin: Confirmación en UI

    Note over Admin,DB: Consulta posterior del ranking (RF-10)

    Admin->>SPA: Abre Leaderboard
    SPA->>API: GET /api/leaderboard
    API->>DB: Agregar SUM(PointsAwarded) por usuario
    API-->>SPA: Ranking ordenado por puntos
```

### Flujo resumido

1. **UC-A02:** Admin envía marcador oficial → `MatchService` persiste goles en `Matches`.
2. **UC-A03:** `MatchService` invoca `PredictionService.RecalculatePointsForMatchAsync`.
3. Por cada fila en `Predictions`, `ScoringCalculator` asigna 0, 1 o 3 puntos.
4. `UnitOfWork.SaveChangesAsync` confirma match + predicciones en una transacción.
5. **RF-10:** `LeaderboardService` lee totales agregados (no recalcula; usa `PointsAwarded` ya persistidos).

---

## 6. Endpoints principales

| RF | Endpoint | Método | Rol |
|----|----------|--------|-----|
| RF-02 | `/api/auth/login` | POST | Anónimo |
| RF-04 | `/api/matches` | GET | User, Admin |
| RF-05 | `/api/predictions` | POST | User |
| RF-06 | `/api/predictions/{id}` | PUT | User |
| RF-07 | `/api/predictions/me` | GET | User, Admin |
| RF-09 / UC-A02 | `/api/admin/matches/{id}/result` | PUT | Admin |
| RF-10 | `/api/leaderboard` | GET | User, Admin |

---

## 7. Persistencia

- **`AppDbContext`:** Identity (`ApplicationUser`) + `Matches` + `Predictions`
- **Constraints:** UNIQUE (`UserId`, `MatchId`); FKs con `Restrict`; goles ≥ 0
- **Leaderboard:** agregación en `PredictionRepository.GetParticipantStatsAsync` (JOIN `Predictions` + `AspNetUsers`)
- **Seed:** `DbSeeder` — 12 partidos, roles User/Admin, usuarios demo (idempotente)

---

## 8. Observabilidad (costo $0)

| Pieza | Implementación |
|-------|----------------|
| Logs estructurados | Serilog JSON → stdout → Render Logs |
| Correlation ID | `X-Correlation-Id` en request/response y logs |
| Health | `GET /health` (liveness), `GET /health/ready` (API + SQL) |

Detalle operativo: [docs/observability.md](../../docs/observability.md).

---

## 9. Decisiones arquitectónicas relevantes

| Decisión | Justificación |
|----------|---------------|
| Clean Architecture (4 capas) | Dominio testeable; Application sin EF directo |
| `ScoringCalculator` en Domain | RN-04 aislada; 14 tests unitarios sin BD |
| JWT (no cookies Identity) | API stateless; `AddIdentityCore` evita conflicto con Bearer |
| API en Render (no App Service) | Cuota Azure App Service; Docker + env vars |
| Frontend en Azure SWA | CI/CD desde GitHub; tier Free |
| Recálculo síncrono en UC-A02 | MVP: volumen bajo (12 partidos, grupo privado) |

---

## Referencias

- [Base de datos](database.md)
- [Azure SQL setup](azure-sql-setup.md)
- [README raíz](../../README.md)
