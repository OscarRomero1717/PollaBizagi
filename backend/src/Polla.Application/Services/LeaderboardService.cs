using Polla.Application.DTOs.Leaderboard;
using Polla.Application.Interfaces;
using Polla.Application.Interfaces.Persistence;

namespace Polla.Application.Services;

public class LeaderboardService : ILeaderboardService
{
    private readonly IPredictionRepository _predictionRepository;

    public LeaderboardService(IPredictionRepository predictionRepository)
    {
        _predictionRepository = predictionRepository;
    }

    public async Task<LeaderboardResponseDto> GetLeaderboardAsync(
        CancellationToken cancellationToken = default)
    {
        var stats = await _predictionRepository.GetParticipantStatsAsync(cancellationToken);

        var ordered = stats
            .OrderByDescending(s => s.TotalPoints)
            .ThenByDescending(s => s.ExactHits)
            .ThenBy(s => s.EarliestPredictionUtc)
            .ToList();

        var entries = ordered
            .Select((participant, index) => new LeaderboardEntryDto
            {
                Rank = index + 1,
                DisplayName = participant.DisplayName,
                TotalPoints = participant.TotalPoints,
                ExactHits = participant.ExactHits
            })
            .ToList();

        return new LeaderboardResponseDto { Entries = entries };
    }
}
