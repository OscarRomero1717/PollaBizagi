namespace Polla.Domain.Exceptions;

public class UnauthorizedResourceException : DomainException
{
    public const string DefaultCode = "UNAUTHORIZED_RESOURCE";

    public UnauthorizedResourceException(string message)
        : base(DefaultCode, message)
    {
    }
}
