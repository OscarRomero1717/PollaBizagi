# Polla Mundialista — Eliminar y recrear BD local (CUIDADO: borra datos)
# Uso: .\scripts\reset-database.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "=== RESET base de datos PollaMundialista ===" -ForegroundColor Red
$confirm = Read-Host "Esto eliminara la BD local. Continuar? (s/N)"
if ($confirm -ne "s") { Write-Host "Cancelado."; exit 0 }

Set-Location $Root

Write-Host "Eliminando BD..." -ForegroundColor Yellow
dotnet ef database drop --force `
    --project src/Polla.Infrastructure/Polla.Infrastructure.csproj `
    --startup-project src/Polla.Api/Polla.Api.csproj

Write-Host "Recreando BD + migraciones..." -ForegroundColor Yellow
dotnet ef database update `
    --project src/Polla.Infrastructure/Polla.Infrastructure.csproj `
    --startup-project src/Polla.Api/Polla.Api.csproj

Write-Host ""
Write-Host "OK. Ejecuta .\scripts\run-api.ps1 para aplicar seed." -ForegroundColor Green
