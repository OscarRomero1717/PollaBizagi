using Polla.Application.DTOs.Predictions;
using Polla.Application.Interfaces;
using Polla.Application.Interfaces.Persistence;
using Polla.Domain.Entities;
using Polla.Domain.Enums;
using Polla.Domain.Exceptions;
using Polla.Domain.Services;

namespace Polla.Application.Services;

public class PredictionService : IPredictionService
{
    private readonly IMatchRepository _matchRepository;
    private readonly IPredictionRepository _predictionRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public PredictionService(
        IMatchRepository matchRepository,
        IPredictionRepository predictionRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _matchRepository = matchRepository;
        _predictionRepository = predictionRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task<PredictionResponseDto> CreateAsync(
        CreatePredictionRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.GetRequiredUserId();
        ValidateGoals(request.HomeGoals, request.AwayGoals);

        var match = await _matchRepository.GetByIdAsync(request.MatchId, cancellationToken);
        if (match is null)
            throw new DomainException("MATCH_NOT_FOUND", $"Match with id {request.MatchId} was not found.");

        EnsurePredictionWindowOpen(match);

        if (await _predictionRepository.ExistsForUserAndMatchAsync(userId, request.MatchId, cancellationToken))
            throw new DuplicatePredictionException("A prediction already exists for this match.");

        var prediction = new Prediction
        {
            UserId = userId,
            MatchId = request.MatchId,
            PredictedHomeGoals = request.HomeGoals,
            PredictedAwayGoals = request.AwayGoals,
            PointsAwarded = 0,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _predictionRepository.AddAsync(prediction, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(prediction);
    }

    public async Task<PredictionResponseDto> UpdateAsync(
        int predictionId,
        UpdatePredictionRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.GetRequiredUserId();
        ValidateGoals(request.HomeGoals, request.AwayGoals);

        var prediction = await _predictionRepository.GetByIdAsync(predictionId, cancellationToken);
        if (prediction is null)
            throw new DomainException("PREDICTION_NOT_FOUND", $"Prediction with id {predictionId} was not found.");

        if (prediction.UserId != userId)
            throw new UnauthorizedResourceException("You can only update your own predictions.");

        var match = await _matchRepository.GetByIdAsync(prediction.MatchId, cancellationToken);
        if (match is null)
            throw new DomainException("MATCH_NOT_FOUND", $"Match with id {prediction.MatchId} was not found.");

        EnsurePredictionWindowOpen(match);

        prediction.PredictedHomeGoals = request.HomeGoals;
        prediction.PredictedAwayGoals = request.AwayGoals;
        prediction.UpdatedAtUtc = DateTime.UtcNow;

        _predictionRepository.Update(prediction);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToResponse(prediction);
    }

    public async Task<MyPredictionsResponseDto> GetMyPredictionsAsync(
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.GetRequiredUserId();
        var predictions = await _predictionRepository.GetByUserIdAsync(userId, cancellationToken);
        var matches = await _matchRepository.GetAllAsync(cancellationToken);
        var matchesById = matches.ToDictionary(m => m.Id);

        var items = predictions
            .Where(p => matchesById.ContainsKey(p.MatchId))
            .Select(p =>
            {
                var match = matchesById[p.MatchId];
                return new MyPredictionItemDto
                {
                    MatchId = match.Id,
                    HomeTeam = match.HomeTeam,
                    AwayTeam = match.AwayTeam,
                    PredictedHomeGoals = p.PredictedHomeGoals,
                    PredictedAwayGoals = p.PredictedAwayGoals,
                    OfficialHomeGoals = match.OfficialHomeGoals,
                    OfficialAwayGoals = match.OfficialAwayGoals,
                    PointsAwarded = p.PointsAwarded,
                    KickoffUtc = match.KickoffUtc
                };
            })
            .OrderByDescending(p => p.KickoffUtc)
            .ToList();

        return new MyPredictionsResponseDto { Predictions = items };
    }

    public async Task<int> RecalculatePointsForMatchAsync(
        int matchId,
        CancellationToken cancellationToken = default)
    {
        var match = await _matchRepository.GetByIdAsync(matchId, cancellationToken);
        if (match is null)
            throw new DomainException("MATCH_NOT_FOUND", $"Match with id {matchId} was not found.");

        if (!match.HasOfficialResult)
            throw new DomainException(
                "MATCH_WITHOUT_RESULT",
                "Cannot recalculate points without an official result.");

        var officialHome = match.OfficialHomeGoals!.Value;
        var officialAway = match.OfficialAwayGoals!.Value;

        var predictions = await _predictionRepository.GetByMatchIdAsync(matchId, cancellationToken);

        foreach (var prediction in predictions)
        {
            prediction.PointsAwarded = ScoringCalculator.Calculate(
                prediction.PredictedHomeGoals,
                prediction.PredictedAwayGoals,
                officialHome,
                officialAway);

            _predictionRepository.Update(prediction);
        }

        return predictions.Count;
    }

    private static void ValidateGoals(int homeGoals, int awayGoals)
    {
        if (homeGoals < 0 || awayGoals < 0)
            throw new InvalidScoreException("Predicted goals must be greater than or equal to zero.");
    }

    private static void EnsurePredictionWindowOpen(Match match)
    {
        var utcNow = DateTime.UtcNow;
        var status = match.GetStatus(utcNow);

        if (status != MatchStatus.Open)
            throw new PredictionWindowClosedException(
                "Predictions can only be created or updated before kickoff and without an official result.");
    }

    private static PredictionResponseDto MapToResponse(Prediction prediction) =>
        new()
        {
            Id = prediction.Id,
            MatchId = prediction.MatchId,
            HomeGoals = prediction.PredictedHomeGoals,
            AwayGoals = prediction.PredictedAwayGoals,
            PointsAwarded = prediction.PointsAwarded,
            CreatedAtUtc = prediction.CreatedAtUtc
        };
}
