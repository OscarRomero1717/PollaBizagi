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
| `src/environments/environment.prod.ts` | `https://pollabizagi.onrender.com` (producción) |


