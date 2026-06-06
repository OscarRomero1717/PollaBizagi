using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Polla.Application.Common;
using Polla.Domain.Entities;
using Polla.Infrastructure.Identity;

namespace Polla.Infrastructure.Persistence;

public class DbSeeder
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public DbSeeder(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole<Guid>> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.MigrateAsync(cancellationToken);

        await SeedRolesAsync(cancellationToken);
        await SeedUsersAsync(cancellationToken);
        await SeedMatchesAsync(cancellationToken);
    }

    private async Task SeedRolesAsync(CancellationToken cancellationToken)
    {
        foreach (var roleName in IdentityOptionsConfiguration.SeedRoles)
        {
            if (await _roleManager.RoleExistsAsync(roleName))
                continue;

            var result = await _roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create role '{roleName}': {errors}");
            }
        }
    }

    private async Task SeedUsersAsync(CancellationToken cancellationToken)
    {
        await EnsureUserAsync(
            SeedData.AdminEmail,
            SeedData.AdminPassword,
            SeedData.AdminDisplayName,
            RoleNames.Admin,
            cancellationToken);

        await EnsureUserAsync(
            SeedData.DemoUserEmail,
            SeedData.DemoUserPassword,
            SeedData.DemoUserDisplayName,
            RoleNames.User,
            cancellationToken);
    }

    private async Task EnsureUserAsync(
        string email,
        string password,
        string displayName,
        string role,
        CancellationToken cancellationToken)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser is not null)
        {
            if (!await _userManager.IsInRoleAsync(existingUser, role))
                await _userManager.AddToRoleAsync(existingUser, role);

            return;
        }

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
            var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to create user '{email}': {errors}");
        }

        var roleResult = await _userManager.AddToRoleAsync(user, role);
        if (!roleResult.Succeeded)
        {
            var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to assign role '{role}' to '{email}': {errors}");
        }
    }

    private async Task SeedMatchesAsync(CancellationToken cancellationToken)
    {
        if (await _context.Matches.AnyAsync(cancellationToken))
            return;

        var matches = SeedData.Matches
            .Select(m => new Match
            {
                HomeTeam = m.Home,
                AwayTeam = m.Away,
                KickoffUtc = m.KickoffUtc
            })
            .ToList();

        await _context.Matches.AddRangeAsync(matches, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
