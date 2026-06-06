namespace Polla.Application.Interfaces.Persistence;

public class LeaderboardParticipantStats
{
    public Guid UserId { get; init; }

    public string DisplayName { get; init; } = string.Empty;

    public int TotalPoints { get; init; }

    public int ExactHits { get; init; }

    public DateTime EarliestPredictionUtc { get; init; }
}
