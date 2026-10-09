import photo from '../assets/photo.jpg'

// Menu vertical à gauche : reçoit les onglets et l'onglet actif en "props" depuis App
function Header({ onglets, ongletActif, onChange }) {
  return (
    <aside className="sidebar">
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
