using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Polla.Application.Common;
using Polla.Application.DTOs.Admin;
using Polla.Application.Interfaces;

namespace Polla.Api.Controllers;

[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleNames.Admin)]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IMatchService _matchService;

    public AdminController(IMatchService matchService)
    {
        _matchService = matchService;
    }

    [HttpPut("matches/{id:int}/result")]
    [ProducesResponseType(typeof(SetOfficialResultResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SetOfficialResultResponseDto>> SetOfficialResult(
        int id,
        [FromBody] SetOfficialResultRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _matchService.SetOfficialResultAsync(id, request, cancellationToken);
        return Ok(result);
    }
}
