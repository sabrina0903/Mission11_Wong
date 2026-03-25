import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookList from "./BookList";
import CartPage from "./CartPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App