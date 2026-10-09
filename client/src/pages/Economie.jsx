// Données d'exemple — plus tard elles viendront d'une API (.NET) et seront réservées à l'admin
const PROJETS = [
  { nom: 'Projet exemple 1', investi: 300, prevu: 1000 },
  { nom: 'Projet exemple 2', investi: 750, prevu: 1500 },
]

function Economie() {
  return (
    <section>
      <h2>Économie</h2>
      <p>Suivi de mes projets d'épargne : montant investi par rapport à l'objectif.</p>

      <div className="grille">
        {PROJETS.map((projet) => {
          const pourcentage = Math.round((projet.investi / projet.prevu) * 100)

          return (
            <article key={projet.nom} className="carte">
              <strong>{projet.nom}</strong>
              <span>{projet.investi} € / {projet.prevu} €</span>
              <div className="barre">
                <div className="barre-remplie" style={{ width: `${pourcentage}%` }} />
              </div>
              <span className="periode">{pourcentage} %</span>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Economie
