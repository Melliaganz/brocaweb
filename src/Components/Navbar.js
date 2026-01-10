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
  useState
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Services/AuthContext";
import "../App.css";

const menuReducer = (state) => !state;

function Navbar() {
  const { isAuthenticated, setIsAuthenticated, user } = useContext(AuthContext);
  const firstMenuItemRef = useRef(null);
  const [menuOpen, toggleMenu] = useReducer(menuReducer, false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (menuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [menuOpen]);

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    if (menuOpen) toggleMenu();
    navigate("/");
  }, [setIsAuthenticated, navigate, menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (menuOpen) toggleMenu();
    }
  };

  const menuItems = useMemo(() => {
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
                  text: "Créer",
                  icon: <AddBox />,
                  title: "Créer un article",
                },
                {
                  id: "ManageUser",
                  href: "/admin/user-management",
                  text: "Utilisateurs",
                  icon: <Person />,
                  title: "Gérer les utilisateurs",
                },
                {
                  id: "AdminOrders",
                  href: "/admin/orders",
                  text: "Commandes",
                  icon: <ReceiptLong />,
                  title: "Gestion des commandes",
                },
              ]
            : [
                {
                  id: "UserOrders",
                  href: "/mes-commandes",
                  text: "Mes Commandes",
                  icon: <ReceiptLong />,
                  title: "Consulter mes commandes",
                },
              ]),
          {
            id: "Cart",
            href: "/checkout",
            text: "Panier",
            icon: <ShoppingCart />,
            title: "Panier",
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
        ];

    return [...baseItems, ...authItems];
  }, [handleLogout, isAuthenticated, user]);

  return (
    <header className="header">
      <div className="headerContainer">
        <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
          <h1 className="titreHeader">
            <Garage /> BrocaWeb
          </h1>
        </Link>

        <form className="searchForm" onSubmit={handleSearch}>
          <div className="searchFormContainer">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              name="rechercher"
              aria-label="Rechercher un article"
            />
            <button type="submit" aria-label="Lancer la recherche">
              <Search />
            </button>
          </div>
        </form>

        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`navContainer ${menuOpen ? "open" : ""}`} aria-label="Navigation principale">
          <ul>
            {menuItems.map((item, index) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className="navLink"
                  title={item.title}
                  ref={index === 0 ? firstMenuItemRef : null}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    } else if (menuOpen) {
                      toggleMenu();
                    }
                  }}
                >
                  {React.cloneElement(item.icon, { "aria-hidden": "true" })}
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
