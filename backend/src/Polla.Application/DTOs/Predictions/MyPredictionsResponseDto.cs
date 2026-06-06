namespace Polla.Application.DTOs.Predictions;

public class MyPredictionsResponseDto
{
    public IReadOnlyList<MyPredictionItemDto> Predictions { get; set; } = Array.Empty<MyPredictionItemDto>();
}
