import {
  Home,
  Garage,
  AddBox,
  Logout,
  Login,
  Search,
  ShoppingCart,
  ReceiptLong,
  Person
} from "@mui/icons-material";
import React, {
  useEffect,
  useMemo,
  useRef,
  useReducer,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Services/AuthContext";

import "../App.css";

const menuReducer = (state) => !state;

function Navbar() {
  const { isAuthenticated, setIsAuthenticated, user } = useContext(AuthContext);
  const firstMenuItemRef = useRef(null);
  const [menuOpen, toggleMenu] = useReducer(menuReducer, false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (menuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [menuOpen]);

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  }, [setIsAuthenticated, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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
          ...(user?.role === "admin"
            ? [
                {
                  id: "CreateArticle",
                  href: "/admin/create-article",
                  text: "Créer un article",
                  icon: <AddBox />,
                  title: "Créer un article",
                },
                {
                  id: "ManageUser",
                  href: "/admin/user-management",
                  text: "Gérer les utilisateurs",
                  icon: <Person />,
                  title: "Gérer les utilisateur",
                },
                {
                  id: "AdminOrders",
                  href: "/admin/orders",
                  text: "Commandes clients",
                  icon: <ReceiptLong />,
                  title: "Gestion des commandes",
                },
              ]
            : []),
          {
            id: "Logout",
            href: "#",
            text: "Déconnexion",
            icon: <Logout />,
            title: "Déconnexion",
            onClick: handleLogout,
          },
          {
            id: "Cart",
            href: "/checkout",
            text: null,
            icon: <ShoppingCart />,
            ariaLabel: "Voir mon panier",
            title: "Panier",
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
        ];

    return {
      texts: {
        accueil: "Accueil",
        titre: "BrocaWeb",
      },
      menuItems: [...baseItems, ...authItems],
    };
  }, [handleLogout, isAuthenticated, user]);

  return (
    <header className="header">
      <div className="headerContainer">
        <h1 className="titreHeader">
          <Garage /> {texts.titre}
        </h1>
        <form className="searchForm" onSubmit={handleSearch}>
          <div className="searchFormContainer">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              name="rechercher"
            />
            <button type="submit" aria-label="Rechercher">
              <Search />
            </button>
          </div>
        </form>
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
        >
          <ul role="menu">
            {menuItems.map(
              ({ id, href, text, icon, title, onClick, ariaLabel }, index) => (
                <li key={id} role="none">
                  <a
                    href={href}
                    role="menuitem"
                    title={"Bouton " + title}
                    ref={index === 0 ? firstMenuItemRef : null}
                    aria-label={text ? undefined : ariaLabel || title}
                    onClick={(e) => {
                      if (onClick) {
                        e.preventDefault();
                        onClick();
                      }
                    }}
                  >
                    {React.cloneElement(icon, { "aria-hidden": "true" })} {text}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
