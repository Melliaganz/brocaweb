import "./conditions.css";
import { Gavel, Security, VerifiedUser, Info } from "@mui/icons-material";

export default function Conditions() {
  return (
    <div className="conditionContainer">
      <div className="conditionHeader">
        <Gavel style={{ fontSize: "3rem", color: "var(--primary)" }} />
        <h2>Conditions Générales d’Utilisation</h2>
        <p className="lastUpdate">Dernière mise à jour : Janvier 2026</p>
      </div>

      <div className="conditionText">
        <section className="conditionSection">
          <div className="sectionTitle">
            <Info className="sectionIcon" />
            <h3>Préambule</h3>
          </div>
          <p>
            Bienvenue sur <strong>BrocaWeb</strong>. En utilisant ce site, vous acceptez sans réserve les conditions générales suivantes. 
            Ces conditions visent à définir les modalités d'accès et d'utilisation de notre plateforme de brocante en ligne.
          </p>
        </section>

        <section className="conditionSection">
          <div className="sectionTitle">
            <VerifiedUser className="sectionIcon" />
            <h3>Engagements de l'utilisateur</h3>
          </div>
          <ul>
            <li>Les utilisateurs doivent fournir des informations exactes et à jour lors de la création de leur compte.</li>
            <li>Chaque membre est responsable de la sécurité de ses identifiants de connexion.</li>
            <li>Le respect envers les autres membres de la communauté est obligatoire.</li>
          </ul>
        </section>

        <section className="conditionSection">
          <div className="sectionTitle">
            <Security className="sectionIcon" />
            <h3>Règles de vente</h3>
          </div>
          <ul>
            <li>Les articles mis en vente doivent respecter les lois en vigueur et ne pas être issus de contrefaçons.</li>
            <li>Les descriptions et photos doivent refléter l'état réel de l'objet.</li>
            <li>L’équipe de BrocaWeb se réserve le droit de supprimer sans préavis tout contenu jugé inapproprié ou frauduleux.</li>
          </ul>
        </section>
      </div>

      <div className="conditionFooter">
        <p>Vous avez des questions ? <a href="/contact">Contactez-nous</a></p>
      </div>
    </div>
  );
}
