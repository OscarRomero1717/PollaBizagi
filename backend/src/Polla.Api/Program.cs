using Polla.Api.Extensions;
using Polla.Api.Middleware;
using Polla.Api.Services;
using Polla.Application.Interfaces;
using Polla.Infrastructure;
using Polla.Infrastructure.Persistence;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.AddObservabilityLogging();

    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
    builder.Services.AddControllers();
    builder.Services.AddInfrastructure(builder.Configuration);
    builder.Services.AddApiServices(builder.Configuration, builder.Environment);
    builder.Services.AddObservabilityHealthChecks();

    var app = builder.Build();

    app.UseObservability();
    app.UseMiddleware<ExceptionHandlingMiddleware>();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    if (!app.Environment.IsDevelopment())
        app.UseHttpsRedirection();

    app.UseCors("SpaPolicy");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    await app.InitializeAsync();

    Log.Information("Polla API started ({Environment})", app.Environment.EnvironmentName);
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Polla API terminated unexpectedly");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
