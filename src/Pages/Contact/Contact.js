import "./contact.css";
import {
  Email,
  Send,
  Done,
  Person,
  Message,
  Subject,
} from "@mui/icons-material";
import { useState } from "react";

export default function Contact() {
  const [result, setResult] = useState("");
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setResult("Envoi en cours...");

    const formData = new FormData(event.target);
    const apiKey = process.env.REACT_APP_WEB3FORMS_KEY;

    formData.append("access_key", apiKey);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Votre message a bien été envoyé !");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
    setIsSending(false);
  };

  return (
    <div className="contactContainer">
      <div className="contactHeader">
        <Email style={{ fontSize: "3rem", color: "var(--primary)" }} />
        <h2>Contactez-nous</h2>
        <p>
          Une question ou une suggestion ? Nous vous répondrons dès que
          possible.
        </p>
      </div>

      <div className="textContact">
        {result === "Votre message a bien été envoyé !" ? (
          <div className="successContact">
            <div className="successIconCircle">
              <Done style={{ fontSize: "3rem", color: "white" }} />
            </div>
            <h3>Merci !</h3>
            <p>{result}</p>
            <button className="resetBtn" onClick={() => setResult("")}>
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="contactForm">
            <div className="inputGroup">
              <Person className="inputIcon" />
              <input
                type="text"
                name="name"
                placeholder="Votre nom"
                autoComplete="current-name"
                required
              />
            </div>

            <div className="inputGroup">
              <Email className="inputIcon" />
              <input
                type="email"
                name="email"
                placeholder="Votre e-mail"
                autoComplete="current-email"
                required
              />
            </div>

            <div className="inputGroup">
              <Subject className="inputIcon" />
              <input type="text" name="subject" placeholder="Sujet" required />
            </div>

            <div className="inputGroup">
              <Message className="inputIcon" />
              <textarea
                name="message"
                placeholder="Votre message"
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className="sendBtn" disabled={isSending}>
              {isSending ? (
                "Envoi..."
              ) : (
                <>
                  <Send /> Envoyer le message
                </>
              )}
            </button>
            {result && result !== "Votre message a bien été envoyé !" && (
              <p className="errorMessage">{result}</p>
            )}
          </form>
        )}
      </div>

      <div className="contactInfoDirect">
        <p>
          Email direct : <strong>lucaslengranddev@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}
