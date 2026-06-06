using Polla.Domain.Enums;

namespace Polla.Domain.Entities;

public class Match
{
    public int Id { get; set; }

    public string HomeTeam { get; set; } = string.Empty;

    public string AwayTeam { get; set; } = string.Empty;

    public DateTime KickoffUtc { get; set; }

    public int? OfficialHomeGoals { get; set; }

    public int? OfficialAwayGoals { get; set; }

    public bool HasOfficialResult =>
        OfficialHomeGoals.HasValue && OfficialAwayGoals.HasValue;

    public MatchStatus GetStatus(DateTime utcNow)
    {
        if (HasOfficialResult)
            return MatchStatus.Scored;

        return utcNow < KickoffUtc
            ? MatchStatus.Open
            : MatchStatus.Closed;
    }
}
