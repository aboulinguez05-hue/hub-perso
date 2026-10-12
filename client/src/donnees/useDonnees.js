import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useCompte } from '../compte.jsx'
import { db } from '../firebase.js'

// Données d'une page (Projets ou Salaire), rangées au bon endroit :
// - sans connexion : dans le navigateur (localStorage), comme avant ;
// - connecté avec Google : dans Firestore, sous utilisateurs/{uid}/donnees/{nom},
//   synchronisé en direct entre tous les appareils du même compte.
// lireLocal et ecrireLocal doivent être définies hors du composant (fonctions stables).
export function useDonnees(nom, lireLocal, ecrireLocal) {
  const { utilisateur } = useCompte()
  const uid = utilisateur?.uid

  const [local, setLocal] = useState(lireLocal)
  // On garde l'uid avec la valeur : si on change de compte, l'ancienne valeur n'est plus utilisée
  const [distant, setDistant] = useState({ uid: null, valeur: null })
  const [erreur, setErreur] = useState(false)

  useEffect(() => {
    if (!uid) return
    const reference = doc(db, 'utilisateurs', uid, 'donnees', nom)

    // onSnapshot : appelé tout de suite, puis à chaque modification (depuis cet appareil ou un autre)
    return onSnapshot(
      reference,
      (instantane) => {
        if (instantane.exists()) {
          setDistant({ uid, valeur: instantane.data() })
          setErreur(false)
        } else if (!instantane.metadata.fromCache) {
          // Le compte n'a encore rien (vérifié auprès du serveur, pas seulement du cache) :
          // on y envoie les données déjà enregistrées dans ce navigateur
          setDoc(reference, lireLocal()).catch(() => setErreur(true))
        }
      },
      () => setErreur(true),
    )
  }, [uid, nom, lireLocal])

  const connecte = Boolean(uid)
  // utilisateur === undefined : Firebase vérifie encore la session, on attend avant d'afficher
  const enAttente = utilisateur === undefined || (connecte && distant.uid !== uid)
  const valeur = enAttente ? null : connecte ? distant.valeur : local

  function modifier(nouvelle) {
    if (connecte) {
      setDistant({ uid, valeur: nouvelle })
      setDoc(doc(db, 'utilisateurs', uid, 'donnees', nom), nouvelle)
        .then(() => setErreur(false))
        .catch(() => setErreur(true))
    } else {
      setLocal(nouvelle)
      setErreur(!ecrireLocal(nouvelle))
    }
  }

  return { valeur, modifier, erreur, connecte }
}
