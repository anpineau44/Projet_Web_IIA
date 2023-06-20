using API_dotnet_web_IIA.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_dotnet_web_IIA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly WebApiContext _context;

        public UsersController(WebApiContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserModel>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<UserModel>> GetUserById(int id)
        {
            var user = await _context.Users.Where(c => c.Id.Equals(id)).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<UserModel>> CreateUser(UserModel user)
        {
            // valider les données
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
