# Polla Mundialista — Arrancar API (migrate + seed automatico)
# Uso: .\scripts\run-api.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "=== Polla Mundialista — Iniciar API ===" -ForegroundColor Cyan
Write-Host "Al arrancar: migrate + seed (12 partidos, admin, user demo)" -ForegroundColor Gray
Write-Host "API HTTP:  http://localhost:5299" -ForegroundColor Gray
Write-Host "API HTTPS: https://localhost:7289" -ForegroundColor Gray
Write-Host "Swagger:   https://localhost:7289/swagger" -ForegroundColor Gray
Write-Host ""

Set-Location "$Root\src\Polla.Api"
dotnet run --launch-profile https
