using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Polla.Application.Common;
using Polla.Infrastructure.Identity;

namespace Polla.Domain.Tests.Infrastructure;

public class JwtTokenServiceTests
{
    [Fact]
    public void CreateToken_IncludesRoleClaim()
    {
        var settings = Options.Create(new JwtSettings
        {
            Issuer = "test-issuer",
            Audience = "test-audience",
            Key = "test-signing-key-at-least-32-characters-long",
            ExpirationHours = 1
        });

        var service = new JwtTokenService(settings);
        var userId = Guid.NewGuid();

        var (token, expiresAt) = service.CreateToken(
            userId,
            "user@polla.demo",
            "Test User",
            RoleNames.Admin);

        Assert.False(string.IsNullOrWhiteSpace(token));
        Assert.True(expiresAt > DateTime.UtcNow);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        Assert.Equal(userId.ToString(), jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
        Assert.Equal(RoleNames.Admin, jwt.Claims.First(c => c.Type == ClaimTypes.Role).Value);
    }
}
