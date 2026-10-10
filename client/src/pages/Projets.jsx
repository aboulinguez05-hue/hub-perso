import { useEffect, useState } from 'react'
import {
  PROJETS,
  aujourdhui,
  chargerVersements,
  formatDate,
  formatEuros,
  sauvegarderVersements,
} from '../donnees/epargne.js'

function Projets() {
  // Liste de tous les ajouts : { id, projet, montant, date, note }
  const [versements, setVersements] = useState(chargerVersements)

  // Champs du formulaire
  const [projet, setProjet] = useState(PROJETS[0].nom)
  const [montant, setMontant] = useState('')
  const [date, setDate] = useState(aujourdhui)
  const [note, setNote] = useState('')

  // À chaque changement de la liste, on la sauvegarde dans le navigateur
  useEffect(() => {
    sauvegarderVersements(versements)
  }, [versements])

  function ajouterVersement(event) {
    event.preventDefault() // empêche le rechargement de la page à l'envoi du formulaire

    const valeur = Number(montant)
    if (!valeur || valeur <= 0) return

    const nouveau = { id: crypto.randomUUID(), projet, montant: valeur, date, note: note.trim() }
    setVersements([...versements, nouveau])

    setMontant('')
    setNote('')
  }

  function supprimerVersement(id) {
    if (!confirm('Supprimer cet ajout ?')) return
    setVersements(versements.filter((v) => v.id !== id))
  }

  return (
    <section>
      <h2>Projets</h2>
      <p>Suivi de mes projets d'épargne : montant investi par rapport à l'objectif.</p>

      <div className="grille">
        {PROJETS.map((p) => {
          const ajouts = versements.filter((v) => v.projet === p.nom)
          const total = p.investi + ajouts.reduce((somme, v) => somme + v.montant, 0)
          const pourcentage = Math.min(100, Math.round((total / p.prevu) * 100))

          return (
            <article key={p.nom} className="carte carte-projet">
              <img src={p.image} alt={p.nom} className="image-projet" />

              <div className="infos-projet">
                <strong>{p.nom}</strong>
                <span>{formatEuros(total)} / {formatEuros(p.prevu)}</span>
                <div className="barre">
                  <div className="barre-remplie" style={{ width: `${pourcentage}%` }} />
                </div>
                <span className="periode">{pourcentage} %</span>
              </div>
            </article>
          )
        })}
      </div>

      <h3>Ajouter de l'argent</h3>
      <form className="carte formulaire" onSubmit={ajouterVersement}>
        <label>
          Projet
          <select value={projet} onChange={(e) => setProjet(e.target.value)}>
            {PROJETS.map((p) => (
              <option key={p.nom} value={p.nom}>{p.nom}</option>
            ))}
          </select>
        </label>

        <label>
          Montant (€)
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
        </label>

        <label>
          Date
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <label className="champ-large">
          Note (facultatif)
          <input
            type="text"
            placeholder="ex : salaire d'octobre"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <button type="submit" className="btn">Ajouter</button>
      </form>

      <h3>Historique des ajouts</h3>
      {versements.length === 0 ? (
        <p className="periode">Aucun ajout pour l'instant.</p>
      ) : (
        <ul className="historique">
          {/* Du plus récent au plus ancien */}
          {[...versements]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((v) => (
              <li key={v.id} className="carte ligne-historique">
                <span className="periode">{formatDate(v.date)}</span>
                <strong>{v.projet}</strong>
                <span className="note">{v.note}</span>
                <span className="montant">+ {formatEuros(v.montant)}</span>
                <button
                  type="button"
                  className="btn-supprimer"
                  onClick={() => supprimerVersement(v.id)}
                  aria-label="Supprimer cet ajout"
                >
                  ✕
                </button>
              </li>
            ))}
        </ul>
      )}
    </section>
  )
}

export default Projets
