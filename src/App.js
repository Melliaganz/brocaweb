import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";

import { AuthProvider } from "./Services/AuthContext";
import { CartProvider } from "./Services/CartContext";

import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";

import Home from "./Pages/Homepage/Home";

const ArticleDetail = lazy(() => import("./Pages/ArticleDetail/ArticleDetail"));
const Register = lazy(() => import("./Pages/Register/Register"));
const Login = lazy(() => import("./Pages/Login/Login"));
const CreateArticle = lazy(() => import("./Pages/CreateArticle/CreateArticle"));
const Conditions = lazy(() => import("./Pages/Conditions/Conditions"));
const Mentions = lazy(() => import("./Pages/Mentions/Mentions"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));
const APropos = lazy(() => import("./Pages/Apropos/Apropos"));
const SearchResults = lazy(() => import("./Pages/SearchResults/SearchResults"));
const Page404 = lazy(() => import("./Pages/Page404/Page404"));
const EditArticle = lazy(() => import("./Pages/EditArticle/EditArticle"));
const CategoriePage = lazy(() => import("./Pages/CategoriePage/CategoriePage"));
const Checkout = lazy(() => import("./Pages/Checkout/Checkout"));
const AdminOrders = lazy(() => import("./Pages/Orders/AdminOrders"));
const UserManagement = lazy(() => import("./Pages/Admin/UserManagement"));
const UserOrders = lazy(() => import("./Pages/UserOrder/UserOrder"));
const CategoryManager = lazy(() => import("./Pages/CategoryManager/CategoryManager"));

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
              <Suspense fallback={<div style={{ minHeight: '80vh' }}></div>}>
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
                    path="/admin/category"
                    element={<CategoryManager />} 
                  />
                  <Route
                    path="/admin/edit-article/:id"
                    element={<EditArticle />}
                  />
                  <Route path="/admin/orders" element={<AdminOrders />} />

                  <Route path="*" element={<Page404 />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
