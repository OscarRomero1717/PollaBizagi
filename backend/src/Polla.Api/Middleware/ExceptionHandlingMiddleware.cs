using System.Net;
using System.Text.Json;
using Polla.Application.DTOs.Common;
using Polla.Domain.Exceptions;

namespace Polla.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, code, message) = MapException(exception);

        if (statusCode >= (int)HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
        else
            _logger.LogWarning(exception, "Handled exception: {Code} — {Message}", code, message);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = new ErrorResponseDto { Code = code, Message = message };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }

    private static (int StatusCode, string Code, string Message) MapException(Exception exception)
    {
        return exception switch
        {
            UnauthorizedAccessException => (
                StatusCodes.Status401Unauthorized,
                "UNAUTHORIZED",
                "Authentication is required."),

            DomainException domainEx => MapDomainException(domainEx),

            _ => (
                StatusCodes.Status500InternalServerError,
                "INTERNAL_ERROR",
                "An unexpected error occurred.")
        };
    }

    private static (int StatusCode, string Code, string Message) MapDomainException(DomainException exception)
    {
        var statusCode = exception.Code switch
        {
            "INVALID_CREDENTIALS" or "UNAUTHORIZED" => StatusCodes.Status401Unauthorized,
            "UNAUTHORIZED_RESOURCE" => StatusCodes.Status403Forbidden,
            "MATCH_NOT_FOUND" or "PREDICTION_NOT_FOUND" => StatusCodes.Status404NotFound,
            "DUPLICATE_EMAIL" or "DUPLICATE_PREDICTION" => StatusCodes.Status409Conflict,
            "PREDICTION_WINDOW_CLOSED" => StatusCodes.Status422UnprocessableEntity,
            "INVALID_SCORE" or "INVALID_EMAIL" or "INVALID_PASSWORD" or "INVALID_DISPLAY_NAME" or "REGISTRATION_FAILED" => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status400BadRequest
        };

        return (statusCode, exception.Code, exception.Message);
    }
}
