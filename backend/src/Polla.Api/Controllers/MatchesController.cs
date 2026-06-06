using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Polla.Application.DTOs.Matches;
using Polla.Application.Interfaces;

namespace Polla.Api.Controllers;

[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Route("api/matches")]
public class MatchesController : ControllerBase
{
    private readonly IMatchService _matchService;

    public MatchesController(IMatchService matchService)
    {
        _matchService = matchService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(MatchListResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<MatchListResponseDto>> GetMatches(CancellationToken cancellationToken)
    {
        var result = await _matchService.GetMatchesAsync(cancellationToken);
        return Ok(result);
    }
}
