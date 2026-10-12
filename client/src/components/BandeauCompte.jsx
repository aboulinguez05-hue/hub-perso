import { useState } from 'react'
import { useCompte } from '../compte.jsx'
import { firebaseActif } from '../firebase.js'

// Bandeau en haut de Projets et Gestion de salaire : connexion Google pour retrouver
// ses données sur tous ses appareils, ou rappel du compte connecté
function BandeauCompte() {
  const { utilisateur, connexion, deconnexion } = useCompte()
  const [erreur, setErreur] = useState('')

  // Firebase pas encore configuré, ou session en cours de vérification : rien à afficher
  if (!firebaseActif || utilisateur === undefined) return null

  async function seConnecter() {
    setErreur('')
    try {
      await connexion()
    } catch (e) {
      // Fenêtre Google fermée par l'utilisateur : ce n'est pas une erreur
      if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        setErreur('La connexion a échoué. Vérifie que les fenêtres pop-up ne sont pas bloquées.')
      }
    }
  }

  return (
    <div className="carte bandeau-compte">
      {utilisateur ? (
        <>
          <span>
            Connecté avec <strong>{utilisateur.email}</strong> : tes données sont synchronisées sur
            tous tes appareils.
          </span>
          <button type="button" className="lien-bouton" onClick={deconnexion}>
            Se déconnecter
          </button>
        </>
      ) : (
        <>
          <span>Connecte-toi avec Google pour retrouver tes données sur tous tes appareils.</span>
          <button type="button" className="btn" onClick={seConnecter}>
            Se connecter avec Google
          </button>
        </>
      )}
      {erreur && <p className="message-erreur">{erreur}</p>}
    </div>
  )
}

export default BandeauCompte
