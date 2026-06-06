# Polla Mundialista — Prueba manual API (HTTP)
# Requiere: API corriendo (.\scripts\run-api.ps1) + Controllers (Tarea 019+)
# Uso: .\scripts\manual-api-test.ps1 [-BaseUrl "http://localhost:5299"]

param(
    [string]$BaseUrl = "http://localhost:5299"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Polla Mundialista — Smoke test API ===" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl"
Write-Host ""
Write-Host "NOTA: Los endpoints REST se implementan en Tareas 019-025." -ForegroundColor Yellow
Write-Host "      Si aun no hay controllers, este script fallara en los pasos HTTP." -ForegroundColor Yellow
Write-Host ""

function Invoke-Api {
    param($Method, $Path, $Body = $null, $Token = $null)
    $headers = @{ "Content-Type" = "application/json" }
    if ($Token) { $headers["Authorization"] = "Bearer $Token" }
    $params = @{
        Uri = "$BaseUrl$Path"
        Method = $Method
        Headers = $headers
    }
    if ($Body) { $params.Body = ($Body | ConvertTo-Json) }
    return Invoke-RestMethod @params
}

try {
    # --- 1. Login usuario demo ---
    Write-Host "[1] Login user@polla.demo ..." -ForegroundColor Yellow
    $loginUser = Invoke-Api -Method POST -Path "/api/auth/login" -Body @{
        email = "user@polla.demo"
        password = "User123!"
    }
    $userToken = $loginUser.token
    Write-Host "    OK — Rol: $($loginUser.role)" -ForegroundColor Green

    # --- 2. Login admin ---
    Write-Host "[2] Login admin@polla.demo ..." -ForegroundColor Yellow
    $loginAdmin = Invoke-Api -Method POST -Path "/api/auth/login" -Body @{
        email = "admin@polla.demo"
        password = "Admin123!"
    }
    $adminToken = $loginAdmin.token
    Write-Host "    OK — Rol: $($loginAdmin.role)" -ForegroundColor Green

    # --- 3. Listar partidos ---
    Write-Host "[3] GET /api/matches ..." -ForegroundColor Yellow
    $matches = Invoke-Api -Method GET -Path "/api/matches" -Token $userToken
    Write-Host "    OK — Partidos: $($matches.matches.Count)" -ForegroundColor Green

    # --- 4. Crear prediccion (primer partido Open) ---
    $firstMatch = $matches.matches | Where-Object { $_.status -eq 0 -or $_.status -eq "Open" } | Select-Object -First 1
    if (-not $firstMatch) { $firstMatch = $matches.matches[0] }

    Write-Host "[4] POST /api/predictions (match $($firstMatch.id): 2-1) ..." -ForegroundColor Yellow
    $prediction = Invoke-Api -Method POST -Path "/api/predictions" -Token $userToken -Body @{
        matchId = $firstMatch.id
        homeGoals = 2
        awayGoals = 1
    }
    Write-Host "    OK — Prediction Id: $($prediction.id)" -ForegroundColor Green

    # --- 5. Admin publica resultado ---
    Write-Host "[5] PUT /api/admin/matches/$($firstMatch.id)/result (2-1) ..." -ForegroundColor Yellow
    $result = Invoke-Api -Method PUT -Path "/api/admin/matches/$($firstMatch.id)/result" -Token $adminToken -Body @{
        homeGoals = 2
        awayGoals = 1
    }
    Write-Host "    OK — Predicciones actualizadas: $($result.predictionsUpdated)" -ForegroundColor Green

    # --- 6. Leaderboard ---
    Write-Host "[6] GET /api/leaderboard ..." -ForegroundColor Yellow
    $leaderboard = Invoke-Api -Method GET -Path "/api/leaderboard" -Token $userToken
    $leaderboard.entries | ForEach-Object {
        Write-Host "    #$($_.rank) $($_.displayName) — $($_.totalPoints) pts (exactos: $($_.exactHits))" -ForegroundColor White
    }

    # --- 7. Mis predicciones ---
    Write-Host "[7] GET /api/predictions/me ..." -ForegroundColor Yellow
    $mine = Invoke-Api -Method GET -Path "/api/predictions/me" -Token $userToken
    Write-Host "    OK — Predicciones: $($mine.predictions.Count)" -ForegroundColor Green

    Write-Host ""
    Write-Host "=== Smoke test completado ===" -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
    Write-Host ""
    Write-Host "Si el error es 404: aun faltan controllers (Tarea 019+)." -ForegroundColor Yellow
    exit 1
}
