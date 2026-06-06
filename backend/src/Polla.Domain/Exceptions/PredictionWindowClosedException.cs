namespace Polla.Domain.Exceptions;

public class PredictionWindowClosedException : DomainException
{
    public const string DefaultCode = "PREDICTION_WINDOW_CLOSED";

    public PredictionWindowClosedException(string message)
        : base(DefaultCode, message)
    {
    }
}
