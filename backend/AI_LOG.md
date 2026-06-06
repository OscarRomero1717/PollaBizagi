# AI_LOG — Polla Mundialista

Registro del uso de herramientas de IA durante el desarrollo (enfoque AI-First).

## Plantilla de entrada

```markdown
## [YYYY-MM-DD HH:mm] — {Área: Domain|Application|Infrastructure|Api|Angular|DevOps|Docs}

**Contexto:** Qué problema se resolvía.
**Prompt resumido:** Intención de la solicitud a la IA (sin secretos ni credenciales).
**Output IA:** Qué generó o propuso la IA.
**Validación humana:** Qué se revisó, cambió o rechazó y por qué.
**Decisión:** Aceptado | Rechazado | Modificado
```

---

## Entradas

### [2026-06-04] — Docs

**Contexto:** Inicio del proyecto — Tarea 001 del backlog MVP 48h.
**Prompt resumido:** Crear estructura de carpetas raíz, `.gitignore`, README esqueleto, plantilla AI_LOG y docs de arquitectura.
**Output IA:** Estructura `src/`, `tests/`, `client/`, `docs/`; archivos marco del repositorio.
**Validación humana:** Estructura alineada con arquitectura MVP Clean Architecture 48h; sin código de aplicación.
**Decisión:** Aceptado

### [2026-06-04] — Application / Infrastructure / Api

**Contexto:** Tarea 002 — solución .NET Clean Architecture con 4 proyectos.
**Prompt resumido:** Crear PollaMundialista.sln, proyectos Domain/Application/Infrastructure/Api en net8.0 con referencias CA y compilación exitosa.
**Output IA:** Solución `PollaMundialista.slnx` (.NET SDK 10), referencias configuradas, carpetas por capa, Program.cs mínimo con Swagger.
**Validación humana:** Infrastructure referencia Application + Domain (necesario para EF/entidades). Api referencia Application + Infrastructure. Build sin errores.
**Decisión:** Aceptado

### [2026-06-04] — Domain (tests)

**Contexto:** Tarea 003 — proyecto de pruebas unitarias de dominio.
**Prompt resumido:** Crear `Polla.Domain.Tests` con xUnit, referencia a Domain, `dotnet test` operativo.
**Output IA:** Proyecto xUnit en `tests/`, carpeta `Services/` para tests de scoring futuros, sin tests aún.
**Validación humana:** Referencia correcta a `Polla.Domain`; runner ejecuta sin errores (0 tests).
**Decisión:** Aceptado

### [2026-06-04] — Domain

**Contexto:** Tarea 004 — entidades y enums del dominio.
**Prompt resumido:** Implementar `Match`, `Prediction` y `MatchStatus` sin dependencias externas, alineados con modelo de dominio MVP.
**Output IA:** POCOs en Domain; `HasOfficialResult` calculado; `GetStatus(utcNow)` para Open/Closed/Scored.
**Validación humana:** Sin atributos EF ni referencias NuGet en Domain; `User` permanece en Identity (Infra). Build OK.
**Decisión:** Aceptado

### [2026-06-04] — Domain

**Contexto:** Tarea 005 — motor de scoring y excepciones de dominio.
**Prompt resumido:** Implementar `ScoringCalculator` puro (RN-04: 3/1/0) y jerarquía `DomainException` para reglas de predicción.
**Output IA:** `ScoringCalculator` estático, `MatchOutcome` enum, excepciones: InvalidScore, PredictionWindowClosed, DuplicatePrediction, UnauthorizedResource.
**Validación humana:** Exacto prioriza 3 sobre 1; goles negativos lanzan `InvalidScoreException`; sin dependencias externas.
**Decisión:** Aceptado

### [2026-06-04] — Domain (tests)

**Contexto:** Tarea 006 — tests unitarios de `ScoringCalculator`.
**Prompt resumido:** ≥6 casos: exacto (3), ganador/empate (1), fallo (0), empates y goles negativos.
**Output IA:** 14 casos xUnit (Facts + Theory) en `ScoringCalculatorTests.cs`.
**Validación humana:** Revisión manual de RN-04; exacto 2-1, draw 1-1 vs 2-2, invalid -1; todos verdes.
**Decisión:** Aceptado

### [2026-06-04] — Application

**Contexto:** Tarea 007 — DTOs request/response para todos los endpoints MVP.
**Prompt resumido:** Crear DTOs en Application por feature (Auth, Matches, Predictions, Leaderboard, Admin, Common) sin referencias EF/ASP.NET.
**Output IA:** 17 DTOs alineados con matriz Endpoint→DTO; `MatchStatus` desde Domain en listado de partidos.
**Validación humana:** Sin lógica en DTOs; wrappers con `IReadOnlyList`; `PredictionSummaryDto` embebido en `MatchListItemDto`.
**Decisión:** Aceptado

### [2026-06-04] — Application

**Contexto:** Tarea 008 — contratos de servicios de aplicación.
**Prompt resumido:** Definir `IAuthService`, `IMatchService`, `IPredictionService`, `ILeaderboardService`, `ICurrentUserService` cubriendo todos los RF.
**Output IA:** 5 interfaces async con DTOs de Tarea 007; `RecalculatePointsForMatchAsync` en `IPredictionService` para RF-08 interno.
**Validación humana:** Sin implementaciones; `GetRequiredUserId()` para operaciones que exigen usuario autenticado.
**Decisión:** Aceptado

