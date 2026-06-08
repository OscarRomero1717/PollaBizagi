namespace Polla.Application.DTOs.Leaderboard;

public class LeaderboardEntryDto
{
    public int Rank { get; set; }

    public Guid UserId { get; set; }

    public string DisplayName { get; set; } = string.Empty;

    public int TotalPoints { get; set; }

    public int ExactHits { get; set; }
}
