using Polla.Domain.Entities;

namespace Polla.Application.Interfaces.Persistence;

public interface IMatchRepository
{
    Task<IReadOnlyList<Match>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<Match?> GetByIdAsync(int matchId, CancellationToken cancellationToken = default);

    void Update(Match match);
}
