using Polla.Application.DTOs.Predictions;

namespace Polla.Application.Interfaces;

public interface IPredictionService
{
    Task<PredictionResponseDto> CreateAsync(
        CreatePredictionRequestDto request,
        CancellationToken cancellationToken = default);

    Task<PredictionResponseDto> UpdateAsync(
        int predictionId,
        UpdatePredictionRequestDto request,
        CancellationToken cancellationToken = default);

    Task<MyPredictionsResponseDto> GetMyPredictionsAsync(
        CancellationToken cancellationToken = default);

    Task<UserPredictionsResponseDto> GetUserPredictionsAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<int> RecalculatePointsForMatchAsync(
        int matchId,
        CancellationToken cancellationToken = default);
}
