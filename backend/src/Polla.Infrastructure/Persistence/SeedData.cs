namespace Polla.Infrastructure.Persistence;

public static class SeedData
{
    public const string AdminEmail = "admin@polla.demo";
    public const string AdminPassword = "Admin123!";
    public const string AdminDisplayName = "Administrador";

    public const string DemoUserEmail = "user@polla.demo";
    public const string DemoUserPassword = "User123!";
    public const string DemoUserDisplayName = "Usuario Demo";

    public static readonly (string Home, string Away, DateTime KickoffUtc)[] Matches =
    [
        ("Brasil", "Argentina", new DateTime(2026, 6, 10, 18, 0, 0, DateTimeKind.Utc)),
        ("Alemania", "Francia", new DateTime(2026, 6, 11, 20, 0, 0, DateTimeKind.Utc)),
        ("España", "Italia", new DateTime(2026, 6, 12, 18, 0, 0, DateTimeKind.Utc)),
        ("Inglaterra", "Portugal", new DateTime(2026, 6, 13, 16, 0, 0, DateTimeKind.Utc)),
        ("México", "Estados Unidos", new DateTime(2026, 6, 14, 22, 0, 0, DateTimeKind.Utc)),
        ("Países Bajos", "Bélgica", new DateTime(2026, 6, 15, 18, 0, 0, DateTimeKind.Utc)),
        ("Uruguay", "Colombia", new DateTime(2026, 6, 16, 20, 0, 0, DateTimeKind.Utc)),
        ("Croacia", "Suiza", new DateTime(2026, 6, 17, 16, 0, 0, DateTimeKind.Utc)),
        ("Japón", "Corea del Sur", new DateTime(2026, 6, 18, 12, 0, 0, DateTimeKind.Utc)),
        ("Marruecos", "Senegal", new DateTime(2026, 6, 19, 18, 0, 0, DateTimeKind.Utc)),
        ("Polonia", "Suecia", new DateTime(2026, 6, 20, 20, 0, 0, DateTimeKind.Utc)),
        ("Australia", "Canadá", new DateTime(2026, 6, 21, 14, 0, 0, DateTimeKind.Utc))
    ];
}
