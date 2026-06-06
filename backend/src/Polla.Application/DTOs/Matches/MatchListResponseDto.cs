namespace Polla.Application.DTOs.Matches;

public class MatchListResponseDto
{
    public IReadOnlyList<MatchListItemDto> Matches { get; set; } = Array.Empty<MatchListItemDto>();
}
