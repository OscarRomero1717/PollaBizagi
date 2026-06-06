# Observabilidad — Polla Mundialista (costo $0)

Observabilidad pragmática para el MVP: logs estructurados, correlation ID y health checks.

---

## Componentes

| Pieza | Tecnología | Costo | Dónde verlo |
|-------|------------|-------|-------------|
| Logs estructurados | Serilog → stdout | $0 | Render → **Logs** |
| Correlation ID | `X-Correlation-Id` | $0 | Header HTTP + logs |
| Request timing | Serilog request logging | $0 | Campo `Elapsed` en logs |
| Liveness | `GET /health` | $0 | API pública |
| Readiness (+ SQL) | `GET /health/ready` | $0 | API + Azure SQL |
| Calidad estática | SonarCloud | $0 | Dashboard Sonar |

---

## 1. Logs en Render

La API escribe a **stdout**. En Production los logs son **JSON compacto** (una línea por evento).

### Ejemplo de log de request

```json
{
  "@t": "2026-06-05T14:30:00.1234567Z",
  "@l": "Information",
  "@mt": "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms",
  "RequestMethod": "POST",
  "RequestPath": "/api/auth/login",
  "StatusCode": 200,
  "Elapsed": 145.32,
  "CorrelationId": "a1b2c3d4e5f6",
  "UserId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "Application": "Polla.Api",
  "Environment": "Production"
}
```

### Búsquedas útiles en Render Logs

| Filtro | Para qué |
|--------|----------|
| `"@l":"Error"` | Errores 5xx / excepciones |
| `"StatusCode":401` | Logins fallidos |
| `"CorrelationId":"abc123"` | Seguir un request específico |
| `"Elapsed":` + valor alto | Cold start o latencia |

### Qué NO se loguea

- Contraseñas
- JWT completos
- Connection strings

---

## 2. Correlation ID

| Dirección | Comportamiento |
|-----------|----------------|
| Cliente → API | Angular envía `X-Correlation-Id` (UUID) |
| API → Cliente | La API devuelve el mismo header en la respuesta |
| Errores en UI | Mensaje incluye `(Ref: <id>)` para soporte |

### Probar manualmente

```powershell
$headers = @{ "X-Correlation-Id" = "demo-correlation-001" }
Invoke-RestMethod -Method Get -Uri "https://pollabizagi.onrender.com/health" -Headers $headers
# Revisar en Render Logs: CorrelationId = demo-correlation-001
```

---

## 3. Health checks

| Endpoint | Valida | Uso |
|----------|--------|-----|
| `GET /health` | API viva (`self`) | Liveness / ping |
| `GET /health/ready` | API + Azure SQL | Readiness |

### Respuesta ejemplo

```json
{
  "status": "Healthy",
  "totalDurationMs": 38,
  "checks": {
    "database": {
      "status": "Healthy",
      "durationMs": 35,
      "description": null
    }
  }
}
```

### Comandos

```powershell
# Local
Invoke-RestMethod http://localhost:5299/health
Invoke-RestMethod http://localhost:5299/health/ready

# Producción
Invoke-RestMethod https://pollabizagi.onrender.com/health
Invoke-RestMethod https://pollabizagi.onrender.com/health/ready
```

---

## 4. SLIs sugeridos (sin herramienta extra)

| SLI | Señal | Umbral orientativo MVP |
|-----|-------|------------------------|
| Disponibilidad | `/health/ready` = Healthy | > 99% pings |
| Errores | % logs `@l:Error` | < 1% requests |
| Latencia | `Elapsed` en request logs | p95 < 2 s (excl. cold start) |

---

## 5. Evolución futura (fase 2, sigue $0)

| Paso | Herramienta |
|------|-------------|
| Uptime externo | UptimeRobot → ping `/health` |
| Métricas + traces | OpenTelemetry → Grafana Cloud free |
| Alertas | Render notifications / Grafana |

Los logs JSON actuales ya son compatibles con ingestión OTLP/Loki sin cambiar el contrato de `X-Correlation-Id`.

---

## Archivos relevantes

| Archivo | Rol |
|---------|-----|
| `backend/src/Polla.Api/Extensions/ObservabilityExtensions.cs` | Serilog + health |
| `backend/src/Polla.Api/Middleware/CorrelationIdMiddleware.cs` | Correlation ID |
| `frontend/polla-web/src/app/core/interceptors/correlation.interceptor.ts` | Header en SPA |
