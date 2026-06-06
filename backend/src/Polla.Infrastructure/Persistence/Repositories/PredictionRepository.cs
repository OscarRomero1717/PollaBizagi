using Microsoft.EntityFrameworkCore;
using Polla.Application.Interfaces.Persistence;
using Polla.Domain.Entities;
using Polla.Domain.Services;
using Polla.Infrastructure.Identity;

namespace Polla.Infrastructure.Persistence.Repositories;

public class PredictionRepository : IPredictionRepository
{
    private readonly AppDbContext _context;

    public PredictionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Prediction?> GetByIdAsync(int predictionId, CancellationToken cancellationToken = default)
    {
        return await _context.Predictions
            .FirstOrDefaultAsync(p => p.Id == predictionId, cancellationToken);
    }

    public async Task<Prediction?> GetByUserAndMatchAsync(
        Guid userId,
        int matchId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Predictions
            .FirstOrDefaultAsync(p => p.UserId == userId && p.MatchId == matchId, cancellationToken);
    }

    public async Task<IReadOnlyList<Prediction>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Predictions
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Prediction>> GetByMatchIdAsync(
        int matchId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Predictions
            .Where(p => p.MatchId == matchId)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsForUserAndMatchAsync(
        Guid userId,
        int matchId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Predictions
            .AnyAsync(p => p.UserId == userId && p.MatchId == matchId, cancellationToken);
    }

    public async Task<IReadOnlyList<LeaderboardParticipantStats>> GetParticipantStatsAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Predictions
            .Join(
                _context.Set<ApplicationUser>(),
                prediction => prediction.UserId,
                user => user.Id,
                (prediction, user) => new { prediction, user })
            .GroupBy(x => new { x.user.Id, x.user.DisplayName })
            .Select(g => new LeaderboardParticipantStats
            {
                UserId = g.Key.Id,
                DisplayName = g.Key.DisplayName,
                TotalPoints = g.Sum(x => x.prediction.PointsAwarded),
                ExactHits = g.Count(x => x.prediction.PointsAwarded == ScoringCalculator.ExactScorePoints),
                EarliestPredictionUtc = g.Min(x => x.prediction.CreatedAtUtc)
            })
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Prediction prediction, CancellationToken cancellationToken = default)
    {
        await _context.Predictions.AddAsync(prediction, cancellationToken);
    }

    public void Update(Prediction prediction)
    {
        _context.Predictions.Update(prediction);
    }
}
