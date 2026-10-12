// Coordonnées affichées en texte simple (non cliquables)
const COORDONNEES = [
  { titre: 'E-mail', valeur: 'Aboulinguez05@gmail.com' },
  { titre: 'Téléphone', valeur: '06 51 94 41 17' },
]

// Réseaux, affichés en cartes cliquables qui s'ouvrent dans un nouvel onglet
const RESEAUX = [
  {
    titre: 'GitHub',
    valeur: 'aboulinguez05-hue',
    lien: 'https://github.com/aboulinguez05-hue',
  },
  {
    titre: 'LinkedIn',
    valeur: 'Antoine Boulinguez',
    lien: 'https://www.linkedin.com/in/antoine-boulinguez-a62114302/',
  },
]

function Contact() {
  return (
    // Les trois parties sont réparties sur toute la hauteur de la page (voir .page-contact)
    <section className="page-contact">
      <div>
        <h2 className="titre-centre">Contact</h2>
        <p className="intro-centree">
          Une question, une opportunité ou simplement envie d’échanger ? N’hésitez pas à me
          contacter.
        </p>
      </div>

      <div>
        <h3 className="titre-centre">Réseaux</h3>
        <ul className="grille-contacts">
          {RESEAUX.map((reseau, index) => (
            // --rang décale l'apparition de chaque carte (effet cascade)
            <li key={reseau.titre} style={{ '--rang': index }}>
              <a href={reseau.lien} className="carte-contact" target="_blank" rel="noreferrer">
                <strong>
                  {reseau.titre} <span className="fleche">↗</span>
                </strong>
                <span className="detail">{reseau.valeur}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="titre-centre">Coordonnées</h3>
        <ul className="coordonnees">
          {COORDONNEES.map((coordonnee) => (
            <li key={coordonnee.titre}>
              <span className="periode">{coordonnee.titre} :</span> {coordonnee.valeur}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Contact
