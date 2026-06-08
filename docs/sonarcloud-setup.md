# SonarCloud — Análisis de calidad de código

Integración de **SonarCloud** con GitHub Actions para medir bugs, vulnerabilidades, code smells y cobertura de tests.

---

## 1. Crear proyecto en SonarCloud

1. Entra a [sonarcloud.io](https://sonarcloud.io) e inicia sesión con **GitHub** (`OscarRomero1717`).
2. **+** → **Analyze new project** → selecciona `PollaBizagi`.
3. Confirma la organización (ej. `oscarromero1717`).
4. Verifica que el **Project Key** sea:

```
OscarRomero1717_PollaBizagi
```

> Debe coincidir con `sonar-project.properties` en la raíz del repo.

5. Si SonarCloud ofrece generar workflow automático, **no lo reemplaces** — ya existe `.github/workflows/sonarcloud.yml`.

---

## 2. Token `SONAR_TOKEN` en GitHub

1. SonarCloud → avatar → **My Account** → **Security** → **Generate Token**.
2. Nombre sugerido: `github-pollabizagi`.
3. Copia el token (solo se muestra una vez).
4. GitHub → `PollaBizagi` → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - Name: `SONAR_TOKEN`
   - Value: el token copiado

---

## 3. Primer análisis

Tras configurar el secret, haz push a `main` o ejecuta el workflow manualmente:

**GitHub** → **Actions** → **SonarCloud Analysis** → **Run workflow**

El pipeline:

1. Compila el backend (`Polla.Api` + dependencias).
2. Ejecuta 15 tests xUnit con cobertura Coverlet.
3. Sube el análisis a SonarCloud.
4. Evalúa el **Quality Gate**.

---

## 4. Dashboard y badge

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

## 5. Archivos del repo

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

## 6. Análisis local (opcional)

Requiere [SonarScanner CLI](https://docs.sonarsource.com/sonarqube-cloud/advanced-setup/analyzing-source-code/scanners/sonarscanner/) y variable de entorno:

```powershell
$env:SONAR_TOKEN = "tu-token"

cd backend
dotnet test tests/Polla.Domain.Tests/Polla.Domain.Tests.csproj -c Release `
  --collect:"XPlat Code Coverage" `
  --results-directory ./TestResults

cd ..
sonar-scanner -Dsonar.login=$env:SONAR_TOKEN
```

---

## 7. Problemas frecuentes

| Error | Solución |
|-------|----------|
| `SONAR_TOKEN` not found | Crear secret en GitHub Actions |
| Project not found | Verificar `sonar.projectKey` y que el proyecto exista en SonarCloud |
| Quality Gate failed | Revisar Issues en dashboard; corregir o marcar false positive |
| Coverage 0 % | Confirmar que `dotnet test` genera `coverage.cobertura.xml` en `backend/TestResults/` |

---

