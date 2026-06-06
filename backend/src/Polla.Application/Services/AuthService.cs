using Polla.Application.Common;
using Polla.Application.DTOs.Auth;
using Polla.Application.Interfaces;
using Polla.Domain.Exceptions;

namespace Polla.Application.Services;

public class AuthService : IAuthService
{
    private readonly IIdentityAccountService _identityAccountService;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        IIdentityAccountService identityAccountService,
        IJwtTokenService jwtTokenService)
    {
        _identityAccountService = identityAccountService;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<RegisterResponseDto> RegisterAsync(
        RegisterRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new DomainException("INVALID_EMAIL", "Email is required.");

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new DomainException("INVALID_PASSWORD", "Password is required.");

        if (string.IsNullOrWhiteSpace(request.DisplayName))
            throw new DomainException("INVALID_DISPLAY_NAME", "Display name is required.");

        var user = await _identityAccountService.RegisterAsync(
            request.Email.Trim(),
            request.Password,
            request.DisplayName.Trim(),
            RoleNames.User,
            cancellationToken);

        return new RegisterResponseDto
        {
            UserId = user.UserId,
            Email = user.Email
        };
    }

    public async Task<LoginResponseDto> LoginAsync(
        LoginRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new DomainException("INVALID_CREDENTIALS", "Invalid email or password.");

        var user = await _identityAccountService.AuthenticateAsync(
            request.Email.Trim(),
            request.Password,
            cancellationToken);

        if (user is null)
            throw new DomainException("INVALID_CREDENTIALS", "Invalid email or password.");

        var (token, expiresAt) = _jwtTokenService.CreateToken(
            user.UserId,
            user.Email,
            user.DisplayName,
            user.Role);

        return new LoginResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            Role = user.Role,
            DisplayName = user.DisplayName
        };
    }
}
