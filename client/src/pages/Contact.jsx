import { useState } from 'react'

const EMAIL = 'Aboulinguez05@gmail.com'

// Coordonnées affichées en texte simple (non cliquables)
const COORDONNEES = [
  { titre: 'E-mail', valeur: EMAIL },
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
  const [nom, setNom] = useState('')
  const [objet, setObjet] = useState('')
  const [message, setMessage] = useState('')

  // Le site n'a pas de serveur d'e-mail : on ouvre la messagerie du visiteur
  // avec mon adresse, l'objet et le message déjà remplis
  const envoyer = (e) => {
    e.preventDefault()
    const corps = `${message}\n\n${nom}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(corps)}`
  }

  return (
    <section>
      <h2 className="titre-centre">Contact</h2>
      <p className="intro-centree">
        Une question, une opportunité ou simplement envie d’échanger ? N’hésitez pas à me
        contacter.
      </p>

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

      <h3 className="titre-centre">Coordonnées</h3>
      <ul className="coordonnees">
        {COORDONNEES.map((coordonnee) => (
          <li key={coordonnee.titre}>
            <span className="periode">{coordonnee.titre} :</span> {coordonnee.valeur}
          </li>
        ))}
      </ul>

      <h3 className="titre-centre">M’écrire un message</h3>
      <form className="carte formulaire-contact" onSubmit={envoyer}>
        <label>
          Nom
          <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} />
        </label>

        <label>
          Objet
          <input type="text" required value={objet} onChange={(e) => setObjet(e.target.value)} />
        </label>

        <label>
          Message
          <textarea rows="5" required value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>

        <button type="submit" className="btn">Envoyer</button>
      </form>
    </section>
  )
}

export default Contact
