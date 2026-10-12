import { useState } from 'react'
import BandeauCompte from '../components/BandeauCompte.jsx'
import SoldeGeneral from '../components/SoldeGeneral.jsx'
import {
  ecrireDonneesProjets,
  formatDate,
  formatEuros,
  lireDonneesProjets,
  reduireImage,
} from '../donnees/epargne.js'
import { useDonnees } from '../donnees/useDonnees.js'

// Formulaire de création ou de modification d'un projet (nom, objectif, image)
function FormulaireProjet({ projet, onValider, onAnnuler }) {
  const [nom, setNom] = useState(projet?.nom ?? '')
  const [objectif, setObjectif] = useState(projet?.objectif ?? '')
  const [image, setImage] = useState(projet?.image ?? '')
  const [erreur, setErreur] = useState('')

  async function choisirImage(event) {
    const fichier = event.target.files[0]
    if (!fichier) return
    try {
      setImage(await reduireImage(fichier))
      setErreur('')
    } catch {
      setErreur('Cette image ne peut pas être lue, choisis-en une autre.')
    }
  }

  function valider(event) {
    event.preventDefault()
    // L'image est obligatoire (le champ fichier ne peut pas être "required" en modification)
    if (!image) {
      setErreur('Choisis une image pour ce projet.')
      return
    }
    onValider({ nom: nom.trim(), objectif: Number(objectif), image })
  }

  return (
    <form className="carte formulaire formulaire-projet" onSubmit={valider}>
      <strong className="champ-plein">{projet ? `Modifier « ${projet.nom} »` : 'Nouveau projet'}</strong>

      <label>
        Nom
        <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} />
      </label>

      <label>
        Objectif (€)
        <input
          type="number"
          min="1"
          step="0.01"
          required
          value={objectif}
          onChange={(e) => setObjectif(e.target.value)}
        />
      </label>

      <div className="champ-plein champ-image">
        Image
        <span className="choix-image">
          {/* Le vrai champ fichier est caché : on clique sur ce petit bouton avec l'icône */}
          <label className="btn-image" title="Choisir une image">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M12 15V4m0 0L8 8m4-4 4 4M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input type="file" accept="image/*" onChange={choisirImage} aria-label="Choisir une image" />
          </label>
          {image && <img src={image} alt="" className="apercu-image" />}
        </span>
      </div>

      {erreur && <p className="message-erreur champ-plein">{erreur}</p>}

      <div className="boutons-formulaire champ-plein">
        <button type="button" className="btn btn-secondaire" onClick={onAnnuler}>Annuler</button>
        <button type="submit" className="btn">{projet ? 'Enregistrer' : 'Créer le projet'}</button>
      </div>
    </form>
  )
}

// Carte d'un projet : image, progression, boutons et ajouts repliés
function CarteProjet({ projet, ajouts, rang, onModifier, onSupprimer, onSupprimerAjout }) {
  const [ajoutsOuverts, setAjoutsOuverts] = useState(false)

  const total = ajouts.reduce((somme, v) => somme + v.montant, 0)
  const pourcentage = Math.min(100, Math.round((total / projet.objectif) * 100))

  return (
    // --rang décale l'apparition de chaque carte (effet cascade)
    <article className="carte carte-projet" style={{ '--rang': rang }}>
      <div className="haut-projet">
        {projet.image ? (
          <img src={projet.image} alt="" className="image-projet" />
        ) : (
          <span className="image-projet image-manquante">Ajoute une image via « Modifier »</span>
        )}

        <div className="infos-projet">
          <strong>{projet.nom}</strong>
          <span>{formatEuros(total)} / {formatEuros(projet.objectif)}</span>
          <div className="barre">
            <div className="barre-remplie" style={{ width: `${pourcentage}%` }} />
          </div>
          <span className="periode">{pourcentage} %</span>
        </div>
      </div>

      <div className="actions-projet">
        <button type="button" className="lien-bouton" onClick={() => setAjoutsOuverts(!ajoutsOuverts)}>
          {ajoutsOuverts ? 'Masquer les ajouts' : `Voir les ajouts (${ajouts.length})`}
        </button>
        <span className="espace" />
        <button type="button" className="lien-bouton" onClick={onModifier}>Modifier</button>
        <button type="button" className="lien-bouton lien-danger" onClick={onSupprimer}>Supprimer</button>
      </div>

      {ajoutsOuverts &&
        (ajouts.length === 0 ? (
          <p className="periode">Aucun ajout pour l'instant.</p>
        ) : (
          <ul className="historique">
            {/* Du plus récent au plus ancien */}
            {[...ajouts]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((v) => (
                <li key={v.id} className="ligne-historique">
                  <span className="periode">{formatDate(v.date)}</span>
                  <span className="note">{v.note}</span>
                  <span className="montant">+ {formatEuros(v.montant)}</span>
                  <button
                    type="button"
                    className="btn-supprimer"
                    onClick={() => onSupprimerAjout(v.id)}
                    aria-label="Supprimer cet ajout"
                  >
                    ✕
                  </button>
                </li>
              ))}
          </ul>
        ))}
    </article>
  )
}

