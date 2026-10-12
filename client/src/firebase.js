import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'

// Configuration du projet Firebase (console Firebase → Paramètres du projet → Vos applications → Config).
// Ces valeurs ne sont pas secrètes : elles identifient seulement le projet. La protection des données
// vient des règles de sécurité Firestore (voir firestore.rules à la racine du dépôt).
// Tant que apiKey est vide, le site fonctionne seulement en mode local (pas de connexion Google).
const config = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}

export const firebaseActif = Boolean(config.apiKey)

const app = firebaseActif ? initializeApp(config) : null

export const auth = app && getAuth(app)
export const fournisseurGoogle = new GoogleAuthProvider()

// Cache local : les données déjà chargées restent disponibles même sans réseau.
// ignoreUndefinedProperties : un champ absent (undefined) est ignoré au lieu de bloquer l'enregistrement.
export const db =
  app && initializeFirestore(app, { localCache: persistentLocalCache(), ignoreUndefinedProperties: true })
