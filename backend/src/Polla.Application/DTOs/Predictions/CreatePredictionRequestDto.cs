namespace Polla.Application.DTOs.Predictions;

public class CreatePredictionRequestDto
{
    public int MatchId { get; set; }

    public int HomeGoals { get; set; }

    public int AwayGoals { get; set; }
}
