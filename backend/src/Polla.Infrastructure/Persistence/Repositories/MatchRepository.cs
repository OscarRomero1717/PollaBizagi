using Microsoft.EntityFrameworkCore;
using Polla.Application.Interfaces.Persistence;
using Polla.Domain.Entities;

namespace Polla.Infrastructure.Persistence.Repositories;

public class MatchRepository : IMatchRepository
{
    private readonly AppDbContext _context;

    public MatchRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Match>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Matches
            .OrderBy(m => m.KickoffUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<Match?> GetByIdAsync(int matchId, CancellationToken cancellationToken = default)
    {
        return await _context.Matches
            .FirstOrDefaultAsync(m => m.Id == matchId, cancellationToken);
    }

    public void Update(Match match)
    {
        _context.Matches.Update(match);
    }
}
