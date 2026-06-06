using Polla.Domain.Enums;
using Polla.Domain.Exceptions;

namespace Polla.Domain.Services;

/// <summary>
/// Regla RN-04: 3 puntos marcador exacto, 1 punto acierto ganador/empate, 0 en otro caso.
/// </summary>
public static class ScoringCalculator
{
    public const int ExactScorePoints = 3;
    public const int CorrectOutcomePoints = 1;
    public const int NoPoints = 0;

    public static int Calculate(
        int predictedHome,
        int predictedAway,
        int officialHome,
        int officialAway)
    {
        ValidateGoals(predictedHome, predictedAway);
        ValidateGoals(officialHome, officialAway);

        if (predictedHome == officialHome && predictedAway == officialAway)
            return ExactScorePoints;

        if (GetOutcome(predictedHome, predictedAway) == GetOutcome(officialHome, officialAway))
            return CorrectOutcomePoints;

        return NoPoints;
    }

    public static MatchOutcome GetOutcome(int homeGoals, int awayGoals)
    {
        ValidateGoals(homeGoals, awayGoals);

        if (homeGoals > awayGoals)
            return MatchOutcome.HomeWin;

        if (homeGoals < awayGoals)
            return MatchOutcome.AwayWin;

        return MatchOutcome.Draw;
    }

    private static void ValidateGoals(int homeGoals, int awayGoals)
    {
        if (homeGoals < 0 || awayGoals < 0)
            throw new InvalidScoreException("Goals must be greater than or equal to zero.");
    }
}
