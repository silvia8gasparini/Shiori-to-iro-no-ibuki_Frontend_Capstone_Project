import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ColorDetails from "./pages/ColorDetails";
import BookDetails from "./pages/BookDetails";
import Tearoom from "./pages/Tearoom";
import SignUp from "./pages/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/color-details" element={<ColorDetails />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/tea-room" element={<Tearoom />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
