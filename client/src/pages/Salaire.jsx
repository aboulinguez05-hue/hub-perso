import { useState } from 'react'
import BandeauCompte from '../components/BandeauCompte.jsx'
import { formatEuros } from '../donnees/epargne.js'
import { useDonnees } from '../donnees/useDonnees.js'

// Clé sous laquelle les budgets sont enregistrés dans le navigateur du visiteur (localStorage) :
// chacun a ses propres budgets, et personne d'autre ne peut les voir.
const CLE_STOCKAGE = 'hub-perso-salaire'

// Dépenses proposées pour un premier budget (montants à remplir, lignes modifiables).
// Une dépense peut avoir "diviseur: 2" pour n'en compter que la moitié (anciens budgets).
const DEPENSES_PAR_DEFAUT = [
  { id: 'logement', nom: 'Logement', montant: '' },
  { id: 'courses', nom: 'Courses', montant: '' },
  { id: 'transport', nom: 'Transport', montant: '' },
  { id: 'telephone', nom: 'Téléphone', montant: '' },
  { id: 'epargne', nom: 'De côté', montant: '' },
]

// ----- Mois : on les note "AAAA-MM" (ex : "2026-10") -----
const versMois = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

const moisActuel = () => versMois(new Date())

function decalerMois(mois, decalage) {
  const [annee, m] = mois.split('-').map(Number)
  return versMois(new Date(annee, m - 1 + decalage, 1))
}

function nomDuMois(mois) {
  const [annee, m] = mois.split('-').map(Number)
  const nom = new Date(annee, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return nom.charAt(0).toUpperCase() + nom.slice(1)
}

// ----- Calculs -----
// Montant réellement compté pour une dépense (ex : assurance divisée par 2)
const montantCompte = (d) => (Number(d.montant) || 0) / (d.diviseur ?? 1)

function resume(budget) {
  const salaire = Number(budget.salaire) || 0
  const depenses = budget.depenses.reduce((somme, d) => somme + montantCompte(d), 0)
  const deCote = montantCompte(budget.depenses.find((d) => d.id === 'epargne') ?? {})
  return { salaire, depenses, deCote, reste: salaire - depenses }
}

// ----- Stockage : { "2026-10": { salaire, depenses }, "2026-09": {...}, ... } -----
function chargerBudgets() {
  try {
    const donnees = JSON.parse(localStorage.getItem(CLE_STOCKAGE))
    if (!donnees) return {}
    // Ancien format (un seul budget, sans mois) : on le range dans le mois en cours
    if (Array.isArray(donnees.depenses)) return { [moisActuel()]: donnees }
    return donnees
  } catch {
    return {}
  }
}

// Format utilisé par useDonnees : { budgets } (renvoie false si l'enregistrement échoue)
const lireDonneesSalaire = () => ({ budgets: chargerBudgets() })

function ecrireDonneesSalaire({ budgets }) {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(budgets))
    return true
  } catch {
    return false
  }
}

