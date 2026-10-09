function Contact() {
  return (
    <section>
      <h2>Contact</h2>
      {/* TODO : mets tes vrais liens */}
      <ul className="liens">
        <li><a href="mailto:ton.email@exemple.com">ton.email@exemple.com</a></li>
        <li><a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></li>
      </ul>
    </section>
  )
}

export default Contact
