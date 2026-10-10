import audiTT from '../assets/audi-tt.webp'

// Données partagées entre l'onglet Projets (formulaire) et l'onglet Économie (graphique)

// Projets d'épargne : "investi" = montant déjà mis de côté avant le suivi
export const PROJETS = [
  { nom: 'AUDI TT 2', investi: 0, prevu: 10000, image: audiTT },
]

// Clé sous laquelle les ajouts sont enregistrés dans le navigateur
const CLE_STOCKAGE = 'hub-perso-versements'

// Lit les ajouts enregistrés (tableau vide si rien, ou si le stockage est indisponible)
export function chargerVersements() {
  try {
    return JSON.parse(localStorage.getItem(CLE_STOCKAGE)) ?? []
  } catch {
    return []
  }
}

export function sauvegarderVersements(versements) {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(versements))
  } catch {
    // stockage indisponible (navigation privée…) : on garde juste les données en mémoire
  }
}

export const aujourdhui = () => new Date().toISOString().slice(0, 10)

export const formatEuros = (montant) =>
  montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

export const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')
