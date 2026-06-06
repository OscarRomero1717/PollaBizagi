using Microsoft.AspNetCore.Identity;
using Polla.Application.Common;

namespace Polla.Infrastructure.Identity;

public static class IdentityOptionsConfiguration
{
    public static void Configure(IdentityOptions options)
    {
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;

        options.User.RequireUniqueEmail = true;
    }

    public static readonly string[] SeedRoles = [RoleNames.User, RoleNames.Admin];
}
