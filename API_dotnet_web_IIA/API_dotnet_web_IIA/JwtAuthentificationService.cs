using API_dotnet_web_IIA.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace API_dotnet_web_IIA
{
    public class JwtAuthentificationService : IJwtAuthentificationService
    {
        private readonly WebApiContext _context;

        public JwtAuthentificationService(WebApiContext context)
        {
            _context = context;
        }

        public UserModel Authenticate(string email, string password)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email && u.Password == EncryptPWD(password));
        }

        public string GenerateToken(string secret, List<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256Signature)

            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string EncryptPWD(string password)
        {
            StringBuilder sb = new StringBuilder();
            using (SHA512 sha512 = SHA512.Create())
            {
                byte[] hashValue = sha512.ComputeHash(Encoding.UTF8.GetBytes(password));
                foreach (byte b in hashValue)
                {
                    sb.Append($"{b:X2}");
                }
            }
            password = sb.ToString();
            return password;
        }

        public string GeneratePasswordResetToken(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                return null; // Utilisateur non trouvé
            }

            // Générer un jeton unique
            string token = GenerateUniqueToken();

            // Enregistrer le jeton et la date d'expiration dans le modèle d'utilisateur
            user.ResetPasswordToken = token;
            user.ResetPasswordTokenExpiration = DateTime.UtcNow.AddHours(1); 

            _context.SaveChanges();
            return token;
        }

        public bool ValidatePasswordResetToken(string token)
        {
            var user = _context.Users.FirstOrDefault(u => u.ResetPasswordToken == token);
            if (user == null || user.ResetPasswordTokenExpiration < DateTime.UtcNow)
            {
                return false; // Jeton invalide ou expiré
            }

            return true; // Jeton valide
        }

        private string GenerateUniqueToken()
        {
            byte[] randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }
    }
}
