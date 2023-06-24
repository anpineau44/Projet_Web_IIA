using API_dotnet_web_IIA.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using SendGrid;
using SendGrid.Helpers.Mail;
using Newtonsoft.Json.Linq;
using System.Globalization;

namespace API_dotnet_web_IIA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthentificationController : ControllerBase
    {
        private readonly IJwtAuthentificationService _jwtAuthenticationService;
        private readonly IConfiguration _config;
        private readonly WebApiContext _context;

        public AuthentificationController(IJwtAuthentificationService JwtAuthenticationService, IConfiguration config, WebApiContext context)
        {
            _jwtAuthenticationService = JwtAuthenticationService;
            _config = config;
            _context = context;
        }


        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var user = _jwtAuthenticationService.Authenticate(model.Email, model.Password);
            if (user != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, user.Email),
                };
                var token = _jwtAuthenticationService.GenerateToken(_config["Jwt:Key"], claims);
                return Ok(new { token = token });
            }
            return Unauthorized();
        }

        [HttpGet("get-email-from-token")]
        [Authorize]
        public IActionResult GetEmailFromToken()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            return Ok(new { email = email });
        }


        [HttpPost("change-password")]
        [Authorize]
        public IActionResult ChangePassword([FromBody] ChangePasswordModel model)
        {
            // Vérifiez l'identité de l'utilisateur actuel
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null || model.NewPassword == "")
            {
                return NotFound();
            }

            // Vérifiez si l'ancien mot de passe correspond à celui de l'utilisateur
            if (_jwtAuthenticationService.EncryptPWD(model.OldPassword) != user.Password)
            {
                return BadRequest("Old password is incorrect");
            }

            // Mettez à jour le mot de passe de l'utilisateur avec le nouveau mot de passe
            user.Password = _jwtAuthenticationService.EncryptPWD(model.NewPassword);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("password-reset")]
        public IActionResult SendPasswordResetLink(string email)
        {
            // Vérifier si l'utilisateur avec l'e-mail donné existe dans votre base de données
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                return NotFound();
            }

            // Générer le jeton de réinitialisation de mot de passe
            string resetToken = _jwtAuthenticationService.GeneratePasswordResetToken(email);

            // Envoyer l'e-mail contenant le lien de réinitialisation de mot de passe
            SendPasswordResetEmailAsync(email, resetToken);

            return NoContent();
        }

        private async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            var apiKey = _config["SendGrid:ApiKey"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("malodouth44@gmail.com", "Malo Douth");
            var subject = "Sending with SendGrid";
            var to = new EmailAddress(email, email);
            var plainTextContent = "and easy to do anywhere, even with C#";
            var htmlContent = $"Click sur le lien pour reinitialiser ton mot de passe: {"http://localhost:4200/forgot-password-token/" + resetToken}";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            // Vérifiez si l'e-mail a été envoyé avec succès
            if (response.StatusCode != System.Net.HttpStatusCode.Accepted)
            {
                // Gérez l'erreur d'envoi de l'e-mail
                throw new Exception("Failed to send password reset email.");
            }
        }

        [HttpPost("password-reset/{token}")]
        public IActionResult ResetPassword(string token, string newPassword)
        {
            // Valider le jeton de réinitialisation de mot de passe
            bool isTokenValid = _jwtAuthenticationService.ValidatePasswordResetToken(token);
            if (!isTokenValid)
            {
                return BadRequest("Invalid or expired reset token");
            }

            // Trouver l'utilisateur associé au jeton de réinitialisation de mot de passe
            var user = _context.Users.FirstOrDefault(u => u.ResetPasswordToken == token);
            if (user == null || newPassword == "")
            {
                return BadRequest("Invalid or expired reset token");
            }

            // Mettre à jour le mot de passe de l'utilisateur avec le nouveau mot de passe
            user.Password = _jwtAuthenticationService.EncryptPWD(newPassword);
            user.ResetPasswordToken = null; // Réinitialiser le jeton après avoir utilisé
            user.ResetPasswordTokenExpiration = null; // Réinitialiser la date d'expiration

            _context.SaveChanges();

            return NoContent();
        }

        [HttpGet("password-reset-valide-token")]
        public IActionResult ValideTokenResetPassword(string token)
        {
            // Valider le jeton de réinitialisation de mot de passe
            bool isTokenValid = _jwtAuthenticationService.ValidatePasswordResetToken(token);
            if (!isTokenValid)
            {
                return BadRequest("Invalid or expired reset token");
            }

            return NoContent();
        }

        [HttpGet("extractCa")]
        [Authorize]
        public IActionResult GetExtractCa(DateTime? startDate, DateTime? endDate, string? region, int? vendeur)
        {
            // Récupérer les entrées de la table "extract_ca" en fonction des filtres
            var query = _context.extract_ca.AsQueryable();

            // Filtrer par date de début
            if (startDate.HasValue)
            {
                query = query.Where(e => e.Date >= startDate.Value);
            }

            // Filtrer par date de fin
            if (endDate.HasValue)
            {
                query = query.Where(e => e.Date <= endDate.Value);
            }

            // Filtrer par région
            if (!string.IsNullOrEmpty(region))
            {
                query = query.Where(e => e.Region == region);
            }

            // Filtrer par vendeur
            if (vendeur.HasValue)
            {
                query = query.Where(e => e.Vendeur == vendeur.Value);
            }

            // Récupérer les données de la base de données
            var extractCaList = query.ToList();

            // Calculer la somme des montants en convertissant les valeurs
            var sumByDateAndRegion = extractCaList
            .GroupBy(e => new { e.Date, e.Region })
            .Select(g => new
            {
                Date = g.Key.Date,
                Region = g.Key.Region,
                Vendeur = g.Select(e => e.Vendeur).FirstOrDefault(),
                Montanttotal = Math.Round(g.Sum(e => ParseDecimal(e.Montant))).ToString()
            })
            .ToList();

            return Ok(sumByDateAndRegion);
        }

        // Méthode pour convertir la chaîne en décimal en prenant en compte différents formats
        private decimal ParseDecimal(string value)
        {
            decimal result;
            if (decimal.TryParse(value, NumberStyles.Number, CultureInfo.InvariantCulture, out result))
            {
                return result;
            }
            return 0;
        }
    }
}
