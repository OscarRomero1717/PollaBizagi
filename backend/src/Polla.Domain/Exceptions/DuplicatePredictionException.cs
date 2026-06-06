namespace Polla.Domain.Exceptions;

public class DuplicatePredictionException : DomainException
{
    public const string DefaultCode = "DUPLICATE_PREDICTION";

    public DuplicatePredictionException(string message)
        : base(DefaultCode, message)
    {
    }
}
