import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ColorDetails from "./pages/ColorDetails";
import BookDetails from "./pages/BookDetails";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/color-details" element={<ColorDetails />} />
        <Route path="/books/:id" element={<BookDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
