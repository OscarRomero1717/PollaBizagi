using Microsoft.Extensions.DependencyInjection;
using Polla.Application.Interfaces;
using Polla.Application.Services;

namespace Polla.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IMatchService, MatchService>();
        services.AddScoped<IPredictionService, PredictionService>();
        services.AddScoped<ILeaderboardService, LeaderboardService>();

        return services;
    }
}
