export default function FormShell({ eyebrow, title, description, number, children }) {
  return (
    <>
      <header className="page-header">
        <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
        <div className="user-chip"><span className="avatar">L</span><span><strong>Laboratory</strong><small>Data entry</small></span></div>
      </header>
      <section className="form-card">
        <div className="card-head"><span className="card-icon">{number === '01' ? '♙' : number === '02' ? '♧' : '⚗'}</span><div><h2>{title}</h2><p>{description}</p></div><span className="card-tag">FORM {number}</span></div>
        {children}
      </section>
      <footer className="footer"><span>© 2026 <strong>Labora</strong> · Laboratory registration</span><span>Registration portal</span></footer>
    </>
  );
}
