using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Polla.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(this IHost host)
    {
        using var scope = host.Services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbSeeder>>();
        var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();

        try
        {
            await seeder.SeedAsync();
            logger.LogInformation("Database migration and seed completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating or seeding the database.");
            throw;
        }
    }
}