### [2026-06-04] — Application

**Contexto:** Tarea 010 — contratos de persistencia para repositorios.
**Prompt resumido:** Definir `IMatchRepository`, `IPredictionRepository`, `IUnitOfWork` sin EF en Application.
**Output IA:** Repos por agregado; `LeaderboardParticipantStats` read model; `Update` síncrono + `SaveChangesAsync` vía UoW.
**Validación humana:** Operaciones cubren RF-04 a RF-10; join Identity para leaderboard queda en implementación Infra.
**Decisión:** Aceptado

### [2026-06-04] — Infrastructure

**Contexto:** Tarea 011 — Identity y JWT.
**Prompt resumido:** `ApplicationUser`, `JwtSettings`, `JwtTokenService`, roles User/Admin, claims con rol en token.
**Output IA:** Identity `ApplicationUser` (Guid), `IJwtTokenService` en Application, implementación Infra, `RoleNames`, test smoke JWT.
**Validación humana:** Key placeholder en appsettings (cambiar en prod); registro DI completo pendiente Tarea 018/019.
**Decisión:** Aceptado

### [2026-06-04] — Infrastructure

**Contexto:** Tarea 012 — EF Core, DbContext y migración inicial.
**Prompt resumido:** `AppDbContext` con Identity + Matches/Predictions, Fluent API, UNIQUE(UserId,MatchId), FKs y check constraints.
**Output IA:** `MatchConfiguration`, `PredictionConfiguration`, `AppDbContextFactory`, migración `InitialCreate`.
**Validación humana:** `AppDbContext` implementa `IUnitOfWork`; tablas Identity + negocio en una BD; `dotnet ef migrations add` exitoso.
**Decisión:** Aceptado

### [2026-06-04] — Infrastructure

**Contexto:** Tarea 013 — implementación de repositorios EF.
**Prompt resumido:** `MatchRepository`, `PredictionRepository` con JOIN Identity para `GetParticipantStatsAsync`.
**Output IA:** Repos en `Persistence/Repositories/`; registro DI parcial en `DependencyInjection.cs`.
**Validación humana:** Leaderboard usa `ScoringCalculator.ExactScorePoints` para exact hits; Identity registro completo pendiente Tarea 018.
**Decisión:** Aceptado

### [2026-06-04] — Infrastructure

**Contexto:** Tarea 014 — seed idempotente de roles, usuarios y 12 partidos.
**Prompt resumido:** `DbSeeder`, `SeedData`, migrate+seed al arranque; admin y user demo.
**Output IA:** 12 partidos mundialistas ficticios; credenciales en README; `AddIdentity` en DI; `InitializeAsync` en Program.cs.
**Validación humana:** Segunda ejecución no duplica matches (`AnyAsync`); usuarios por email; probado con LocalDB.
**Decisión:** Aceptado

### [2026-06-04] — Application

**Contexto:** Tarea 015 — `MatchService` y recálculo delegado.
**Prompt resumido:** `GetMatchesAsync` con status y `myPrediction`; `SetOfficialResultAsync` con validación Admin y recálculo vía `IPredictionService`.
**Output IA:** `MatchService`, `PredictionService.RecalculatePointsForMatchAsync`, `CurrentUserService` en Api, `AddApplication` DI.
**Validación humana:** Create/Update/GetMyPredictions pendiente Tarea 016; transacción con `IUnitOfWork.SaveChangesAsync` al final de set result.
**Decisión:** Aceptado

### [2026-06-04] — Application

**Contexto:** Tarea 016 — `PredictionService` completo.
**Prompt resumido:** Create, Update, GetMyPredictions con RN-01 a RN-03; ventana Open; ownership en update.
**Output IA:** Validaciones con excepciones de dominio; historial con join en memoria matches+predictions; recálculo intacto.
**Validación humana:** `EnsurePredictionWindowOpen` usa `MatchStatus.Open`; puntos visibles en historial solo si match tiene resultado oficial.
**Decisión:** Aceptado

### [2026-06-04] — Application

**Contexto:** Tarea 017 — `LeaderboardService`.
**Prompt resumido:** Ranking con desempate RN-06: puntos → exact hits → predicción más temprana.
**Output IA:** Servicio delgado que ordena `LeaderboardParticipantStats` del repositorio y asigna `Rank`.
**Validación humana:** Sin lógica EF en Application; usuarios sin predicciones no aparecen (GROUP BY en Infra).
**Decisión:** Aceptado

### [2026-06-04] — Application / Infrastructure

**Contexto:** Tarea 009 — `AuthService` register/login.
**Prompt resumido:** Registro con rol User, login con JWT; Identity encapsulado en `IIdentityAccountService` (Infra).
**Output IA:** `AuthService` en Application; `IdentityAccountService` con UserManager; mensaje genérico en login fallido.
**Validación humana:** Application no referencia ASP.NET Identity directamente; email duplicado → `DUPLICATE_EMAIL`.
**Decisión:** Aceptado
