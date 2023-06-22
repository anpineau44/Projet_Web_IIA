using Microsoft.EntityFrameworkCore;

namespace API_dotnet_web_IIA.Models
{
    public class WebApiContext : DbContext
    {
        public WebApiContext(DbContextOptions<WebApiContext> options) : base(options)
        {
        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<ExtractCaModel> extract_ca { get; set; }
    }
}
//Add-Migration nomdelamigration
//Update-Database