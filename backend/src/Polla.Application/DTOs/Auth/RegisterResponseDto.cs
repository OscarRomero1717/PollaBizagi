namespace Polla.Application.DTOs.Auth;

public class RegisterResponseDto
{
    public Guid UserId { get; set; }

    public string Email { get; set; } = string.Empty;
}
