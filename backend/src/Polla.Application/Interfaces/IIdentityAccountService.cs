namespace Polla.Application.Interfaces;

public interface IIdentityAccountService
{
    Task<CreatedUserResult> RegisterAsync(
        string email,
        string password,
        string displayName,
        string role,
        CancellationToken cancellationToken = default);

    Task<AuthenticatedUserResult?> AuthenticateAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);

    Task<UserSummaryResult?> GetUserSummaryAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}

public sealed class CreatedUserResult
{
    public Guid UserId { get; init; }

    public string Email { get; init; } = string.Empty;

    public string DisplayName { get; init; } = string.Empty;
}

public sealed class AuthenticatedUserResult
{
    public Guid UserId { get; init; }

    public string Email { get; init; } = string.Empty;

    public string DisplayName { get; init; } = string.Empty;

    public string Role { get; init; } = string.Empty;
}

public sealed class UserSummaryResult
{
    public Guid UserId { get; init; }

    public string DisplayName { get; init; } = string.Empty;
}
