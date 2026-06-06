namespace Polla.Domain.Exceptions;

public class InvalidScoreException : DomainException
{
    public const string DefaultCode = "INVALID_SCORE";

    public InvalidScoreException(string message)
        : base(DefaultCode, message)
    {
    }
}
