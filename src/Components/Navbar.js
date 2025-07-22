import { Home, Garage, AddBox, Logout, Login, PersonAdd } from "@mui/icons-material";
import React, { useEffect, useMemo, useRef, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Services/AuthContext";
import "../App.css";

const menuReducer = (state) => !state;

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const firstMenuItemRef = useRef(null);
  const [menuOpen, toggleMenu] = useReducer(menuReducer, false);
  const navigate = useNavigate();

  useEffect(() => {
    if (menuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const { texts, menuItems } = useMemo(() => {
    const baseItems = [
      {
        id: "Accueil",
        href: "/",
        text: "Accueil",
        icon: <Home />,
        title: "Accueil",
      },
    ];

    const authItems = isAuthenticated
      ? [
          {
            id: "Create",
            href: "/admin/create-article",
            text: "Créer un article",
            icon: <AddBox />,
            title: "Créer un article",
          },
          {
            id: "Logout",
            href: "#",
            text: "Déconnexion",
            icon: <Logout />,
            title: "Déconnexion",
            onClick: handleLogout,
          },
        ]
      : [
          {
            id: "Login",
            href: "/login",
            text: "Connexion",
            icon: <Login />,
            title: "Connexion",
          },
          {
            id: "Register",
            href: "/register",
            text: "Créer un compte",
            icon: <PersonAdd />,
            title: "Créer un compte",
          },
        ];

    return {
      texts: {
        accueil: "Accueil",
        titre: "BrocaWeb",
      },
      menuItems: [...baseItems, ...authItems],
    };
  }, [isAuthenticated]);

  return (
    <header className="header">
      <div className="headerContainer">
        <h1 className="titreHeader">
          <Garage /> {texts.titre}
        </h1>
        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
            {menuItems.map(({ id, href, text, icon, title, onClick }, index) => (
              <li key={id} role="menuitem">
                <a
                  href={href}
                  title={"Bouton " + title}
                  ref={index === 0 ? firstMenuItemRef : null}
                  onClick={(e) => {
                    if (onClick) {
                      e.preventDefault();
                      onClick();
                    }
                  }}
                >
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
