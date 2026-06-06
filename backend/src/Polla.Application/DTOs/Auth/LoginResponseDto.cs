namespace Polla.Application.DTOs.Auth;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public string Role { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;
}
