namespace Polla.Application.Interfaces;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAt) CreateToken(
        Guid userId,
        string email,
        string displayName,
        string role);
}
