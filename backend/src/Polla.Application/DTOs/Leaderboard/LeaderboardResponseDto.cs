namespace Polla.Application.DTOs.Leaderboard;

public class LeaderboardResponseDto
{
    public IReadOnlyList<LeaderboardEntryDto> Entries { get; set; } = Array.Empty<LeaderboardEntryDto>();
}
