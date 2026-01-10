import { Construction, Home } from "@mui/icons-material";
import "./page404.css";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <div className="notFoundContainer">
      <div className="notFoundContent">
        <div className="iconWrapper">
          <Construction className="notFoundIcon" />
          <span className="errorCode">404</span>
        </div>
        <h1>Oups ! Page introuvable</h1>
        <p>
          Il semble que la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btnBackHome">
          <Home /> Retourner à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default Page404;
