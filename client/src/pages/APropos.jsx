// TODO : remplace les textes par ton vrai parcours
const PARCOURS = [
  { periode: '20XX – aujourd’hui', titre: 'Poste / formation actuelle', lieu: 'Entreprise ou école' },
  { periode: '20XX – 20XX', titre: 'Formation précédente', lieu: 'École' },
]

const COMPETENCES = ['C#', '.NET', 'React', 'JavaScript', 'SQL', 'Git']

function APropos() {
  return (
    <section>
      <h2>À propos de moi</h2>
      <p>
        Présente-toi ici en quelques lignes : qui tu es, ce qui te motive, ce que tu cherches.
      </p>

      <h3>Parcours</h3>
      <ul className="timeline">
        {PARCOURS.map((etape) => (
          <li key={etape.titre} className="carte">
            <span className="periode">{etape.periode}</span>
            <strong>{etape.titre}</strong>
            <span>{etape.lieu}</span>
          </li>
        ))}
      </ul>

      <h3>Compétences</h3>
      <div className="tags">
        {COMPETENCES.map((comp) => (
          <span key={comp} className="tag">{comp}</span>
        ))}
      </div>
    </section>
  )
}

export default APropos
