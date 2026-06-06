# Polla Mundialista — Crear/actualizar BD local (LocalDB)
# Uso: .\scripts\setup-database.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "=== Polla Mundialista — Setup base de datos ===" -ForegroundColor Cyan
Write-Host "Directorio proyecto: $Root"
Write-Host ""

# 1. Compilar solución
Write-Host "[1/3] Compilando solución..." -ForegroundColor Yellow
Set-Location $Root
dotnet build PollaMundialista.slnx
if ($LASTEXITCODE -ne 0) { throw "Error en dotnet build" }

# 2. Aplicar migraciones EF
Write-Host "[2/3] Aplicando migraciones EF Core..." -ForegroundColor Yellow
dotnet ef database update `
    --project src/Polla.Infrastructure/Polla.Infrastructure.csproj `
    --startup-project src/Polla.Api/Polla.Api.csproj
if ($LASTEXITCODE -ne 0) { throw "Error en dotnet ef database update" }

# 3. Seed (se ejecuta al arrancar la API; opcional aquí)
Write-Host "[3/3] Para seed de roles/usuarios/partidos, ejecuta:" -ForegroundColor Yellow
Write-Host "      .\scripts\run-api.ps1" -ForegroundColor White
Write-Host "      (el seed corre automaticamente al iniciar)" -ForegroundColor Gray
Write-Host ""
Write-Host "OK — Base de datos lista. Explorar con:" -ForegroundColor Green
Write-Host "      sqlcmd -S (localdb)\mssqllocaldb -d PollaMundialista -i scripts\explore-database.sql" -ForegroundColor White
