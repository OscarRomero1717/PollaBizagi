using Polla.Application.Common;
using Polla.Application.DTOs.Admin;
using Polla.Application.DTOs.Matches;
using Polla.Application.Interfaces;
using Polla.Application.Interfaces.Persistence;
using Polla.Domain.Exceptions;

namespace Polla.Application.Services;

public class MatchService : IMatchService
{
    private readonly IMatchRepository _matchRepository;
    private readonly IPredictionRepository _predictionRepository;
    private readonly IPredictionService _predictionService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public MatchService(
        IMatchRepository matchRepository,
        IPredictionRepository predictionRepository,
        IPredictionService predictionService,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _matchRepository = matchRepository;
        _predictionRepository = predictionRepository;
        _predictionService = predictionService;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task<MatchListResponseDto> GetMatchesAsync(
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.GetRequiredUserId();
        var matches = await _matchRepository.GetAllAsync(cancellationToken);
        var utcNow = DateTime.UtcNow;

        var items = new List<MatchListItemDto>();

        foreach (var match in matches)
        {
            var prediction = await _predictionRepository.GetByUserAndMatchAsync(
                userId, match.Id, cancellationToken);

            items.Add(new MatchListItemDto
            {
                Id = match.Id,
                HomeTeam = match.HomeTeam,
                AwayTeam = match.AwayTeam,
                KickoffUtc = match.KickoffUtc,
                Status = match.GetStatus(utcNow),
                OfficialHomeGoals = match.OfficialHomeGoals,
                OfficialAwayGoals = match.OfficialAwayGoals,
                HasPrediction = prediction is not null,
                MyPrediction = prediction is null
                    ? null
                    : new PredictionSummaryDto
                    {
                        Id = prediction.Id,
                        HomeGoals = prediction.PredictedHomeGoals,
                        AwayGoals = prediction.PredictedAwayGoals,
                        PointsAwarded = prediction.PointsAwarded
                    }
            });
        }

        return new MatchListResponseDto { Matches = items };
    }

    public async Task<SetOfficialResultResponseDto> SetOfficialResultAsync(
        int matchId,
        SetOfficialResultRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (_currentUserService.Role != RoleNames.Admin)
            throw new UnauthorizedResourceException("Only administrators can set official results.");

        if (request.HomeGoals < 0 || request.AwayGoals < 0)
            throw new InvalidScoreException("Official goals must be greater than or equal to zero.");

        var match = await _matchRepository.GetByIdAsync(matchId, cancellationToken);
        if (match is null)
            throw new DomainException("MATCH_NOT_FOUND", $"Match with id {matchId} was not found.");

        match.OfficialHomeGoals = request.HomeGoals;
        match.OfficialAwayGoals = request.AwayGoals;

        _matchRepository.Update(match);

        var predictionsUpdated = await _predictionService.RecalculatePointsForMatchAsync(
            matchId, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new SetOfficialResultResponseDto
        {
            MatchId = match.Id,
            OfficialHomeGoals = match.OfficialHomeGoals.Value,
            OfficialAwayGoals = match.OfficialAwayGoals.Value,
            PredictionsUpdated = predictionsUpdated
        };
    }
}
