// Expériences et scolarité, de la plus ancienne à la plus récente
const EXPERIENCES = [
  {
    periode: 'Février 2022',
    titre: 'Stage chez Normandie Koï',
    lieu: 'Bernières (76)',
    detail: 'Mise en rayon, entretien des aquariums, analyses des eaux.',
  },
  {
    periode: 'Février 2023',
    titre: 'Stage à la Clinique Vétérinaire de l’Aérodrome',
    lieu: 'Saint-Romain-de-Colbosc (76)',
    detail: 'Assistance sur divers soins.',
  },
  {
    periode: 'Février 2023',
    titre: 'Stage chez Trace Software',
    lieu: 'Saint-Romain-de-Colbosc (76)',
    detail: 'Initiation au code HTML, CSS et JavaScript, découverte des métiers de développeur, du marketing et de la communication.',
  },
  {
    periode: 'Avril 2023',
    titre: 'Stage à l’École 42',
    lieu: 'Le Havre (76)',
    detail: 'Stage d’immersion d’une semaine auprès des étudiants en développement informatique, réalisation de divers exercices de codage.',
  },
  {
    periode: 'Janvier 2025 – aujourd’hui',
    titre: 'Exercices d’application OpenClassrooms',
    lieu: 'En autonomie',
  },
  {
    periode: '2025 – aujourd’hui',
    titre: 'Alternance développeur chez Groupe Trace',
    lieu: 'Saint-Romain-de-Colbosc (76)',
    detail: 'Développement d’une API en C# et .NET avec une base PostgreSQL : import automatique des courbes de charge EDF, stockage des mesures et création de routes pour les consulter.',
  },
]

const SCOLARITE = [
  { periode: '2010 – 2017', titre: 'École élémentaire Henri Blanc', lieu: 'Bréauté (76)' },
  { periode: '2017 – 2019', titre: 'Collège André Gide', lieu: 'Goderville (76)' },
  { periode: '2019 – 2022', titre: 'Collège La Providence', lieu: 'Fécamp (76)' },
  { periode: '2022 – 2025', titre: 'Lycée La Providence', lieu: 'Fécamp (76)' },
  {
    periode: 'Juin 2025',
    titre: 'Bac général, spécialités Mathématiques et Physique-Chimie',
    lieu: 'Lycée La Providence, Fécamp (76)',
  },
]

const COMPETENCES = ['C#', '.NET', 'React', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Git']

// Une frise verticale : un point violet par étape, relié par un trait,
// avec à côté un petit bloc blanc (période — titre, lieu, détail éventuel)
function Etapes({ etapes }) {
  return (
    <ul className="frise">
      {etapes.map((etape, index) => (
        // --rang sert à décaler l'apparition de chaque étape (effet cascade)
        <li key={etape.periode + etape.titre} className="etape" style={{ '--rang': index }}>
          <div className="bloc-etape">
            <span className="ligne-etape">
              <span className="periode">{etape.periode}</span>
              <span className="tiret">—</span>
              <strong>{etape.titre}</strong>
            </span>
            <span className="lieu">{etape.lieu}</span>
            {etape.detail && <span className="detail">{etape.detail}</span>}
          </div>
        </li>
      ))}
    </ul>
  )
}

function APropos() {
  return (
    <section>
      <h2 className="titre-centre">Mon parcours</h2>
      <p className="intro-centree">
        Bachelier en 2025 avec les spécialités mathématiques et physique-chimie, je me forme au
        développement informatique. Mes stages à l’École 42 et chez Trace Software m’ont donné
        envie d’en faire mon métier.
      </p>

      <h3 className="titre-centre">Expérience</h3>
      <Etapes etapes={EXPERIENCES} />

      <h3 className="titre-centre">Scolarité</h3>
      <Etapes etapes={SCOLARITE} />

      <h3 className="titre-centre">Compétences</h3>
      <div className="tags">
        {COMPETENCES.map((comp) => (
          <span key={comp} className="tag">{comp}</span>
        ))}
      </div>
    </section>
  )
}

export default APropos
