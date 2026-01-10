import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider } from "./Services/AuthContext";
import { CartProvider } from "./Services/CartContext";

import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";

import Home from "./Pages/Homepage/Home";
import ArticleDetail from "./Pages/ArticleDetail/ArticleDetail";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import CreateArticle from "./Pages/CreateArticle/CreateArticle";
import Conditions from "./Pages/Conditions/Conditions";
import Mentions from "./Pages/Mentions/Mentions";
import Contact from "./Pages/Contact/Contact";
import APropos from "./Pages/Apropos/Apropos";
import SearchResults from "./Pages/SearchResults/SearchResults";
import Page404 from "./Pages/Page404/Page404";
import EditArticle from "./Pages/EditArticle/EditArticle";
import CategoriePage from "./Pages/CategoriePage/CategoriePage";
import Checkout from "./Pages/Checkout/Checkout";
import AdminOrders from "./Pages/Orders/AdminOrders";
import UserManagement from "./Pages/Admin/UserManagement";
import UserOrders from "./Pages/UserOrder/UserOrder"
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Navbar />
            <main id="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/login" element={<Login />} />

                <Route
                  path="/categorie/:categorie"
                  element={<CategoriePage />}
                />
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/conditions" element={<Conditions />} />
                <Route path="/mentions-legales" element={<Mentions />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/a-propos" element={<APropos />} />
                <Route path="/mes-commandes" element={<UserOrders />} />
                <Route path="/admin/create-user" element={<Register />} />
                <Route
                  path="/admin/user-management"
                  element={<UserManagement />}
                />
                <Route
                  path="/admin/create-article"
                  element={<CreateArticle />}
                />
                <Route
                  path="/admin/edit-article/:id"
                  element={<EditArticle />}
                />
                <Route path="/admin/orders" element={<AdminOrders />} />

                <Route path="*" element={<Page404 />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
