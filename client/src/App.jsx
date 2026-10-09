import { useState } from 'react'
import Header from './components/Header.jsx'
import Accueil from './pages/Accueil.jsx'
import APropos from './pages/APropos.jsx'
import Economie from './pages/Economie.jsx'
import Contact from './pages/Contact.jsx'
import './App.css'

// Liste des onglets : id (clé interne) + libellé affiché dans le menu
const ONGLETS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'apropos', label: 'À propos de moi' },
  { id: 'economie', label: 'Économie' },
  { id: 'contact', label: 'Contact' },
]

function App() {
  // L'onglet actif est stocké dans un "state" : quand il change, React réaffiche la page
  const [ongletActif, setOngletActif] = useState('accueil')

  return (
    <div className="layout">
      <Header onglets={ONGLETS} ongletActif={ongletActif} onChange={setOngletActif} />

      <div className="colonne-droite">
        <main className="contenu">
          {ongletActif === 'accueil' && <Accueil onChange={setOngletActif} />}
          {ongletActif === 'apropos' && <APropos />}
          {ongletActif === 'economie' && <Economie />}
          {ongletActif === 'contact' && <Contact />}
        </main>

        <footer className="footer">© {new Date().getFullYear()} Antoine Boulinguez</footer>
      </div>
    </div>
  )
}

export default App
