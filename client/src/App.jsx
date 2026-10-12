import { useState } from 'react'
import Header from './components/Header.jsx'
import Accueil from './pages/Accueil.jsx'
import APropos from './pages/APropos.jsx'
import Projets from './pages/Projets.jsx'
import Salaire from './pages/Salaire.jsx'
import Contact from './pages/Contact.jsx'
import './App.css'

// Le menu est divisé en deux groupes, chacun affiché dans son propre panneau.
// Chaque onglet : id (clé interne) + libellé affiché dans le menu
const GROUPES = [
  {
    titre: 'Informations',
    onglets: [
      { id: 'accueil', label: 'Accueil' },
      { id: 'apropos', label: 'Mon parcours' },
      { id: 'contact', label: 'Contact' },
    ],
  },
  {
    titre: 'Fonctionnalités',
    onglets: [
      { id: 'projets', label: 'Projets' },
      { id: 'salaire', label: 'Gestion de salaire' },
    ],
  },
]

function App() {
  // L'onglet actif est stocké dans un "state" : quand il change, React réaffiche la page
  const [ongletActif, setOngletActif] = useState('accueil')

  return (
    <div className="layout">
      <Header groupes={GROUPES} ongletActif={ongletActif} onChange={setOngletActif} />

      <div className="colonne-droite">
        <main className="contenu">
          {ongletActif === 'accueil' && <Accueil onChange={setOngletActif} />}
          {ongletActif === 'apropos' && <APropos />}
          {ongletActif === 'projets' && <Projets />}
          {ongletActif === 'salaire' && <Salaire />}
          {ongletActif === 'contact' && <Contact />}
          {ongletActif === 'Fin' && <Fin />}

        </main>

        <footer className="footer">© {new Date().getFullYear()} Antoine Boulinguez</footer>
      </div>
    </div>
  )
}

export default App
