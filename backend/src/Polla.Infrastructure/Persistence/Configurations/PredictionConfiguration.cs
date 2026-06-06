using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polla.Domain.Entities;
using Polla.Infrastructure.Identity;

namespace Polla.Infrastructure.Persistence.Configurations;

public class PredictionConfiguration : IEntityTypeConfiguration<Prediction>
{
    public void Configure(EntityTypeBuilder<Prediction> builder)
    {
        builder.ToTable("Predictions", table =>
        {
            table.HasCheckConstraint(
                "CK_Predictions_Goals_NonNegative",
                "[PredictedHomeGoals] >= 0 AND [PredictedAwayGoals] >= 0");
        });

        builder.HasKey(p => p.Id);

        builder.Property(p => p.UserId)
            .IsRequired();

        builder.Property(p => p.MatchId)
            .IsRequired();

        builder.Property(p => p.PredictedHomeGoals)
            .IsRequired();

        builder.Property(p => p.PredictedAwayGoals)
            .IsRequired();

        builder.Property(p => p.PointsAwarded)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(p => p.CreatedAtUtc)
            .IsRequired();

        builder.HasIndex(p => new { p.UserId, p.MatchId })
            .IsUnique();

        builder.HasIndex(p => p.UserId);

        builder.HasIndex(p => p.MatchId);

        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Match>()
            .WithMany()
            .HasForeignKey(p => p.MatchId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
