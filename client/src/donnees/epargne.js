// Données de l'onglet Projets. Tout est enregistré dans le navigateur du visiteur (localStorage) :
// chacun a ses propres projets, et personne d'autre ne peut les voir.

// Clés sous lesquelles les données sont enregistrées dans le navigateur
const CLE_PROJETS = 'hub-perso-projets'
const CLE_VERSEMENTS = 'hub-perso-versements'

function lire(cle) {
  try {
    return JSON.parse(localStorage.getItem(cle))
  } catch {
    return null
  }
}

// Renvoie false si l'enregistrement a échoué (stockage plein ou indisponible)
function ecrire(cle, valeur) {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur))
    return true
  } catch {
    return false
  }
}

// Projets : { id, nom, objectif, image } (image = image réduite, enregistrée en texte "data:...")
export function chargerProjets() {
  const projets = lire(CLE_PROJETS)
  if (projets) return projets

  // Ancienne version : le projet « AUDI TT 2 » était écrit dans le code et les ajouts
  // ne gardaient que son nom. S'il a déjà des ajouts dans ce navigateur, on le recrée ici.
  const anciens = lire(CLE_VERSEMENTS) ?? []
  if (anciens.some((v) => v.projet === 'AUDI TT 2')) {
    return [{ id: 'audi-tt-2', nom: 'AUDI TT 2', objectif: 10000, image: '' }]
  }
  return []
}

export const sauvegarderProjets = (projets) => ecrire(CLE_PROJETS, projets)

// Ajouts d'argent : { id, projetId, montant, date, note }
export function chargerVersements() {
  const versements = lire(CLE_VERSEMENTS) ?? []
  // Ancienne version : l'ajout gardait le nom du projet au lieu de son identifiant
  return versements.map((v) =>
    v.projetId ? v : { ...v, projetId: v.projet === 'AUDI TT 2' ? 'audi-tt-2' : v.projet },
  )
}

export const sauvegarderVersements = (versements) => ecrire(CLE_VERSEMENTS, versements)

// Réduit une image choisie par le visiteur (400 px de large maximum) et la renvoie en texte "data:..."
// pour qu'elle tienne dans le stockage du navigateur
export function reduireImage(fichier) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(fichier)
    image.onload = () => {
      const echelle = Math.min(1, 400 / image.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * echelle)
      canvas.height = Math.round(image.height * echelle)
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image illisible'))
    }
    image.src = url
  })
}

export const aujourdhui = () => new Date().toISOString().slice(0, 10)

export const formatEuros = (montant) =>
  montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

export const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')
