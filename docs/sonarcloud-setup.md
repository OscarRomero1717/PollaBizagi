# SonarCloud — Análisis de calidad de código

Integración de **SonarCloud** con GitHub Actions para medir bugs, vulnerabilidades, code smells y cobertura de tests.

---

## 1.  Primer análisis


Tras configurar el secret, haz push a `main` o ejecuta el workflow manualmente:

**GitHub** → **Actions** → **SonarCloud Analysis** → **Run workflow**

El pipeline:

1. Compila el backend (`Polla.Api` + dependencias).
2. Ejecuta 15 tests xUnit con cobertura Coverlet.
3. Sube el análisis a SonarCloud.
4. Evalúa el **Quality Gate**.

---

## 2. Dashboard y badge

| Recurso | URL |
|---------|-----|
| Dashboard | `https://sonarcloud.io/project/overview?id=OscarRomero1717_PollaBizagi` |
| Quality Gate badge | Ya incluido en `README.md` |

Métricas visibles para la entrevista:

| Métrica | Qué demuestra |
|---------|----------------|
| **Bugs** | Errores probables en runtime |
| **Vulnerabilities** | Riesgos de seguridad |
| **Code Smells** | Mantenibilidad |
| **Coverage** | % cubierto por tests (dominio/scoring) |
| **Quality Gate** | Pasa / falla según umbrales SonarCloud |

---

## 3. Archivos del repo

| Archivo | Rol |
|---------|-----|
| `sonar-project.properties` | Clave, organización, fuentes y exclusiones |
| `.github/workflows/sonarcloud.yml` | CI en push/PR a `main` |

### Exclusiones intencionales

| Patrón | Motivo |
|--------|--------|
| `SeedData.cs` | Contraseñas demo del seed (no secretos de producción) |
| `appsettings*.json` | Placeholders JWT locales |
| `environment*.ts` | URLs de API por entorno |
| `Migrations/` | Código generado por EF |

---



