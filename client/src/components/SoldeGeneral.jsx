import { useState } from 'react'
import { arrondir, aujourdhui, calculerSolde, formatDate, formatEuros } from '../donnees/epargne.js'

// Formulaire « + Ajouter au solde » : montant, date et note facultative
function FormulaireAjoutSolde({ onValider, onAnnuler }) {
  const [montant, setMontant] = useState('')
  const [date, setDate] = useState(aujourdhui)
  const [note, setNote] = useState('')

  function valider(event) {
    event.preventDefault() // empêche le rechargement de la page à l'envoi du formulaire
    const valeur = arrondir(Number(montant))
    if (!valeur || valeur <= 0) return
    onValider({ id: crypto.randomUUID(), montant: valeur, date, note: note.trim() })
  }

  return (
    <form className="formulaire formulaire-solde" onSubmit={valider}>
      <label>
        Montant (€)
        <input
          type="number"
          min="0.01"
          step="0.01"
          required
          autoFocus
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

      <div className="boutons-formulaire champ-plein">
        <button type="button" className="btn btn-secondaire" onClick={onAnnuler}>Annuler</button>
        <button type="submit" className="btn">Ajouter au solde</button>
      </div>
    </form>
  )
}

// Écran « Répartir » : un montant par projet, avec le reste à répartir mis à jour en direct
function FormulaireRepartition({ solde, projets, onValider, onAnnuler }) {
  // Montants tapés pour chaque projet : { [projetId]: '12.50' }
  const [montants, setMontants] = useState({})

  const total = arrondir(projets.reduce((somme, p) => somme + (Number(montants[p.id]) || 0), 0))
  const reste = arrondir(solde - total)

  const changer = (id, valeur) => setMontants({ ...montants, [id]: valeur })

  function valider(event) {
    event.preventDefault()
    if (reste < 0 || total <= 0) return
    const repartition = projets
      .map((p) => ({ projetId: p.id, montant: arrondir(Number(montants[p.id]) || 0) }))
      .filter((r) => r.montant > 0)
    onValider(repartition)
  }

  return (
    <form className="formulaire-repartition" onSubmit={valider}>
      <span className={reste < 0 ? 'reste-negatif' : 'periode'}>
        {reste < 0
          ? `Tu dépasses le solde de ${formatEuros(-reste)}`
          : `Reste à répartir : ${formatEuros(reste)}`}
      </span>

      {projets.map((p) => (
        <div key={p.id} className="ligne-repartition">
          <label htmlFor={`repartition-${p.id}`}>{p.nom}</label>
          <span className="champ-euros">
            <input
              id={`repartition-${p.id}`}
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={montants[p.id] ?? ''}
              onChange={(e) => changer(p.id, e.target.value)}
            />
            €
          </span>
        </div>
      ))}

      <div className="boutons-formulaire">
        <button type="button" className="btn btn-secondaire" onClick={onAnnuler}>Annuler</button>
        <button type="submit" className="btn" disabled={reste < 0 || total <= 0}>
          Répartir {total > 0 && formatEuros(total)}
        </button>
      </div>
    </form>
  )
}

// Petite courbe de l'évolution du solde : elle part de 0, monte en vert à chaque ajout au solde
// et descend en rouge à chaque répartition. Le survol d'un point affiche l'opération dessous.
const LARGEUR = 200
const HAUTEUR = 56
const MARGE = 6

