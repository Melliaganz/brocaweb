import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Homepage/Home";
import ArticleDetail from "./Pages/ArticleDetail/ArticleDetail";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import { AuthProvider } from "./Services/AuthContext";
import CreateArticle from "./Pages/CreateArticle/CreateArticle";
import Conditions from "./Pages/Conditions/Conditions";
import Mentions from "./Pages/Mentions/Mentions";
import Contact from "./Pages/Contact/Contact";
import APropos from "./Pages/Apropos/Apropos";
import SearchResults from "./Pages/SearchResults/SearchResults";
import Page404 from "./Pages/Page404/Page404";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />

          <Routes>
            <Route path="*" element={<Page404 />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/create-article" element={<CreateArticle />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/mentions-legales" element={<Mentions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/a-propos" element={<APropos />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
