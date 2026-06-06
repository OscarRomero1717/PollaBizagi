using Polla.Domain.Enums;
using Polla.Domain.Exceptions;
using Polla.Domain.Services;

namespace Polla.Domain.Tests.Services;

public class ScoringCalculatorTests
{
    [Fact]
    public void Calculate_ExactScore_ReturnsThreePoints()
    {
        var points = ScoringCalculator.Calculate(2, 1, 2, 1);

        Assert.Equal(ScoringCalculator.ExactScorePoints, points);
    }

    [Fact]
    public void Calculate_ExactDraw_ReturnsThreePoints()
    {
        var points = ScoringCalculator.Calculate(0, 0, 0, 0);

        Assert.Equal(3, points);
    }

    [Fact]
    public void Calculate_CorrectHomeWinWrongScore_ReturnsOnePoint()
    {
        var points = ScoringCalculator.Calculate(2, 0, 3, 1);

        Assert.Equal(ScoringCalculator.CorrectOutcomePoints, points);
    }

    [Fact]
    public void Calculate_CorrectAwayWinWrongScore_ReturnsOnePoint()
    {
        var points = ScoringCalculator.Calculate(0, 2, 1, 3);

        Assert.Equal(1, points);
    }

    [Fact]
    public void Calculate_CorrectDrawWrongScore_ReturnsOnePoint()
    {
        var points = ScoringCalculator.Calculate(1, 1, 2, 2);

        Assert.Equal(1, points);
    }

    [Fact]
    public void Calculate_WrongOutcome_ReturnsZeroPoints()
    {
        var points = ScoringCalculator.Calculate(2, 0, 0, 1);

        Assert.Equal(ScoringCalculator.NoPoints, points);
    }

    [Fact]
    public void Calculate_PredictedDrawOfficialHomeWin_ReturnsZeroPoints()
    {
        var points = ScoringCalculator.Calculate(1, 1, 2, 0);

        Assert.Equal(0, points);
    }

    [Theory]
    [InlineData(-1, 0)]
    [InlineData(0, -1)]
    public void Calculate_NegativePredictedGoals_ThrowsInvalidScoreException(int home, int away)
    {
        var exception = Assert.Throws<InvalidScoreException>(
            () => ScoringCalculator.Calculate(home, away, 1, 0));

        Assert.Equal(InvalidScoreException.DefaultCode, exception.Code);
    }

    [Theory]
    [InlineData(1, 0, -1, 0)]
    [InlineData(1, 0, 0, -2)]
    public void Calculate_NegativeOfficialGoals_ThrowsInvalidScoreException(
        int predictedHome,
        int predictedAway,
        int officialHome,
        int officialAway)
    {
        Assert.Throws<InvalidScoreException>(
            () => ScoringCalculator.Calculate(predictedHome, predictedAway, officialHome, officialAway));
    }

    [Theory]
    [InlineData(3, 1, MatchOutcome.HomeWin)]
    [InlineData(0, 2, MatchOutcome.AwayWin)]
    [InlineData(2, 2, MatchOutcome.Draw)]
    public void GetOutcome_ReturnsExpectedResult(int home, int away, MatchOutcome expected)
    {
        var outcome = ScoringCalculator.GetOutcome(home, away);

        Assert.Equal(expected, outcome);
    }
}
