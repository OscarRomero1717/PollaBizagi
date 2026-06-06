namespace Polla.Application.DTOs.Predictions;

public class MyPredictionItemDto
{
    public int MatchId { get; set; }

    public string HomeTeam { get; set; } = string.Empty;

    public string AwayTeam { get; set; } = string.Empty;

    public int PredictedHomeGoals { get; set; }

    public int PredictedAwayGoals { get; set; }

    public int? OfficialHomeGoals { get; set; }

    public int? OfficialAwayGoals { get; set; }

    public int PointsAwarded { get; set; }

    public DateTime KickoffUtc { get; set; }
}
