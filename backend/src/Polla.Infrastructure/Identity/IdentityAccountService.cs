using Microsoft.AspNetCore.Identity;
using Polla.Application.Interfaces;
using Polla.Domain.Exceptions;

namespace Polla.Infrastructure.Identity;

public class IdentityAccountService : IIdentityAccountService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityAccountService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<CreatedUserResult> RegisterAsync(
        string email,
        string password,
        string displayName,
        string role,
        CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser is not null)
            throw new DomainException("DUPLICATE_EMAIL", "Email is already registered.");

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = email,
            UserName = email,
            DisplayName = displayName,
            EmailConfirmed = true
        };

        var createResult = await _userManager.CreateAsync(user, password);
        if (!createResult.Succeeded)
        {
            var message = string.Join(" ", createResult.Errors.Select(e => e.Description));
            throw new DomainException("REGISTRATION_FAILED", message);
        }

        var roleResult = await _userManager.AddToRoleAsync(user, role);
        if (!roleResult.Succeeded)
        {
            var message = string.Join(" ", roleResult.Errors.Select(e => e.Description));
            throw new DomainException("REGISTRATION_FAILED", message);
        }

        return new CreatedUserResult
        {
            UserId = user.Id,
            Email = user.Email!,
            DisplayName = user.DisplayName
        };
    }

    public async Task<AuthenticatedUserResult?> AuthenticateAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
            return null;

        var passwordValid = await _userManager.CheckPasswordAsync(user, password);
        if (!passwordValid)
            return null;

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? string.Empty;

        return new AuthenticatedUserResult
        {
            UserId = user.Id,
            Email = user.Email!,
            DisplayName = user.DisplayName,
            Role = role
        };
    }
}
