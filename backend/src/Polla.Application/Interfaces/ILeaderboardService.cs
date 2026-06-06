using Polla.Application.DTOs.Leaderboard;

namespace Polla.Application.Interfaces;

public interface ILeaderboardService
{
    Task<LeaderboardResponseDto> GetLeaderboardAsync(
        CancellationToken cancellationToken = default);
}
