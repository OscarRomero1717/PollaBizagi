# Polla Mundialista — Aplicar migraciones EF en Azure SQL
# Uso:
#   .\scripts\setup-azure-database.ps1 -ConnectionString "Server=tcp:....database.windows.net,1433;..."
#   .\scripts\setup-azure-database.ps1 -ConnectionString (Get-Content .\connection-string.txt -Raw)

param(
    [Parameter(Mandatory = $true)]
    [string]$ConnectionString
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "=== Polla Mundialista — Setup Azure SQL ===" -ForegroundColor Cyan
Write-Host ""

if ($ConnectionString -match "REPLACE_") {
    throw "La cadena de conexion contiene placeholders. Usa la cadena real de Azure Portal."
}

Write-Host "[1/2] Compilando solucion..." -ForegroundColor Yellow
Set-Location $Root
dotnet build PollaMundialista.slnx
if ($LASTEXITCODE -ne 0) { throw "Error en dotnet build" }

Write-Host "[2/2] Aplicando migraciones en Azure SQL..." -ForegroundColor Yellow
dotnet ef database update `
    --project src/Polla.Infrastructure/Polla.Infrastructure.csproj `
    --startup-project src/Polla.Api/Polla.Api.csproj `
    --connection $ConnectionString
if ($LASTEXITCODE -ne 0) { throw "Error en dotnet ef database update" }

Write-Host ""
Write-Host "OK — Migraciones aplicadas en Azure SQL." -ForegroundColor Green
Write-Host ""
Write-Host "Siguiente paso (seed de roles, usuarios demo y 12 partidos):" -ForegroundColor Yellow
Write-Host "  1. Configura ConnectionStrings__DefaultConnection en App Service (Tarea 036)" -ForegroundColor White
Write-Host "  2. Arranca la API una vez en Production (InitializeAsync ejecuta migrate + seed)" -ForegroundColor White
Write-Host ""
Write-Host "O ejecuta localmente apuntando a Azure:" -ForegroundColor Yellow
Write-Host '  $env:ConnectionStrings__DefaultConnection = "<tu-cadena>"' -ForegroundColor Gray
Write-Host '  $env:ASPNETCORE_ENVIRONMENT = "Production"' -ForegroundColor Gray
Write-Host '  dotnet run --project src/Polla.Api --launch-profile https' -ForegroundColor Gray
