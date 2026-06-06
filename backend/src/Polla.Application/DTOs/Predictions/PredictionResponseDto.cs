namespace Polla.Application.DTOs.Predictions;

public class PredictionResponseDto
{
    public int Id { get; set; }

    public int MatchId { get; set; }

    public int HomeGoals { get; set; }

    public int AwayGoals { get; set; }

    public int PointsAwarded { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}
