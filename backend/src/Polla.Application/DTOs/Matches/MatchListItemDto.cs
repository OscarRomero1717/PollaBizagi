using Polla.Domain.Enums;

namespace Polla.Application.DTOs.Matches;

public class MatchListItemDto
{
    public int Id { get; set; }

    public string HomeTeam { get; set; } = string.Empty;

    public string AwayTeam { get; set; } = string.Empty;

    public DateTime KickoffUtc { get; set; }

    public MatchStatus Status { get; set; }

    public int? OfficialHomeGoals { get; set; }

    public int? OfficialAwayGoals { get; set; }

    public bool HasPrediction { get; set; }

    public PredictionSummaryDto? MyPrediction { get; set; }
}