function Projets() {
  // Projets et ajouts : dans le navigateur, ou dans le compte Google si on est connecté
  const { valeur: donnees, modifier, erreur: erreurStockage, connecte } = useDonnees(
    'projets',
    lireDonneesProjets,
    ecrireDonneesProjets,
  )
  const projets = donnees?.projets ?? []
  const versements = donnees?.versements ?? []

  // null = aucun formulaire ouvert, 'nouveau' = création, sinon l'id du projet modifié
  const [edition, setEdition] = useState(null)

  // Chaque changement met à jour l'affichage et enregistre (navigateur ou compte) ;
  // ...donnees garde le reste (dont le solde général) intact
  const setProjets = (nouveaux) => modifier({ ...donnees, projets: nouveaux })
  const setVersements = (nouveaux) => modifier({ ...donnees, versements: nouveaux })

  function enregistrerProjet(donnees) {
    if (edition === 'nouveau') {
      setProjets([...projets, { id: crypto.randomUUID(), ...donnees }])
    } else {
      setProjets(projets.map((p) => (p.id === edition ? { ...p, ...donnees } : p)))
    }
    setEdition(null)
  }

  function supprimerProjet(projet) {
    if (!confirm(`Supprimer le projet « ${projet.nom} » et tous ses ajouts ?`)) return
    // Un seul enregistrement pour le projet et ses ajouts
    // (l'argent venu du solde général y retourne automatiquement)
    modifier({
      ...donnees,
      projets: projets.filter((p) => p.id !== projet.id),
      versements: versements.filter((v) => v.projetId !== projet.id),
    })
  }

  function supprimerVersement(id) {
    const versement = versements.find((v) => v.id === id)
    const question = versement?.repartition
      ? 'Supprimer cet ajout ? Son montant revient dans le solde à répartir.'
      : 'Supprimer cet ajout ?'
    if (!confirm(question)) return
    setVersements(versements.filter((v) => v.id !== id))
  }

  const projetEdite = projets.find((p) => p.id === edition)

  return (
    <section>
      {/* Connexion Google discrète, dans le coin en haut à droite de la page */}
      <BandeauCompte />

      <h2 className="titre-centre">Projets</h2>
      <p className="intro-centree">
        Suis tes projets d’épargne. Personne d’autre que toi ne peut voir tes données.
      </p>

      {erreurStockage && (
        <p className="message-erreur">
          {connecte
            ? 'Impossible d’enregistrer dans ton compte. Vérifie ta connexion internet, ou essaie une image plus légère.'
            : 'Impossible d’enregistrer : le stockage du navigateur est plein ou bloqué. Essaie une image plus légère ou supprime un projet.'}
        </p>
      )}

      {/* Solde général : argent ajouté puis réparti entre les projets */}
      {donnees !== null && <SoldeGeneral donnees={donnees} modifier={modifier} />}

      {/* Données du compte pas encore reçues */}
      {donnees === null ? (
        <p className="periode intro-centree">Chargement de tes projets…</p>
      ) : edition ? (
        <FormulaireProjet
          // La clé recrée le formulaire quand on passe d'un projet à un autre
          key={edition}
          projet={projetEdite}
          onValider={enregistrerProjet}
          onAnnuler={() => setEdition(null)}
        />
      ) : projets.length === 0 ? (
        <div className="carte projets-vide">
          <p>Tu n’as pas encore de projet.</p>
          <button type="button" className="btn" onClick={() => setEdition('nouveau')}>
            Créer mon premier projet
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-nouveau-projet" onClick={() => setEdition('nouveau')}>
          + Nouveau projet
        </button>
      )}

      {projets.length > 0 && (
        <>
          <div className="grille">
            {projets.map((p, index) => (
              <CarteProjet
                key={p.id}
                projet={p}
                ajouts={versements.filter((v) => v.projetId === p.id)}
                rang={index}
                onModifier={() => setEdition(p.id)}
                onSupprimer={() => supprimerProjet(p)}
                onSupprimerAjout={supprimerVersement}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Projets