function Salaire() {
  // Budgets : dans le navigateur, ou dans le compte Google si on est connecté
  const { valeur: donnees, modifier, erreur: erreurStockage, connecte } = useDonnees(
    'salaire',
    lireDonneesSalaire,
    ecrireDonneesSalaire,
  )
  const [moisAffiche, setMoisAffiche] = useState(moisActuel)
  const [nouvelleDepense, setNouvelleDepense] = useState('')

  const entete = (
    <>
      {/* Connexion Google discrète, dans le coin en haut à droite de la page */}
      <BandeauCompte />

      <h2 className="titre-centre">Gestion de salaire</h2>
      <p className="intro-centree">
        Suis ton salaire et tes dépenses mois par mois. Personne d’autre que toi ne peut voir tes
        données.
      </p>

      {erreurStockage && (
        <p className="message-erreur intro-centree">
          {connecte
            ? 'Impossible d’enregistrer dans ton compte. Vérifie ta connexion internet.'
            : 'Impossible d’enregistrer : le stockage du navigateur est plein ou bloqué.'}
        </p>
      )}
    </>
  )

  // Données du compte pas encore reçues
  if (donnees === null) {
    return (
      <section>
        {entete}
        <p className="periode intro-centree">Chargement de tes budgets…</p>
      </section>
    )
  }

  const budgets = donnees.budgets
  const setBudgets = (nouveaux) => modifier({ budgets: nouveaux })

  // Tous les mois remplis, du plus récent au plus ancien
  const moisRemplis = Object.keys(budgets).sort().reverse()

  const budget = budgets[moisAffiche]
  // Dernier mois rempli avant celui affiché (sert pour la copie et la comparaison)
  const moisPrecedent = moisRemplis.find((m) => m < moisAffiche)

  function modifierBudget(nouveauBudget) {
    setBudgets({ ...budgets, [moisAffiche]: nouveauBudget })
  }

  // Crée le budget du mois : on reprend les lignes (et montants) du mois précédent, sinon la liste de départ
  function creerMois() {
    const modele = moisPrecedent ? budgets[moisPrecedent] : { salaire: '', depenses: DEPENSES_PAR_DEFAUT }
    modifierBudget(structuredClone(modele))
  }

  function supprimerMois() {
    if (!confirm(`Supprimer le budget de ${nomDuMois(moisAffiche).toLowerCase()} ?`)) return
    const copie = { ...budgets }
    delete copie[moisAffiche]
    setBudgets(copie)
  }

  function changerMontant(id, montant) {
    modifierBudget({
      ...budget,
      depenses: budget.depenses.map((d) => (d.id === id ? { ...d, montant } : d)),
    })
  }

  function ajouterDepense(event) {
    event.preventDefault()
    const nom = nouvelleDepense.trim()
    if (!nom) return

    modifierBudget({
      ...budget,
      depenses: [...budget.depenses, { id: crypto.randomUUID(), nom, montant: '' }],
    })
    setNouvelleDepense('')
  }

  function supprimerDepense(id) {
    modifierBudget({ ...budget, depenses: budget.depenses.filter((d) => d.id !== id) })
  }

  const totaux = budget && resume(budget)
  const totauxPrecedent = moisPrecedent && resume(budgets[moisPrecedent])

  return (
    <section>
      {entete}

      {/* Navigation entre les mois */}
      <div className="nav-mois">
        <button type="button" className="btn btn-secondaire" onClick={() => setMoisAffiche(decalerMois(moisAffiche, -1))}>
          ← Mois précédent
        </button>
        <strong className="mois-affiche">{nomDuMois(moisAffiche)}</strong>
        <button type="button" className="btn btn-secondaire" onClick={() => setMoisAffiche(decalerMois(moisAffiche, 1))}>
          Mois suivant →
        </button>
      </div>
      {moisAffiche !== moisActuel() && (
        <button type="button" className="lien-bouton retour-mois" onClick={() => setMoisAffiche(moisActuel())}>
          Revenir au mois en cours
        </button>
      )}

      {/* key={moisAffiche} : la carte est recréée à chaque changement de mois, ce qui relance le fondu */}
      {!budget ? (
        <div key={moisAffiche} className="carte budget budget-vide">
          <p>Pas encore de budget pour {nomDuMois(moisAffiche).toLowerCase()}.</p>
          <button type="button" className="btn" onClick={creerMois}>
            {moisPrecedent
              ? `Créer en reprenant ${nomDuMois(moisPrecedent).toLowerCase()}`
              : 'Créer le budget de ce mois'}
          </button>
        </div>
      ) : (
        <div key={moisAffiche} className="carte budget">
          <label className="ligne-budget ligne-salaire">
            <span>Salaire net</span>
            <span className="champ-euros">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={budget.salaire}
                onChange={(e) => modifierBudget({ ...budget, salaire: e.target.value })}
              />
              €
            </span>
          </label>

          <h3>Dépenses du mois</h3>

          {budget.depenses.map((d) => (
            <div key={d.id} className="ligne-budget">
              <label htmlFor={`depense-${d.id}`}>
                {d.nom}
                {d.diviseur && (
                  <span className="periode"> ÷ {d.diviseur} = {formatEuros(montantCompte(d))}</span>
                )}
              </label>
              <span className="champ-euros">
                <input
                  id={`depense-${d.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={d.montant}
                  onChange={(e) => changerMontant(d.id, e.target.value)}
                />
                €
                <button
                  type="button"
                  className="btn-supprimer"
                  onClick={() => supprimerDepense(d.id)}
                  aria-label={`Supprimer ${d.nom}`}
                >
                  ✕
                </button>
              </span>
            </div>
          ))}

          <form className="ajout-depense" onSubmit={ajouterDepense}>
            <input
              type="text"
              placeholder="Autre dépense (ex : abonnement)"
              value={nouvelleDepense}
              onChange={(e) => setNouvelleDepense(e.target.value)}
            />
            <button type="submit" className="btn btn-secondaire">Ajouter</button>
          </form>

          <div className="totaux">
            <div className="ligne-budget">
              <span>Total des dépenses</span>
              <strong>{formatEuros(totaux.depenses)}</strong>
            </div>
            <div className="ligne-budget">
              <span>Reste après dépenses</span>
              <strong className={totaux.reste < 0 ? 'reste-negatif' : 'reste-positif'}>
                {formatEuros(totaux.reste)}
              </strong>
            </div>
            {totauxPrecedent && (
              <div className="ligne-budget periode">
                <span>Par rapport à {nomDuMois(moisPrecedent).toLowerCase()}</span>
                <Ecart valeur={totaux.reste - totauxPrecedent.reste} />
              </div>
            )}
          </div>

          {totaux.salaire > 0 && (
            <>
              <div className="barre" title="Part du salaire utilisée par les dépenses">
                <div
                  className={totaux.depenses > totaux.salaire ? 'barre-remplie barre-depassee' : 'barre-remplie'}
                  style={{ width: `${Math.min(100, (totaux.depenses / totaux.salaire) * 100)}%` }}
                />
              </div>
              <span className="periode">
                {Math.round((totaux.depenses / totaux.salaire) * 100)} % du salaire utilisé
              </span>
            </>
          )}

          <button type="button" className="lien-bouton lien-danger" onClick={supprimerMois}>
            Supprimer ce mois
          </button>
        </div>
      )}

      {/* Vue d'ensemble de tous les mois */}
      {moisRemplis.length > 0 && (
        <>
          <h3 className="titre-centre">Tous tes mois</h3>
          <div className="carte tableau-conteneur">
            <table className="tableau">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th className="nombre">Salaire</th>
                  <th className="nombre">Dépenses</th>
                  <th className="nombre">De côté</th>
                  <th className="nombre">Reste</th>
                  <th className="nombre">Évolution du reste</th>
                </tr>
              </thead>
              <tbody>
                {moisRemplis.map((m, i) => {
                  const r = resume(budgets[m])
                  const avant = moisRemplis[i + 1] && resume(budgets[moisRemplis[i + 1]])
                  return (
                    <tr
                      key={m}
                      className={m === moisAffiche ? 'ligne-active' : ''}
                      onClick={() => setMoisAffiche(m)}
                    >
                      <td>{nomDuMois(m)}</td>
                      <td className="nombre">{formatEuros(r.salaire)}</td>
                      <td className="nombre">{formatEuros(r.depenses)}</td>
                      <td className="nombre">{formatEuros(r.deCote)}</td>
                      <td className={`nombre ${r.reste < 0 ? 'reste-negatif' : ''}`}>{formatEuros(r.reste)}</td>
                      <td className="nombre">{avant ? <Ecart valeur={r.reste - avant.reste} /> : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="periode intro-centree">Clique sur un mois pour l'afficher.</p>
        </>
      )}
    </section>
  )
}

// Affiche une différence avec son signe : "+ 50,00 €" en vert, "− 20,00 €" en rouge
function Ecart({ valeur }) {
  if (Math.abs(valeur) < 0.005) return <span>=</span>
  return (
    <span className={valeur > 0 ? 'reste-positif' : 'reste-negatif'}>
      {valeur > 0 ? '+ ' : '− '}
      {formatEuros(Math.abs(valeur))}
    </span>
  )
}

export default Salaire
