using Microsoft.EntityFrameworkCore;
using ClaimPortal.Api.Models;
namespace ClaimPortal.Api.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Claim>()
            .Property(c => c.SubmittedAt)
            .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<Claimant>()
            .Property(c => c.CreatedAt)
            .HasDefaultValueSql("GETDATE()");
    }

    public DbSet<Claim> Claims { get; set; }
    public DbSet<Claimant> Claimants { get; set; }
}