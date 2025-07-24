import { Handyman } from "@mui/icons-material";
import "../Homepage/home.css";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <div className="homeContainer" style={{gap: 10}}>
        <Handyman />
      <h3 style={{fontSize:"40px", marginTop: "2rem"}}>Page404</h3>
      <p>La page demandé n'existe pas</p>

      <Link to="/" alt="Accueil" title="Accueil" className="btnAccueil">Retourner a la page d'accueil</Link>
    </div>
  );
}

export default Page404;
