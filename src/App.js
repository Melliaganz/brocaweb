import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Homepage/Home";
import ArticleDetail from "./Pages/ArticleDetail/ArticleDetail";
import Register from "./Pages/Homepage/Register/Register";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
