using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Polla.Application.DTOs.Leaderboard;
using Polla.Application.Interfaces;

namespace Polla.Api.Controllers;

[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Route("api/leaderboard")]
public class LeaderboardController : ControllerBase
{
    private readonly ILeaderboardService _leaderboardService;

    public LeaderboardController(ILeaderboardService leaderboardService)
    {
        _leaderboardService = leaderboardService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(LeaderboardResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LeaderboardResponseDto>> GetLeaderboard(CancellationToken cancellationToken)
    {
        var result = await _leaderboardService.GetLeaderboardAsync(cancellationToken);
        return Ok(result);
    }
}
