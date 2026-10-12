import { getApps, initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore'

// Configuration du projet Firebase (console Firebase → Paramètres du projet → Vos applications → Config).
// Ces valeurs ne sont pas secrètes : elles identifient seulement le projet. La protection des données
// vient des règles de sécurité Firestore (voir firestore.rules à la racine du dépôt).
// Si apiKey est vide, le site fonctionne seulement en mode local (pas de connexion Google).
const config = {
  apiKey: 'AIzaSyCtCV5odkots2s7HOFq1Z-zwFdrFcW3lSc',
  authDomain: 'hub-perso-839a0.firebaseapp.com',
  projectId: 'hub-perso-839a0',
  storageBucket: 'hub-perso-839a0.firebasestorage.app',
  messagingSenderId: '680091600338',
  appId: '1:680091600338:web:14311a358143787ed8b40b',
}

export const firebaseActif = Boolean(config.apiKey)

// getApps() : en développement, Vite peut réexécuter ce fichier ; on réutilise alors l'app existante
const app = firebaseActif ? (getApps()[0] ?? initializeApp(config)) : null

export const auth = app && getAuth(app)
export const fournisseurGoogle = new GoogleAuthProvider()

// Cache local : les données déjà chargées restent disponibles même sans réseau.
// ignoreUndefinedProperties : un champ absent (undefined) est ignoré au lieu de bloquer l'enregistrement.
function creerBase() {
  try {
    return initializeFirestore(app, { localCache: persistentLocalCache(), ignoreUndefinedProperties: true })
  } catch {
    // Déjà initialisée (rechargement de ce fichier par Vite) : on reprend la même base
    return getFirestore(app)
  }
}

export const db = app && creerBase()
