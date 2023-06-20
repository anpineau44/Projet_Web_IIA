using API_dotnet_web_IIA.Models;

namespace API_dotnet_web_IIA.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetPasswordTokenExpiration { get; set; }
    }
}