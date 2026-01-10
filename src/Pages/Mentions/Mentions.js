import "./mentions.css";
import { Gavel, Business, Language, Security, Shield } from "@mui/icons-material";

export default function Mentions() {
  const currentHost = window.location.hostname;
  const isVercel = currentHost.includes("vercel") || currentHost.includes("votre-domaine.com");

  return (
    <div className="mentionContainer">
      <div className="mentionHeader">
        <Gavel className="mentionIcon" />
        <h2>Mentions Légales</h2>
      </div>
      
      <div className="textMentions">
        <div className="mentionSection">
          <Business className="sectionIcon" />
          <div className="sectionContent">
            <h3>Édition du site</h3>
            <p>Ce site est édité par <strong>Melliaganz</strong>.</p>
            <p>Directeur de la publication : Melliaganz</p>
            <p>Contact : via le formulaire de contact du site</p>
          </div>
        </div>

        <div className="mentionSection">
          <Language className="sectionIcon" />
          <div className="sectionContent">
            <h3>Hébergement</h3>
            <p>
              Le site est actuellement propulsé par : 
              <strong> {isVercel ? "Vercel Inc." : currentHost}</strong>
            </p>
            {isVercel && (
              <p className="hostDetails">
                Vercel Inc., 340 S Lemon Ave #1142, Walnut, CA 91789, USA.
              </p>
            )}
          </div>
        </div>

        <div className="mentionSection">
          <Shield className="sectionIcon" />
          <div className="sectionContent">
            <h3>Protection des données (RGPD)</h3>
            <p>
              Conformément au <strong>Règlement Général sur la Protection des Données</strong>, 
              les informations collectées via le formulaire de contact sont utilisées exclusivement 
              pour répondre à vos demandes.
            </p>
            <p>
              Responsable du traitement : <strong>Melliaganz</strong>.
            </p>
            <p>
              Aucune donnée personnelle n'est cédée ou vendue à des tiers. Vous disposez d'un droit 
              d'accès, de rectification et de suppression de vos données sur simple demande.
            </p>
          </div>
        </div>

        <div className="mentionSection">
          <Security className="sectionIcon" />
          <div className="sectionContent">
            <h3>Propriété intellectuelle</h3>
            <p>
              Le design, les textes et les médias sont la propriété exclusive de 
              <strong> Melliaganz</strong>. Toute reproduction, même partielle, est 
              strictement interdite sans accord préalable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
