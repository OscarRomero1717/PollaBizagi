namespace Polla.Domain.Entities;

public class Prediction
{
    public int Id { get; set; }

    public Guid UserId { get; set; }

    public int MatchId { get; set; }

    public int PredictedHomeGoals { get; set; }

    public int PredictedAwayGoals { get; set; }

    public int PointsAwarded { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}
