namespace Polla.Application.DTOs.Predictions;

public class UserPredictionsResponseDto
{
    public Guid UserId { get; set; }

    public string DisplayName { get; set; } = string.Empty;

    public IReadOnlyList<MyPredictionItemDto> Predictions { get; set; } = Array.Empty<MyPredictionItemDto>();
}
