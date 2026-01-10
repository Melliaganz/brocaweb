import { Link } from "react-router-dom";

export default function Footer() {
  const anneeActuelle = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="footerLinks">
          <Link to="/">Accueil</Link>
          <Link to="/conditions">Conditions générales</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/a-propos">À propos</Link>
        </div>
        <div className="footerCopyright">
          © {anneeActuelle}{" "}
          <a
            href="https://github.com/Melliaganz"
            target="_blank"
            rel="noopener noreferrer"
            title="Github Melliaganz"
            className="lienGithub"
            style={{ color: "inherit" }}
          >
            Melliaganz
          </a>
          . Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
