using Polla.Application.DTOs.Admin;
using Polla.Application.DTOs.Matches;

namespace Polla.Application.Interfaces;

public interface IMatchService
{
    Task<MatchListResponseDto> GetMatchesAsync(
        CancellationToken cancellationToken = default);

    Task<SetOfficialResultResponseDto> SetOfficialResultAsync(
        int matchId,
        SetOfficialResultRequestDto request,
        CancellationToken cancellationToken = default);
}
