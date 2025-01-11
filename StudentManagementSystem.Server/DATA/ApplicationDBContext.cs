
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StudentManagementSystem.Server.Models;

namespace StudentManagementSystem.Server.DATA
{
    public class ApplicationDBContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {
        }


        public DbSet<Student> Students { get; set; }

        public DbSet<Class> Classs { get; set; }
        public DbSet<Teacher> Teachers { get; set; }

    }
}