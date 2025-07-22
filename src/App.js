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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/create-article" element={<CreateArticle />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
