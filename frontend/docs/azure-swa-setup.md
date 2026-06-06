# Azure Static Web Apps — Tarea 037

Despliegue del frontend Angular con CI/CD desde GitHub.

**API producción:** `https://pollabizagi.onrender.com`

---

## 1. Crear Static Web App en Azure Portal

1. [Azure Portal](https://portal.azure.com) → **Crear un recurso** → **Static Web App**
2. Configuración:

| Campo | Valor |
|-------|-------|
| Suscripción | La tuya |
| Grupo de recursos | `rg-polla-mundialista` |
| Nombre | `polla-web-od` (único) |
| Plan | **Free** |
| Región | East US 2 (o la disponible) |
| Origen | **GitHub** → autorizar Azure |
| Organización | `OscarRomero1717` |
| Repositorio | `PollaBizagi` |
| Rama | `main` |
| **Preset de compilación** | **Angular** |

### Build Details (monorepo)

| Campo | Valor |
|-------|-------|
| **App location** | `frontend/polla-web` |
| **Api location** | *(dejar vacío — API en Render)* |
| **Output location** | `dist/polla-web/browser` |

> Angular 17+ genera salida en `dist/polla-web/browser`. Si el deploy falla por ruta, prueba `dist/polla-web`.

### Corregir workflow si Azure generó rutas incorrectas

Edita `.github/workflows/azure-static-web-apps-*.yml`:

```yaml
app_location: "frontend/polla-web"
output_location: "dist/polla-web/browser"
app_build_command: "npm install && npm run build"
```

3. **Revisar y crear** → esperar workflow en GitHub

---

## 2. GitHub Actions (automático)

Azure crea `.github/workflows/azure-static-web-apps-*.yml` en el repo.

Cada `git push` a `main` construye y despliega el frontend.

---

## 3. URL pública

Tras el primer deploy exitoso:

```
https://polla-web-od.azurestaticapps.net
```

(Ajusta según el nombre que elegiste.)

---

## 4. Tarea 038 — CORS en Render

En Render → Environment, actualiza o agrega:

```
Cors__AllowedOrigins__0 = https://polla-web-od.azurestaticapps.net
```

Guarda y redeploy. Sin esto, el login desde SWA fallará por CORS.

---

## 5. Verificar flujo E2E público

1. Abrir URL de Static Web Apps
2. Login: `user@polla.demo` / `User123!`
3. Partidos → predicción
4. Login admin: `admin@polla.demo` / `Admin123!` → publicar resultado
5. Leaderboard actualizado

---

## Problemas frecuentes

| Error | Solución |
|-------|----------|
| 404 en rutas `/login`, `/matches` | Verificar `staticwebapp.config.json` en repo |
| CORS en login | Actualizar `Cors__AllowedOrigins__0` en Render (Tarea 038) |
| Build falla en GitHub | Revisar `output location` (`browser` subcarpeta) |
| API timeout | Render Free cold start ~30–60 s |
