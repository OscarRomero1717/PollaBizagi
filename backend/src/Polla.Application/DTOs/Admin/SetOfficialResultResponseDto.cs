namespace Polla.Application.DTOs.Admin;

public class SetOfficialResultResponseDto
{
    public int MatchId { get; set; }

    public int OfficialHomeGoals { get; set; }

    public int OfficialAwayGoals { get; set; }

    public int PredictionsUpdated { get; set; }
}
