import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookList from "./BookList";
import CartPage from "./CartPage";
import  AdminPage  from "./AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/adminbooks" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App