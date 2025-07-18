import { Home, Garage } from "@mui/icons-material";
import React, { useEffect, useMemo, useRef, useReducer } from "react";
import "../App.css";
const menuReducer = (state) => !state;

function Navbar() {
  const firstMenuItemRef = useRef(null);

  const [menuOpen, toggleMenu] = useReducer(menuReducer, false);

  const { texts, menuItems } = useMemo(
    () => ({
      texts: {
        accueil: "Accueil",
        titre: "BrocaWeb",
      },
      menuItems: [
        {
          id: "Accueil",
          href: "#Accueil",
          text: "Accueil",
          icon: <Home />,
          title: "Accueil",
        },
      ],
    }),
    []
  );
  useEffect(() => {
    if (menuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="headerContainer">
        <h1 className="titreHeader">
          <Garage /> {texts.titre}
        </h1>
        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label={menuOpen ? texts.closeMenu : texts.openmenu}
          aria-expanded={menuOpen}
          aria-haspopup
        >
          {menuOpen ? "✖" : "☰"}
        </button>
        <nav
          className={`navContainer ${menuOpen ? "open" : ""}`}
          role="navigation"
          aria-hidden={!menuOpen}
        >
          <ul role="menu">
            {menuItems.map(({ id, href, text, icon, title }) => (
              <li key={id} role="menuitem">
                <a href={href} title={"Boutton " + title}>
                  {icon} {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
