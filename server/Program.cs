using HubPerso.Api.Data;
using HubPerso.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Connexion à la base SQL Server (chaîne "HubDb" dans appsettings.json)
builder.Services.AddDbContext<HubDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("HubDb")));

var app = builder.Build();

// Au démarrage : crée la base si elle n'existe pas et applique les migrations en attente
using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<HubDbContext>().Database.Migrate();
}

var versements = app.MapGroup("/api/versements");

// GET /api/versements : tous les ajouts, du plus récent au plus ancien
versements.MapGet("/", async (HubDbContext db) =>
    await db.Versements
        .OrderByDescending(v => v.Date)
        .ThenByDescending(v => v.Id)
        .ToListAsync());

// POST /api/versements : ajoute de l'argent sur un projet
versements.MapPost("/", async (NouveauVersement saisie, HubDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(saisie.Projet) || saisie.Montant <= 0)
        return Results.BadRequest("Projet et montant positif obligatoires.");

    var versement = new Versement
    {
        Projet = saisie.Projet.Trim(),
        Montant = saisie.Montant,
        Date = saisie.Date,
        Note = string.IsNullOrWhiteSpace(saisie.Note) ? null : saisie.Note.Trim(),
    };

    db.Versements.Add(versement);
    await db.SaveChangesAsync();

    return Results.Created($"/api/versements/{versement.Id}", versement);
});

// DELETE /api/versements/5 : supprime un ajout (en cas d'erreur de saisie)
versements.MapDelete("/{id:int}", async (int id, HubDbContext db) =>
{
    var supprimes = await db.Versements.Where(v => v.Id == id).ExecuteDeleteAsync();
    return supprimes == 0 ? Results.NotFound() : Results.NoContent();
});

app.Run();