function CourbeSolde({ mouvements }) {
  const [survole, setSurvole] = useState(null)

  // Solde après chaque mouvement (le premier point est le départ, à 0)
  const soldes = mouvements.reduce((liste, m) => [...liste, arrondir(liste.at(-1) + m.montant)], [0])
  const min = Math.min(...soldes)
  const max = Math.max(...soldes)

  // Coordonnées dans le dessin : x régulier, y proportionnel au solde (haut = solde le plus élevé)
  const x = (i) => MARGE + (i * (LARGEUR - 2 * MARGE)) / mouvements.length
  const y = (valeur) => HAUTEUR - MARGE - ((valeur - min) / (max - min || 1)) * (HAUTEUR - 2 * MARGE)

  const detail = survole !== null && mouvements[survole]

  return (
    <div className="courbe-solde">
      <svg viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`} role="img" aria-label="Évolution du solde">
        {mouvements.map((m, i) => (
          <line
            key={m.id}
            x1={x(i)}
            y1={y(soldes[i])}
            x2={x(i + 1)}
            y2={y(soldes[i + 1])}
            className={m.montant >= 0 ? 'trait-ajout' : 'trait-retrait'}
          />
        ))}
        {mouvements.map((m, i) => (
          <g key={m.id} onMouseEnter={() => setSurvole(i)} onMouseLeave={() => setSurvole(null)}>
            {/* Zone invisible plus large pour faciliter le survol */}
            <circle cx={x(i + 1)} cy={y(soldes[i + 1])} r="8" className="zone-survol" />
            <circle
              cx={x(i + 1)}
              cy={y(soldes[i + 1])}
              r={survole === i ? 4 : 2.5}
              className={m.montant >= 0 ? 'point-ajout' : 'point-retrait'}
            />
          </g>
        ))}
      </svg>
      <span className={detail ? (detail.montant >= 0 ? 'reste-positif' : 'reste-negatif') : 'periode'}>
        {detail
          ? `${formatDate(detail.date)} : ${detail.montant >= 0 ? '+' : '−'} ${formatEuros(Math.abs(detail.montant))}`
          : 'Évolution du solde'}
      </span>
    </div>
  )
}

// Carte « Solde à répartir » en haut de Projets : ajout d'argent, répartition et historique replié
function SoldeGeneral({ donnees, modifier }) {
  const { projets, versements } = donnees
  const ajoutsSolde = donnees.ajoutsSolde ?? []
  const solde = calculerSolde(ajoutsSolde, versements)

  // null = rien d'ouvert, 'ajout' = formulaire d'ajout, 'repartition' = écran de répartition
  const [ouvert, setOuvert] = useState(null)
  const [historiqueOuvert, setHistoriqueOuvert] = useState(false)
  const [message, setMessage] = useState('')

  function ajouter(ajout) {
    modifier({ ...donnees, ajoutsSolde: [...ajoutsSolde, ajout] })
    setOuvert(null)
  }

  // Chaque montant devient un ajout dans le projet, marqué avec l'identifiant de la répartition
  function repartir(repartition) {
    const id = crypto.randomUUID()
    const date = aujourdhui()
    const nouveaux = repartition.map((r) => ({
      id: crypto.randomUUID(),
      projetId: r.projetId,
      montant: r.montant,
      date,
      note: 'Répartition du solde',
      repartition: id,
    }))
    modifier({ ...donnees, ajoutsSolde, versements: [...versements, ...nouveaux] })
    setOuvert(null)
  }

  function supprimerAjout(ajout) {
    // L'argent déjà réparti ne peut pas disparaître du solde : il faut d'abord annuler une répartition
    if (ajout.montant > solde) {
      setMessage('Cet argent a déjà été réparti : annule d’abord une répartition pour le remettre dans le solde.')
      return
    }
    if (!confirm(`Supprimer l’ajout de ${formatEuros(ajout.montant)} au solde ?`)) return
    setMessage('')
    modifier({ ...donnees, ajoutsSolde: ajoutsSolde.filter((a) => a.id !== ajout.id) })
  }

  // Annuler une répartition : ses ajouts sont retirés des projets et l'argent revient dans le solde
  function annulerRepartition(id) {
    if (!confirm('Annuler cette répartition ? L’argent revient dans le solde.')) return
    setMessage('')
    modifier({ ...donnees, ajoutsSolde, versements: versements.filter((v) => v.repartition !== id) })
  }

  // Historique : ajouts au solde et répartitions (regroupées), du plus récent au plus ancien
  const repartitions = Object.values(
    versements
      .filter((v) => v.repartition)
      .reduce((groupes, v) => {
        const groupe = groupes[v.repartition] ?? { id: v.repartition, date: v.date, montant: 0, details: [] }
        groupe.montant = arrondir(groupe.montant + v.montant)
        groupe.details.push(`${projets.find((p) => p.id === v.projetId)?.nom ?? '?'} ${formatEuros(v.montant)}`)
        return { ...groupes, [v.repartition]: groupe }
      }, {}),
  )
  const historique = [
    ...ajoutsSolde.map((a) => ({ ...a, type: 'ajout' })),
    ...repartitions.map((r) => ({ ...r, type: 'repartition' })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  // Mouvements pour la courbe, du plus ancien au plus récent (à date égale, les ajouts d'abord) :
  // montant positif pour un ajout au solde, négatif pour une répartition
  const mouvements = [
    ...ajoutsSolde.map((a) => ({ id: a.id, date: a.date, montant: a.montant, ordre: 0 })),
    ...repartitions.map((r) => ({ id: r.id, date: r.date, montant: -r.montant, ordre: 1 })),
  ].sort((a, b) => a.date.localeCompare(b.date) || a.ordre - b.ordre)

  return (
    <div className="carte carte-solde">
      <div className="haut-solde">
        <div className="montant-solde">
          <span className="periode">Solde à répartir</span>
          <strong>{formatEuros(solde)}</strong>
        </div>
        {mouvements.length > 0 && <CourbeSolde mouvements={mouvements} />}
        <div className="boutons-solde">
          <button type="button" className="btn btn-secondaire" onClick={() => setOuvert(ouvert === 'ajout' ? null : 'ajout')}>
            + Ajouter
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setOuvert(ouvert === 'repartition' ? null : 'repartition')}
            disabled={solde <= 0 || projets.length === 0}
            title={projets.length === 0 ? 'Crée d’abord un projet' : undefined}
          >
            Répartir
          </button>
        </div>
      </div>

      {ouvert === 'ajout' && <FormulaireAjoutSolde onValider={ajouter} onAnnuler={() => setOuvert(null)} />}
      {ouvert === 'repartition' && (
        <FormulaireRepartition
          solde={solde}
          projets={projets}
          onValider={repartir}
          onAnnuler={() => setOuvert(null)}
        />
      )}

      {message && <p className="message-erreur">{message}</p>}

      {historique.length > 0 && (
        <button type="button" className="lien-bouton lien-historique" onClick={() => setHistoriqueOuvert(!historiqueOuvert)}>
          {historiqueOuvert ? 'Masquer l’historique' : `Voir l’historique (${historique.length})`}
        </button>
      )}

      {historiqueOuvert && (
        <ul className="historique">
          {historique.map((h) =>
            h.type === 'ajout' ? (
              <li key={h.id} className="ligne-historique">
                <span className="periode">{formatDate(h.date)}</span>
                <span className="note">Ajout au solde{h.note && ` : ${h.note}`}</span>
                <span className="montant">+ {formatEuros(h.montant)}</span>
                <button
                  type="button"
                  className="btn-supprimer"
                  onClick={() => supprimerAjout(h)}
                  aria-label="Supprimer cet ajout au solde"
                >
                  ✕
                </button>
              </li>
            ) : (
              <li key={h.id} className="ligne-historique">
                <span className="periode">{formatDate(h.date)}</span>
                <span className="note">Répartition : {h.details.join(', ')}</span>
                <span className="montant-reparti">− {formatEuros(h.montant)}</span>
                <button type="button" className="lien-discret" onClick={() => annulerRepartition(h.id)}>
                  Annuler
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}

export default SoldeGeneral
