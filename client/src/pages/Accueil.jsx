import photo from '../assets/photo.jpg'

function Accueil({ onChange }) {
  return (
    <section className="hero">
      <img src={photo} alt="Photo d'Antoine Boulinguez" className="photo" />

      <div>
        <h1>Bonjour, je suis Antoine Boulinguez</h1>
        <p className="sous-titre">
          {/* TODO : remplace par une phrase qui te décrit */}
          Développeur en devenir — bienvenue sur mon hub personnel.
        </p>

        <div className="actions">
          <button type="button" className="btn" onClick={() => onChange('apropos')}>
            Découvrir mon parcours
          </button>
          <button type="button" className="btn btn-secondaire" onClick={() => onChange('projets')}>
            Mes projets d'épargne
          </button>
        </div>
      </div>
    </section>
  )
}

export default Accueil
