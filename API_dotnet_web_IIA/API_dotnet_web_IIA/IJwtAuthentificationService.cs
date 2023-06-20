using API_dotnet_web_IIA.Models;
using System.Security.Claims;

namespace API_dotnet_web_IIA
{
    public interface IJwtAuthentificationService
    {
        UserModel Authenticate(string email, string password);
        string GenerateToken(string secret, List<Claim> claims);
        string EncryptPWD(string password);
        string GeneratePasswordResetToken(string email);
        bool ValidatePasswordResetToken(string token);
    }
}
