using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HubPerso.Api.Models;

// Un ajout d'argent sur un projet d'épargne (= une ligne de la table Versements)
public class Versement
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Projet { get; set; } = "";

    [Column(TypeName = "decimal(18,2)")]
    public decimal Montant { get; set; }

    public DateOnly Date { get; set; }

    [MaxLength(200)]
    public string? Note { get; set; }

    public DateTime CreeLe { get; set; } = DateTime.UtcNow;
}

// Ce que le formulaire envoie pour créer un ajout
public record NouveauVersement(string Projet, decimal Montant, DateOnly Date, string? Note);
