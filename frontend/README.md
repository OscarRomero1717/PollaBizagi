# Polla Mundialista — Frontend

SPA Angular 17 (standalone) en `polla-web/`.

## Requisitos

- Node.js 20+
- API backend corriendo en `http://localhost:5299` (o `https://localhost:7289`)

## Comandos

```powershell
cd polla-web
npm install
ng serve
```

App local: `http://localhost:4200`

## Environments

| Archivo | `apiUrl` |
|---------|----------|
| `src/environments/environment.ts` | `http://localhost:5299` (desarrollo) |
| `src/environments/environment.prod.ts` | URL de API en producción (pendiente deploy) |

## Estado

- ✅ Tarea 027 — Proyecto Angular + environments
- ✅ Tarea 028 — Core auth (models, AuthService, interceptor, guards)
- ✅ Tarea 029 — Pantallas Login y Register
- ✅ Tarea 030 — App shell y navegación
- ✅ Tarea 031 — MatchesPage con predicciones
- ✅ Tarea 032 — MyPredictionsPage
- ✅ Tarea 033 — LeaderboardPage
- ✅ Tarea 034 — AdminResultsPage
