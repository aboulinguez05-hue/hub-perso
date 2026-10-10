using HubPerso.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HubPerso.Api.Data;

public class HubDbContext(DbContextOptions<HubDbContext> options) : DbContext(options)
{
    public DbSet<Versement> Versements => Set<Versement>();
}
