import { useEffect, useState } from 'react'
import photo from '../assets/photo.jpg'

// Menu vertical à gauche : reçoit les onglets et l'onglet actif en "props" depuis App
function Header({ onglets, ongletActif, onChange }) {
  // Vrai dès que la page a défilé : le verre du menu devient plus marqué
  const [defile, setDefile] = useState(false)

  useEffect(() => {
    const surDefilement = () => {
      setDefile(window.scrollY > 8)
      // Avancement du défilement entre 0 et 1 : fait glisser le reflet du verre
      const progression = Math.min(window.scrollY / 600, 1)
      document.documentElement.style.setProperty('--defilement', progression.toFixed(3))
    }
    surDefilement()
    window.addEventListener('scroll', surDefilement, { passive: true })
    return () => window.removeEventListener('scroll', surDefilement)
  }, [])

  return (
    <aside className={defile ? 'sidebar verre defile' : 'sidebar verre'}>
      <div className="profil">
        <img src={photo} alt="" className="avatar" />
        <span className="logo">Antoine B.</span>
      </div>

      <nav className="nav">
        {onglets.map((onglet) => (
          <button
            key={onglet.id}
            type="button"
            className={onglet.id === ongletActif ? 'onglet actif' : 'onglet'}
            onClick={() => onChange(onglet.id)}
          >
            {onglet.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Header
