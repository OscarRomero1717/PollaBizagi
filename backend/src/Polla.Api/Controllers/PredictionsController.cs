using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Polla.Application.Common;
using Polla.Application.DTOs.Predictions;
using Polla.Application.Interfaces;

namespace Polla.Api.Controllers;

[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Route("api/predictions")]
public class PredictionsController : ControllerBase
{
    private readonly IPredictionService _predictionService;

    public PredictionsController(IPredictionService predictionService)
    {
        _predictionService = predictionService;
    }

    [Authorize(Roles = RoleNames.User)]
    [HttpPost]
    [ProducesResponseType(typeof(PredictionResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Create(
        [FromBody] CreatePredictionRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _predictionService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id = result.Id }, result);
    }

    [Authorize(Roles = RoleNames.User)]
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PredictionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PredictionResponseDto>> Update(
        int id,
        [FromBody] UpdatePredictionRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _predictionService.UpdateAsync(id, request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(MyPredictionsResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<MyPredictionsResponseDto>> GetMyPredictions(CancellationToken cancellationToken)
    {
        var result = await _predictionService.GetMyPredictionsAsync(cancellationToken);
        return Ok(result);
    }
}
