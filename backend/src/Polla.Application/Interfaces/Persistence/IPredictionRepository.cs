using Polla.Domain.Entities;

namespace Polla.Application.Interfaces.Persistence;

public interface IPredictionRepository
{
    Task<Prediction?> GetByIdAsync(int predictionId, CancellationToken cancellationToken = default);

    Task<Prediction?> GetByUserAndMatchAsync(
        Guid userId,
        int matchId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Prediction>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Prediction>> GetByMatchIdAsync(
        int matchId,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsForUserAndMatchAsync(
        Guid userId,
        int matchId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LeaderboardParticipantStats>> GetParticipantStatsAsync(
        CancellationToken cancellationToken = default);

    Task AddAsync(Prediction prediction, CancellationToken cancellationToken = default);

    void Update(Prediction prediction);
}
