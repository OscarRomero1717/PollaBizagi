using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polla.Domain.Entities;

namespace Polla.Infrastructure.Persistence.Configurations;

public class MatchConfiguration : IEntityTypeConfiguration<Match>
{
    public void Configure(EntityTypeBuilder<Match> builder)
    {
        builder.ToTable("Matches", table =>
        {
            table.HasCheckConstraint(
                "CK_Matches_OfficialGoals_Pair",
                "([OfficialHomeGoals] IS NULL AND [OfficialAwayGoals] IS NULL) OR " +
                "([OfficialHomeGoals] IS NOT NULL AND [OfficialAwayGoals] IS NOT NULL)");

            table.HasCheckConstraint(
                "CK_Matches_OfficialGoals_NonNegative",
                "([OfficialHomeGoals] IS NULL OR [OfficialHomeGoals] >= 0) AND " +
                "([OfficialAwayGoals] IS NULL OR [OfficialAwayGoals] >= 0)");
        });

        builder.HasKey(m => m.Id);

        builder.Property(m => m.HomeTeam)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.AwayTeam)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.KickoffUtc)
            .IsRequired();

        builder.HasIndex(m => m.KickoffUtc);
    }
}
