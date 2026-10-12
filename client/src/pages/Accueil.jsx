// Mes passions, affichées en cartes sous « Qui suis-je »
const PASSIONS = [
  {
    titre: 'Hardware',
    texte:
      'Je suis les nouveautés (cartes graphiques, processeurs) et j’aime choisir les pièces, monter et optimiser des PC. Le mien : Ryzen 7 5800X et RTX 3080.',
  },
  {
    titre: 'Musculation',
    texte:
      'Des séances régulières à la salle pour garder la forme et me fixer des objectifs, avec 3 ans de boxe derrière moi.',
  },
  {
    titre: 'Jeux vidéo sur PC',
    texte: 'Mon moment pour décompresser, seul ou entre amis.',
  },
  {
    titre: 'Voitures',
    texte: 'Passionné d’automobile : le design, les performances et les nouveautés.',
  },
]

function Accueil() {
  return (
    <>
      <section className="section-accueil">
        <h2 className="titre-centre">Qui suis-je ?</h2>
        <p className="intro-centree">
          J’ai 19 ans et je vis en Normandie. Je suis développeur en alternance chez Groupe Trace,
          où je travaille sur une API en C# et .NET. J’aime apprendre en construisant des projets
          concrets, comme ce site.
        </p>
      </section>

      <section className="section-accueil">
        <h2 className="titre-centre">Mes passions</h2>
        <ul className="grille-passions">
          {PASSIONS.map((passion, index) => (
            // --rang décale l'apparition de chaque carte (effet cascade, comme la frise)
            <li key={passion.titre} className="carte-passion" style={{ '--rang': index }}>
              <strong>{passion.titre}</strong>
              <span className="detail">{passion.texte}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default Accueil
