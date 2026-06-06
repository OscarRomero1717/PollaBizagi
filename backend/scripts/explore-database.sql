-- Polla Mundialista — Consultas de exploración manual
-- Ejecutar con:
--   sqlcmd -S (localdb)\mssqllocaldb -d PollaMundialista -i scripts\explore-database.sql
-- O abrir en SSMS / Azure Data Studio conectado a (localdb)\mssqllocaldb

USE PollaMundialista;
GO

PRINT '=== 1. RESUMEN GENERAL ===';
SELECT 'Matches' AS Tabla, COUNT(*) AS Filas FROM Matches
UNION ALL SELECT 'Predictions', COUNT(*) FROM Predictions
UNION ALL SELECT 'AspNetUsers', COUNT(*) FROM AspNetUsers
UNION ALL SELECT 'AspNetRoles', COUNT(*) FROM AspNetRoles
UNION ALL SELECT 'AspNetUserRoles', COUNT(*) FROM AspNetUserRoles;
GO

PRINT '=== 2. ROLES ===';
SELECT r.Name AS Rol, COUNT(ur.UserId) AS Usuarios
FROM AspNetRoles r
LEFT JOIN AspNetUserRoles ur ON ur.RoleId = r.Id
GROUP BY r.Name;
GO

PRINT '=== 3. USUARIOS DEMO ===';
SELECT u.Email, u.DisplayName, r.Name AS Rol
FROM AspNetUsers u
LEFT JOIN AspNetUserRoles ur ON ur.UserId = u.Id
LEFT JOIN AspNetRoles r ON r.Id = ur.RoleId
ORDER BY u.Email;
GO

PRINT '=== 4. PARTIDOS (12 seed) ===';
SELECT
    Id,
    HomeTeam,
    AwayTeam,
    KickoffUtc,
    OfficialHomeGoals,
    OfficialAwayGoals,
    CASE
        WHEN OfficialHomeGoals IS NOT NULL THEN 'Scored'
        WHEN KickoffUtc > GETUTCDATE() THEN 'Open'
        ELSE 'Closed'
    END AS Estado
FROM Matches
ORDER BY KickoffUtc;
GO

PRINT '=== 5. PREDICCIONES (si existen) ===';
SELECT
    p.Id,
    u.DisplayName,
    m.HomeTeam + ' vs ' + m.AwayTeam AS Partido,
    p.PredictedHomeGoals,
    p.PredictedAwayGoals,
    p.PointsAwarded,
    p.CreatedAtUtc
FROM Predictions p
JOIN AspNetUsers u ON u.Id = p.UserId
JOIN Matches m ON m.Id = p.MatchId
ORDER BY p.CreatedAtUtc DESC;
GO

PRINT '=== 6. LEADERBOARD (misma logica que la app) ===';
SELECT
    u.DisplayName,
    SUM(p.PointsAwarded) AS TotalPoints,
    SUM(CASE WHEN p.PointsAwarded = 3 THEN 1 ELSE 0 END) AS ExactHits,
    MIN(p.CreatedAtUtc) AS EarliestPredictionUtc
FROM Predictions p
JOIN AspNetUsers u ON u.Id = p.UserId
GROUP BY u.Id, u.DisplayName
ORDER BY TotalPoints DESC, ExactHits DESC, EarliestPredictionUtc ASC;
GO

PRINT '=== 7. CONSTRAINTS DE PREDICTIONS ===';
SELECT
    i.name AS Indice,
    i.is_unique AS EsUnico,
    c.name AS Columna
FROM sys.indexes i
JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE i.object_id = OBJECT_ID('Predictions')
ORDER BY i.name, ic.key_ordinal;
GO
