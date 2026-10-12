import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, firebaseActif, fournisseurGoogle } from './firebase.js'

// Compte Google de la personne connectée, partagé avec toutes les pages
const CompteContexte = createContext(null)

export function CompteProvider({ children }) {
  // undefined = on ne sait pas encore (Firebase vérifie la session), null = pas connecté
  const [utilisateur, setUtilisateur] = useState(firebaseActif ? undefined : null)

  useEffect(() => {
    if (!firebaseActif) return
    // Firebase prévient à la connexion, à la déconnexion et au retour sur le site
    return onAuthStateChanged(auth, setUtilisateur)
  }, [])

  const connexion = () => signInWithPopup(auth, fournisseurGoogle)
  const deconnexion = () => signOut(auth)

  return (
    <CompteContexte.Provider value={{ utilisateur, connexion, deconnexion }}>
      {children}
    </CompteContexte.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCompte = () => useContext(CompteContexte)
